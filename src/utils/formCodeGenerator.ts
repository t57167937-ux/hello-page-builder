import { FormConfig, FormFieldConfig, AsyncApiConfig } from "@/components/forms/types";
import { extractFields, generateZodSchemaCode } from "@/utils/zodSchemaBuilder";

const fieldComponentMap: Record<string, { component: string; file: string; uiDeps: string[] }> = {
  text: { component: "TextField", file: "TextField.tsx", uiDeps: ["input", "form"] },
  email: { component: "TextField", file: "TextField.tsx", uiDeps: ["input", "form"] },
  password: { component: "TextField", file: "TextField.tsx", uiDeps: ["input", "form"] },
  number: { component: "TextField", file: "TextField.tsx", uiDeps: ["input", "form"] },
  tel: { component: "TextField", file: "TextField.tsx", uiDeps: ["input", "form"] },
  url: { component: "TextField", file: "TextField.tsx", uiDeps: ["input", "form"] },
  textarea: { component: "TextareaField", file: "TextareaField.tsx", uiDeps: ["textarea", "form"] },
  select: { component: "SelectField", file: "SelectField.tsx", uiDeps: ["select", "form"] },
  radio: { component: "RadioField", file: "RadioField.tsx", uiDeps: ["radio-group", "label", "form"] },
  checkbox: { component: "CheckboxField", file: "CheckboxField.tsx", uiDeps: ["checkbox", "form"] },
  checkboxgroup: { component: "CheckboxGroupField", file: "CheckboxGroupField.tsx", uiDeps: ["checkbox", "label", "form"] },
  switch: { component: "SwitchField", file: "SwitchField.tsx", uiDeps: ["switch", "form"] },
  switchgroup: { component: "SwitchGroupField", file: "SwitchGroupField.tsx", uiDeps: ["switch", "label", "form"] },
  combobox: { component: "ComboboxField", file: "ComboboxField.tsx", uiDeps: ["command", "popover", "button", "form"] },
  multiselect: { component: "MultiselectField", file: "MultiselectField.tsx", uiDeps: ["command", "popover", "badge", "button", "form"] },
  multicombobox: { component: "MultiComboboxField", file: "MultiComboboxField.tsx", uiDeps: ["command", "popover", "badge", "button", "form"] },
  file: { component: "FileField", file: "FileField.tsx", uiDeps: ["input", "form"] },
  date: { component: "DateField", file: "DateField.tsx", uiDeps: ["calendar", "popover", "button", "form"] },
  asyncselect: { component: "AsyncSelectField", file: "AsyncSelectField.tsx", uiDeps: ["select", "form"] },
  asyncmultiselect: { component: "AsyncMultiSelectField", file: "AsyncMultiSelectField.tsx", uiDeps: ["command", "popover", "badge", "button", "form"] },
  asynccombobox: { component: "AsyncComboboxField", file: "AsyncComboboxField.tsx", uiDeps: ["command", "popover", "button", "form"] },
  asyncmulticombobox: { component: "AsyncMultiComboboxField", file: "AsyncMultiComboboxField.tsx", uiDeps: ["command", "popover", "badge", "button", "form"] },
  infiniteselect: { component: "InfiniteSelectField", file: "InfiniteSelectField.tsx", uiDeps: ["select", "form"] },
  infinitemultiselect: { component: "InfiniteMultiSelectField", file: "InfiniteMultiSelectField.tsx", uiDeps: ["command", "popover", "badge", "button", "form"] },
  infinitecombobox: { component: "InfiniteComboboxField", file: "InfiniteComboboxField.tsx", uiDeps: ["command", "popover", "button", "form"] },
  infinitemulticombobox: { component: "InfiniteMultiComboboxField", file: "InfiniteMultiComboboxField.tsx", uiDeps: ["command", "popover", "badge", "button", "form"] },
};

export function getUsedFieldTypes(config: FormConfig): string[] {
  const types = new Set<string>();
  config.sections.forEach(s => s.fields.forEach(f => types.add(f.type)));
  return Array.from(types);
}

export function getRequiredComponents(config: FormConfig) {
  const types = getUsedFieldTypes(config);
  const components = new Map<string, { component: string; file: string }>();
  const uiDeps = new Set<string>();
  types.forEach(type => {
    const info = fieldComponentMap[type];
    if (info) {
      components.set(info.component, { component: info.component, file: info.file });
      info.uiDeps.forEach(d => uiDeps.add(d));
    }
  });
  return {
    fieldComponents: Array.from(components.values()),
    uiComponents: Array.from(uiDeps),
    coreComponents: ["card", "separator", "button"],
  };
}

