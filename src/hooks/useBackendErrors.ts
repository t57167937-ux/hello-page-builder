/**
 * useBackendErrors — Hook + utilities for handling backend validation errors.
 * Optional — only import if your form needs server-side error mapping.
 *
 * Standard backend error format:
 * { success: false, message: "Validation failed", errors: [{ field: "email", message: "Already exists" }] }
 *
 * If your backend uses a different format, use mapBackendErrors() to transform it.
 */

import { UseFormReturn } from "react-hook-form";
import type { FormConfig } from "@/components/forms/types";

export interface BackendFieldError {
  /** Field name — must match the `name` in your FormConfig field */
  field: string;
  /** Error message to display */
  message: string;
}

export interface BackendErrorResponse {
  success: false;
  message: string;
  errors?: BackendFieldError[];
}

/**
 * Helper to map custom backend error formats to the standard format.
 *
 * Example:
 *   const mapped = mapBackendErrors(apiResponse, (res) => ({
 *     message: res.error,
 *     errors: Object.entries(res.fieldErrors).map(([field, msg]) => ({ field, message: msg as string })),
 *   }));
 */
export function mapBackendErrors<T>(
  response: T,
  mapper: (res: T) => { message: string; errors?: BackendFieldError[] }
): BackendErrorResponse {
  const mapped = mapper(response);
  return { success: false, ...mapped };
}

/**
 * Apply backend errors to form fields and return the section index of the first error.
 * Returns -1 if no field-level errors found.
 */
export function applyBackendErrors(
  form: UseFormReturn<Record<string, unknown>>,
  config: FormConfig,
  backendErrors: BackendFieldError[]
): number {
  let firstErrorSectionIndex = -1;

  for (const err of backendErrors) {
    form.setError(err.field, { type: "server", message: err.message });

    if (firstErrorSectionIndex === -1) {
      const sectionIdx = config.sections.findIndex(s =>
        s.fields.some(f => f.name === err.field)
      );
      if (sectionIdx !== -1) firstErrorSectionIndex = sectionIdx;
    }
  }

  return firstErrorSectionIndex;
}