export function generateInstallCommand(config: FormConfig): string {
  const { uiComponents, coreComponents } = getRequiredComponents(config);
  const all = [...new Set([...uiComponents, ...coreComponents])].sort();
  return `npm install ${all.map(c => `@radix-ui/react-${c}`).join(" ")}`;
}

export function generateNpmInstallCommand(): string {
  return `npm install react-hook-form @hookform/resolvers zod axios`;
}

export function generateFormConfigCode(config: FormConfig): string {
  const jsonStr = JSON.stringify(config, null, 2);
  return `import { FormConfig } from "./types";

export const formConfig: FormConfig = ${jsonStr};
`;
}

export type SchemaMode = 'runtime' | 'compile-time';

/** All fields can be hydrated */
export function getHydratableFields(config: FormConfig): FormFieldConfig[] {
  return extractFields(config);
}

export function generatePageComponentCode(config: FormConfig, schemaMode: SchemaMode, hydratedFieldNames: string[]): string {
  const useHydration = hydratedFieldNames.length > 0;

  const imports: string[] = [
    `import { useMemo } from "react";`,
    `import { GenericForm } from "@/components/forms/GenericForm";`,
    `import { BackendErrorResponse } from "@/hooks/useBackendErrors";`,
    `import { formConfig } from "./formConfig";`,
    `import { formService } from "./formService";`,
  ];

  if (schemaMode === 'runtime') {
    imports.push(`import { buildZodSchema } from "@/utils/zodSchemaBuilder";`);
    imports.push(`import { extractFields } from "@/utils/zodSchemaBuilder";`);
  } else {
    imports.push(`import { formSchema } from "./formSchema";`);
  }

  if (useHydration) {
    imports.push(`import { useFormHydration } from "./useFormHydration";`);
    imports.push(`import { applyHydration } from "@/components/forms/hydration";`);
  }

  const submitHandler = `
  /**
   * Submit handler — throw BackendErrorResponse to show server errors on fields.
   * GenericForm catches the error, maps field errors to form fields,
   * and auto-navigates to the tab/step with the first error.
   *
   * Backend error format (standard):
   * { success: false, message: "Validation failed", errors: [{ field: "email", message: "Already exists" }] }
   *
   * If your backend uses a different format, use mapBackendErrors():
   * import { mapBackendErrors } from "@/hooks/useBackendErrors";
   * const mapped = mapBackendErrors(res.data, (d) => ({
   *   message: d.error_message,
   *   errors: d.validation_errors.map(e => ({ field: e.key, message: e.msg }))
   * }));
   * throw mapped;
   */
  const handleSubmit = async (data: Record<string, unknown>) => {
    // Call your service — it should throw BackendErrorResponse on validation failure
    await formService.submitForm(data);
  };`;

  let body: string;

  if (useHydration) {
    const schemaLine = schemaMode === 'runtime'
      ? `\n  // Build schema at runtime from config fields\n  const schema = useMemo(() => buildZodSchema(extractFields(config)), [config]);`
      : `\n  // Use pre-compiled schema\n  const schema = formSchema;`;

    body = `export default function MyFormPage() {
  const { hydration, isLoading } = useFormHydration();

  // Apply hydration — until it loads, use base config
  const config = useMemo(() => {
    if (!hydration || Object.keys(hydration).length === 0) return formConfig;
    return applyHydration(formConfig, hydration);
  }, [hydration]);
${schemaLine}
${submitHandler}

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-3xl text-center text-muted-foreground">
        Loading form data...
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <GenericForm config={config} schema={schema} onSubmit={handleSubmit} />
    </div>
  );
}`;
  } else {
    const schemaLine = schemaMode === 'runtime'
      ? `\n  // Build schema at runtime from config fields\n  const schema = useMemo(() => buildZodSchema(extractFields(formConfig)), []);`
      : `\n  // Use pre-compiled schema\n  const schema = formSchema;`;

    body = `export default function MyFormPage() {${schemaLine}
${submitHandler}

  return (
    <div className="container mx-auto py-8 max-w-3xl">
      <GenericForm config={formConfig} schema={schema} onSubmit={handleSubmit} />
    </div>
  );
}`;
  }

  return `${imports.join("\n")}\n\n${body}\n`;
}

export function generateHydrationHookCode(hydratedFieldNames: string[], config: FormConfig): string {
  const allFields = extractFields(config);
  const optionTypes = ['select', 'combobox', 'multiselect', 'multicombobox', 'checkboxgroup', 'radio',
    'switchgroup', 'asyncselect', 'asyncmultiselect', 'asynccombobox', 'asyncmulticombobox',
    'infiniteselect', 'infinitemultiselect', 'infinitecombobox', 'infinitemulticombobox'];

  const fieldInfos = hydratedFieldNames.map(name => {
    const field = allFields.find(f => f.name === name);
    return { name, hasOptions: field ? optionTypes.includes(field.type) : false, type: field?.type || 'text' };
  });

  const fieldFetches = fieldInfos.map(({ name, hasOptions }) => {
    if (hasOptions) {
      return `    // Fetch options for "${name}" from your API
    // const ${name}Response = await axios.get("/api/${name}-options");
    // const ${name}Data = ${name}Response.data;`;
    }
    return `    // Fetch data for "${name}" from your API
    // const ${name}Response = await axios.get("/api/${name}-data");
    // const ${name}Data = ${name}Response.data;`;
  }).join("\n\n");

  const fieldMappings = fieldInfos.map(({ name, hasOptions }) => {
    if (hasOptions) {
      return `      ${name}: [
        // Replace with: ...${name}Data.map((item: any) => ({ label: item.name, value: String(item.id) }))
        { label: "Option 1", value: "opt1" },
        { label: "Option 2", value: "opt2" },
      ],`;
    }
    return `      ${name}: {
        // Replace with actual API data
        defaultValue: "",
        placeholder: "Loaded from backend",
      },`;
  }).join("\n");

  return `// useFormHydration.ts — Custom hook to load field data from your backend
// Hydration supports ANY field type:
// - Option-based fields: provide FieldOption[]
// - Any field: provide { defaultValue, placeholder, label, description, disabled }

import { useState, useEffect } from "react";
import { FormHydration } from "@/components/forms/hydration";
// import axios from "axios";

interface HydrationState {
  hydration: FormHydration;
  isLoading: boolean;
  error: Error | null;
}

export function useFormHydration(): HydrationState {
  const [state, setState] = useState<HydrationState>({
    hydration: {},
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    async function fetchHydration() {
      try {
${fieldFetches}

        const hydration: FormHydration = {
${fieldMappings}
        };

        setState({ hydration, isLoading: false, error: null });
      } catch (err) {
        setState({ hydration: {}, isLoading: false, error: err as Error });
      }
    }

    fetchHydration();
  }, []);

  return state;
}
`;
}

export function generateTypesCode(): string {
  return `import { z } from "zod";

export type FieldType =
  | "text" | "email" | "password" | "number" | "tel" | "url"
  | "textarea" | "select" | "radio"
  | "checkbox" | "checkboxgroup"
  | "switch" | "switchgroup"
  | "combobox" | "multiselect" | "multicombobox"
  | "file" | "date" | "hidden"
  | "asyncselect" | "asyncmultiselect" | "asynccombobox" | "asyncmulticombobox"
  | "infiniteselect" | "infinitemultiselect" | "infinitecombobox" | "infinitemulticombobox";

export type FormLayout = "single" | "multi-tab" | "wizard" | "compact";

export interface FieldOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
}

export interface WatchTransform {
  slice?: { start: number; end?: number };
  filter?: 'numbers' | 'letters' | 'alphanumeric';
  case?: 'upper' | 'lower' | 'capitalize' | 'title';
  template?: string;
}

/**
 * API configuration for async and infinite field types.
 * Async: fetch all options in one API call at mount time using axios.
 * Infinite: fetch options in chunks as user types/scrolls, cache results by query.
 */
export interface AsyncApiConfig {
  /** API endpoint URL */
  url: string;
  /** HTTP method */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Custom headers */
  headers?: Record<string, string>;
  /** JSON payload for POST/PUT/PATCH */
  payload?: Record<string, unknown>;
  /** How to map API response to { label, value }[] */
  responseMapping: {
    /** Dot-notation path to the array in response (e.g. "data.items") */
    dataPath: string;
    /** Key for label (e.g. "name") */
    labelKey: string;
    /** Key for value (e.g. "id") */
    valueKey: string;
  };
  /** For infinite fields: query param name for search term */
  searchParam?: string;
  /** For infinite fields: query param name for page number */
  pageParam?: string;
  /** For infinite fields: query param name for page size */
  pageSizeParam?: string;
  /** For infinite fields: page size (default 20) */
  pageSize?: number;
  /** For infinite fields: dot-notation path to check if more pages exist */
  hasMorePath?: string;
}

export interface BaseFieldConfig {
  name: string;
  label?: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  defaultValue?: unknown;
  condition?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'contains' | 'notEmpty' | 'empty' | 'in' | 'isTrue' | 'isFalse';
    value?: string;
  };
  watchConfig?: {
    watchField: string;
    valueMap?: Record<string, string>;
    transform?: WatchTransform;
  };
  dependentOptions?: {
    watchField: string;
    optionsMap: Record<string, FieldOption[]>;
  };
}

export interface TextFieldConfig extends BaseFieldConfig { type: "text" | "email" | "password" | "tel" | "url"; minLength?: number; maxLength?: number; pattern?: string; }
export interface NumberFieldConfig extends BaseFieldConfig { type: "number"; min?: number; max?: number; step?: number; }
export interface TextareaFieldConfig extends BaseFieldConfig { type: "textarea"; rows?: number; minLength?: number; maxLength?: number; }
export interface SelectFieldConfig extends BaseFieldConfig { type: "select"; options: FieldOption[]; }
export interface AsyncSelectFieldConfig extends BaseFieldConfig { type: "asyncselect"; options: FieldOption[]; apiConfig?: AsyncApiConfig; }
export interface InfiniteSelectFieldConfig extends BaseFieldConfig { type: "infiniteselect"; options: FieldOption[]; apiConfig?: AsyncApiConfig; }
export interface RadioFieldConfig extends BaseFieldConfig { type: "radio"; options: FieldOption[]; orientation?: "vertical" | "horizontal"; }
export interface CheckboxFieldConfig extends BaseFieldConfig { type: "checkbox"; checkboxLabel?: string; }
export interface CheckboxGroupFieldConfig extends BaseFieldConfig { type: "checkboxgroup"; options: FieldOption[]; orientation?: "vertical" | "horizontal"; }
export interface SwitchFieldConfig extends BaseFieldConfig { type: "switch"; switchLabel?: string; }
export interface SwitchGroupFieldConfig extends BaseFieldConfig { type: "switchgroup"; options: FieldOption[]; }
export interface ComboboxFieldConfig extends BaseFieldConfig { type: "combobox"; options: FieldOption[]; searchPlaceholder?: string; emptyMessage?: string; }
export interface AsyncComboboxFieldConfig extends BaseFieldConfig { type: "asynccombobox"; options: FieldOption[]; searchPlaceholder?: string; emptyMessage?: string; apiConfig?: AsyncApiConfig; }
export interface InfiniteComboboxFieldConfig extends BaseFieldConfig { type: "infinitecombobox"; options: FieldOption[]; searchPlaceholder?: string; emptyMessage?: string; apiConfig?: AsyncApiConfig; }
export interface MultiselectFieldConfig extends BaseFieldConfig { type: "multiselect"; options: FieldOption[]; maxItems?: number; }
export interface AsyncMultiselectFieldConfig extends BaseFieldConfig { type: "asyncmultiselect"; options: FieldOption[]; maxItems?: number; apiConfig?: AsyncApiConfig; }
export interface InfiniteMultiselectFieldConfig extends BaseFieldConfig { type: "infinitemultiselect"; options: FieldOption[]; maxItems?: number; apiConfig?: AsyncApiConfig; }
export interface MultiComboboxFieldConfig extends BaseFieldConfig { type: "multicombobox"; options: FieldOption[]; searchPlaceholder?: string; emptyMessage?: string; maxItems?: number; }
export interface AsyncMultiComboboxFieldConfig extends BaseFieldConfig { type: "asyncmulticombobox"; options: FieldOption[]; searchPlaceholder?: string; emptyMessage?: string; maxItems?: number; apiConfig?: AsyncApiConfig; }
export interface InfiniteMultiComboboxFieldConfig extends BaseFieldConfig { type: "infinitemulticombobox"; options: FieldOption[]; searchPlaceholder?: string; emptyMessage?: string; maxItems?: number; apiConfig?: AsyncApiConfig; }
export interface FileFieldConfig extends BaseFieldConfig { type: "file"; accept?: string; multiple?: boolean; }
export interface DateFieldConfig extends BaseFieldConfig { type: "date"; minDateField?: string; maxDateField?: string; }
export interface HiddenFieldConfig extends BaseFieldConfig { type: "hidden"; }

export type FormFieldConfig =
  | TextFieldConfig | NumberFieldConfig | TextareaFieldConfig
  | SelectFieldConfig | AsyncSelectFieldConfig | InfiniteSelectFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig | CheckboxGroupFieldConfig
  | SwitchFieldConfig | SwitchGroupFieldConfig
  | ComboboxFieldConfig | AsyncComboboxFieldConfig | InfiniteComboboxFieldConfig
  | MultiselectFieldConfig | AsyncMultiselectFieldConfig | InfiniteMultiselectFieldConfig
  | MultiComboboxFieldConfig | AsyncMultiComboboxFieldConfig | InfiniteMultiComboboxFieldConfig
  | FileFieldConfig | DateFieldConfig | HiddenFieldConfig;

export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  columns?: 1 | 2 | 3 | 4;
}

export interface FormConfig {
  id: string;
  title?: string;
  description?: string;
  sections: FormSection[];
  submitLabel?: string;
  resetLabel?: string;
  showReset?: boolean;
  className?: string;
  layout?: FormLayout;
}

export type FormSubmitHandler<T = Record<string, unknown>> = (data: T) => void | Promise<void>;

export function getDefaultValues(config: FormConfig): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  const fields = config.sections.flatMap(s => s.fields);
  for (const field of fields) {
    if (field.defaultValue !== undefined) { defaults[field.name] = field.defaultValue; continue; }
    switch (field.type) {
      case "checkbox": case "switch": defaults[field.name] = false; break;
      case "multiselect": case "multicombobox": case "checkboxgroup":
      case "asyncmultiselect": case "asyncmulticombobox":
      case "infinitemultiselect": case "infinitemulticombobox":
        defaults[field.name] = []; break;
      case "switchgroup": defaults[field.name] = {}; break;
      default: defaults[field.name] = "";
    }
  }
  return defaults;
}
`;
}

export function generateZodSchemaBuilderCode(): string {
  return `import { z } from "zod";
import type { FormFieldConfig, TextFieldConfig, TextareaFieldConfig, MultiselectFieldConfig, FileFieldConfig } from "./types";

/**
 * Build a Zod schema dynamically from field configs at runtime.
 * OPTIONAL — only import if you need runtime schema generation.
 */
export function buildZodSchema(fields: FormFieldConfig[]): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};
  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny;
    switch (field.type) {
      case "email":
        fieldSchema = field.required
          ? z.string().min(1, "Email is required").email("Invalid email")
          : z.string().email("Invalid email");
        break;
      case "number":
        fieldSchema = z.coerce.number();
        break;
      case "checkbox": case "switch":
        fieldSchema = z.boolean();
        break;
      case "checkboxgroup": case "multiselect": case "multicombobox":
      case "asyncmultiselect": case "asyncmulticombobox":
      case "infinitemultiselect": case "infinitemulticombobox":
        fieldSchema = z.array(z.string());
        break;
      case "switchgroup":
        fieldSchema = z.record(z.string(), z.boolean());
        break;
      case "file":
        fieldSchema = z.instanceof(File).optional();
        break;
      default:
        fieldSchema = z.string();
        if (field.required) fieldSchema = (fieldSchema as z.ZodString).min(1, field.label + " is required");
    }
    if (!field.required && field.type !== "checkbox" && field.type !== "switch") {
      fieldSchema = fieldSchema.optional();
    }
    shape[field.name] = fieldSchema;
  }
  return z.object(shape);
}
`;
}

export function generateFormServiceCode(): string {
  return `// formService.ts — Service layer for form API operations.
// All backend logic lives here — no static/mock data in UI components.
// Uses a standard error format that GenericForm understands.

import axios from "axios";
import { BackendErrorResponse } from "@/hooks/useBackendErrors";

const API_BASE = "/api"; // Change to your actual API base URL

/**
 * Submit form data to backend.
 * Throws BackendErrorResponse if server returns validation errors.
 * GenericForm catches this and maps errors to individual form fields.
 */
export const formService = {
  async submitForm(data: Record<string, unknown>): Promise<void> {
    try {
      await axios.post(\`\${API_BASE}/forms/submit\`, data);
    } catch (error: any) {
      if (error.response?.data) {
        const serverResponse = error.response.data;

        // If backend returns standard format: { success: false, message, errors: [{ field, message }] }
        if (serverResponse.errors && Array.isArray(serverResponse.errors)) {
          throw serverResponse as BackendErrorResponse;
        }

        // If backend returns a different format, map it here:
        // Example: { error: "msg", fieldErrors: { email: "taken" } }
        // throw mapBackendErrors(serverResponse, (res) => ({
        //   message: res.error,
        //   errors: Object.entries(res.fieldErrors || {}).map(([field, msg]) => ({
        //     field,
        //     message: msg as string,
        //   })),
        // }));

        throw {
          success: false,
          message: serverResponse.message || "Server error",
          errors: [],
        } as BackendErrorResponse;
      }
      throw { success: false, message: "Network error — please try again", errors: [] } as BackendErrorResponse;
    }
  },
};
`;
}

export function generateGenericFormCode(): string {
  const lines = [
    '// GenericForm.tsx — Pure form renderer with backend error handling.',
    '// Catches errors thrown by onSubmit, maps field errors, and navigates to error tab/step.',
    '',
    'import { useState, useEffect } from "react";',
    'import { useForm, UseFormReturn } from "react-hook-form";',
    'import { zodResolver } from "@hookform/resolvers/zod";',
    'import { z } from "zod";',
    'import { Form } from "@/components/ui/form";',
    'import { Button } from "@/components/ui/button";',
    'import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";',
    'import { Separator } from "@/components/ui/separator";',
    'import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";',
    'import { Badge } from "@/components/ui/badge";',
    'import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";',
    'import { cn } from "@/lib/utils";',
    'import { FormConfig, FormSubmitHandler, getDefaultValues } from "./types";',
    'import { GenericFormField } from "./GenericFormField";',
    'import { ChevronLeft, ChevronRight, AlertCircle, Check, AlertTriangle, X } from "lucide-react";',
    'import { Progress } from "@/components/ui/progress";',
    '',
    '/**',
    ' * Standard backend error response format.',
    ' * Your backend should return errors in this shape.',
    ' *',
    ' * Example: { success: false, message: "Validation failed",',
    ' *   errors: [{ field: "email", message: "Already exists" }] }',
    ' */',
    'export interface BackendFieldError { field: string; message: string; }',
    'export interface BackendErrorResponse { success: false; message: string; errors?: BackendFieldError[]; }',
    '',
    '/** Map custom backend error formats to the standard format. */',
    'export function mapBackendErrors<T>(',
    '  response: T, mapper: (res: T) => { message: string; errors?: BackendFieldError[] }',
    '): BackendErrorResponse {',
    '  return { success: false, ...mapper(response) };',
    '}',
    '',
    'function applyBackendErrors(form: UseFormReturn<any>, config: FormConfig, backendErrors: BackendFieldError[]): number {',
    '  let firstIdx = -1;',
    '  for (const err of backendErrors) {',
    '    form.setError(err.field, { type: "server", message: err.message });',
    '    if (firstIdx === -1) {',
    '      const si = config.sections.findIndex(s => s.fields.some(f => f.name === err.field));',
    '      if (si !== -1) firstIdx = si;',
    '    }',
    '  }',
    '  return firstIdx;',
    '}',
    '',
    '// ... (GenericForm component with backend error handling, tab validation,',
    '// progress tracking, and auto-navigation to error sections.',
    '// See the full implementation in GenericForm.tsx in the project.)',
    '',
    'export { GenericForm };',
  ];
  return lines.join('\n');
}

export function generateGenericFormFieldCode(): string {
  return `import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { FormFieldConfig, FieldOption, WatchTransform } from "./types";
import {
  TextField, TextareaField, SelectField, RadioField,
  CheckboxField, CheckboxGroupField, SwitchField, SwitchGroupField,
  ComboboxField, MultiselectField, MultiComboboxField,
  FileField, DateField,
  InfiniteSelectField, InfiniteMultiSelectField,
  InfiniteComboboxField, InfiniteMultiComboboxField,
  AsyncSelectField, AsyncMultiSelectField,
  AsyncComboboxField, AsyncMultiComboboxField,
} from "./fields";

/** Apply transform constraints to a watched value */
function applyWatchTransform(value: string, transform: WatchTransform): string {
  let result = value || '';
  if (transform.filter === 'numbers') result = result.replace(/[^0-9]/g, '');
  else if (transform.filter === 'letters') result = result.replace(/[^a-zA-Z\\s]/g, '');
  else if (transform.filter === 'alphanumeric') result = result.replace(/[^a-zA-Z0-9]/g, '');
  if (transform.slice) result = result.slice(transform.slice.start, transform.slice.end);
  if (transform.case === 'upper') result = result.toUpperCase();
  else if (transform.case === 'lower') result = result.toLowerCase();
  else if (transform.case === 'capitalize') result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
  else if (transform.case === 'title') result = result.replace(/\\w\\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());
  if (transform.template) result = transform.template.replace('{value}', result);
  return result;
}

interface GenericFormFieldProps {
  config: FormFieldConfig;
}

export function GenericFormField({ config }: GenericFormFieldProps) {
  const form = useFormContext();

  const conditionFieldName = (config as any).condition?.field;
  const conditionValue = conditionFieldName ? form.watch(conditionFieldName) : undefined;

  const watchFieldName = (config as any).watchConfig?.watchField;
  const watchedValue = watchFieldName ? form.watch(watchFieldName) : undefined;

  const depFieldName = (config as any).dependentOptions?.watchField;
  const depValue = depFieldName ? form.watch(depFieldName) : undefined;

  useEffect(() => {
    if (!(config as any).watchConfig || !watchFieldName) return;
    const wc = (config as any).watchConfig;
    let mapped = wc.valueMap?.[String(watchedValue)] ?? String(watchedValue || '');
    if (wc.transform) mapped = applyWatchTransform(mapped, wc.transform);
    form.setValue(config.name, mapped, { shouldDirty: false });
  }, [watchedValue, watchFieldName, config.name]);

  useEffect(() => {
    if (!(config as any).dependentOptions || !depFieldName) return;
    form.setValue(config.name, '', { shouldDirty: false });
  }, [depValue]);

  const resolvedConfig = useMemo(() => {
    if (!(config as any).dependentOptions || !depValue) return config;
    const depConfig = (config as any).dependentOptions;
    const matchedOptions: FieldOption[] = depConfig.optionsMap[String(depValue)] || [];
    return { ...config, options: matchedOptions } as FormFieldConfig;
  }, [config, depValue]);

  if ((config as any).condition && conditionFieldName) {
    const { operator, value } = (config as any).condition;
    let visible = true;
    switch (operator) {
      case 'equals': visible = String(conditionValue) === String(value); break;
      case 'notEquals': visible = String(conditionValue) !== String(value); break;
      case 'contains': visible = String(conditionValue || '').includes(value || ''); break;
      case 'notEmpty': visible = !!conditionValue && conditionValue !== ''; break;
      case 'empty': visible = !conditionValue || conditionValue === ''; break;
      case 'in': visible = (value || '').split(',').map((v: string) => v.trim()).includes(String(conditionValue)); break;
      case 'isTrue': visible = conditionValue === true || conditionValue === 'true'; break;
      case 'isFalse': visible = conditionValue === false || conditionValue === 'false' || !conditionValue; break;
    }
    if (!visible) return null;
  }

  switch (resolvedConfig.type) {
    case "text": case "email": case "password": case "number": case "tel": case "url":
      return <TextField config={resolvedConfig} />;
    case "textarea":
      return <TextareaField config={resolvedConfig} />;
    case "select":
      return <SelectField config={resolvedConfig as any} />;
    case "asyncselect":
      return <AsyncSelectField config={resolvedConfig as any} />;
    case "infiniteselect":
      return <InfiniteSelectField config={resolvedConfig as any} />;
    case "combobox":
      return <ComboboxField config={resolvedConfig as any} />;
    case "asynccombobox":
      return <AsyncComboboxField config={resolvedConfig as any} />;
    case "infinitecombobox":
      return <InfiniteComboboxField config={resolvedConfig as any} />;
    case "multiselect":
      return <MultiselectField config={resolvedConfig as any} />;
    case "asyncmultiselect":
      return <AsyncMultiSelectField config={resolvedConfig as any} />;
    case "infinitemultiselect":
      return <InfiniteMultiSelectField config={resolvedConfig as any} />;
    case "multicombobox":
      return <MultiComboboxField config={resolvedConfig as any} />;
    case "asyncmulticombobox":
      return <AsyncMultiComboboxField config={resolvedConfig as any} />;
    case "infinitemulticombobox":
      return <InfiniteMultiComboboxField config={resolvedConfig as any} />;
    case "radio":
      return <RadioField config={resolvedConfig} />;
    case "checkbox":
      return <CheckboxField config={resolvedConfig} />;
    case "checkboxgroup":
      return <CheckboxGroupField config={resolvedConfig} />;
    case "switch":
      return <SwitchField config={resolvedConfig} />;
    case "switchgroup":
      return <SwitchGroupField config={resolvedConfig} />;
    case "file":
      return <FileField config={resolvedConfig} />;
    case "date":
      return <DateField config={resolvedConfig} />;
    case "hidden":
      return null;
    default:
      return null;
  }
}
`;
}

export interface GeneratedFile {
  name: string;
  path: string;
  code: string;
  language: string;
  description: string;
  isFixed: boolean;
}

export function generateAllFiles(config: FormConfig, schemaMode: SchemaMode, hydratedFieldNames: string[] = []): GeneratedFile[] {
  const files: GeneratedFile[] = [
    {
      name: "formConfig.ts",
      path: "src/forms/formConfig.ts",
      code: generateFormConfigCode(config),
      language: "typescript",
      description: "Your form's JSON configuration — defines structure, fields, validation, and layout.",
      isFixed: false,
    },
    {
      name: "MyFormPage.tsx",
      path: "src/pages/MyFormPage.tsx",
      code: generatePageComponentCode(config, schemaMode, hydratedFieldNames),
      language: "tsx",
      description: "The page component. Builds schema" +
        (schemaMode === 'runtime' ? " at runtime using buildZodSchema()" : " from pre-compiled formSchema") +
        (hydratedFieldNames.length > 0 ? ", hydrates config via useFormHydration + applyHydration()" : "") +
        ", and passes both to GenericForm.",
      isFixed: false,
    },
  ];

  if (schemaMode === 'compile-time') {
    const allFields = extractFields(config);
    files.push({
      name: "formSchema.ts",
      path: "src/forms/formSchema.ts",
      code: generateZodSchemaCode(allFields),
      language: "typescript",
      description: "Pre-compiled Zod schema. Imported in MyFormPage.tsx and passed to GenericForm via schema prop.",
      isFixed: false,
    });
  }

  if (hydratedFieldNames.length > 0) {
    files.push({
      name: "useFormHydration.ts",
      path: "src/forms/useFormHydration.ts",
      code: generateHydrationHookCode(hydratedFieldNames, config),
      language: "typescript",
      description: `Custom hook that fetches data for ${hydratedFieldNames.length} field(s) from your backend API. Called in MyFormPage.tsx, result passed to applyHydration().`,
      isFixed: false,
    });
  }

  files.push(
    {
      name: "types.ts",
      path: "src/components/forms/types.ts",
      code: generateTypesCode(),
      language: "typescript",
      description: "TypeScript types, getDefaultValues(), AsyncApiConfig. Install once.",
      isFixed: true,
    },
  );

  // Only include zodSchemaBuilder when runtime schema mode is selected
  if (schemaMode === 'runtime') {
    files.push({
      name: "zodSchemaBuilder.ts",
      path: "src/utils/zodSchemaBuilder.ts",
      code: generateZodSchemaBuilderCode(),
      language: "typescript",
      description: "buildZodSchema() for runtime schema generation from JSON config. Required for runtime mode.",
      isFixed: false,
    });
  }

  files.push(
    {
      name: "formService.ts",
      path: "src/forms/formService.ts",
      code: generateFormServiceCode(),
      language: "typescript",
      description: "Service layer for form API operations. All backend calls go here. Throws BackendErrorResponse on validation errors.",
      isFixed: false,
    },
    {
      name: "GenericForm.tsx",
      path: "src/components/forms/GenericForm.tsx",
      code: generateGenericFormCode(),
      language: "tsx",
      description: "Form renderer with backend error handling. Catches errors, maps to fields, auto-navigates to error tab/step. Install once.",
      isFixed: true,
    },
    {
      name: "GenericFormField.tsx",
      path: "src/components/forms/GenericFormField.tsx",
      code: generateGenericFormFieldCode(),
      language: "tsx",
      description: "Renders individual fields with conditional visibility, auto-populate, and watch transforms. Install once.",
      isFixed: true,
    },
  );

  return files;
}
