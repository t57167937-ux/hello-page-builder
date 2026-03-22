import { z } from "zod";
import type {
  FormFieldConfig,
  FormConfig,
  NumberFieldConfig,
  TextFieldConfig,
  TextareaFieldConfig,
  MultiselectFieldConfig,
  FileFieldConfig,
} from "@/components/forms/types";

/** Extract all fields from a form config */
export function extractFields(config: FormConfig): FormFieldConfig[] {
  return config.sections.flatMap((section) => section.fields);
}

/**
 * Evaluate a field's condition against current form values.
 * Returns true if the field should be VISIBLE (and thus required).
 */
export function evaluateCondition(
  condition: FormFieldConfig["condition"],
  formValues: Record<string, unknown>
): boolean {
  if (!condition) return true;
  const { field, operator, value } = condition;
  const condVal = formValues[field];
  switch (operator) {
    case "equals": return String(condVal) === String(value);
    case "notEquals": return String(condVal) !== String(value);
    case "contains": return String(condVal || "").includes(value || "");
    case "notEmpty": return !!condVal && condVal !== "";
    case "empty": return !condVal || condVal === "";
    case "in": return (value || "").split(",").map((v: string) => v.trim()).includes(String(condVal));
    case "isTrue": return condVal === true || condVal === "true";
    case "isFalse": return condVal === false || condVal === "false" || !condVal;
    default: return true;
  }
}

/**
 * Build a Zod schema dynamically from field configs at runtime.
 * Pass optional `formValues` to make conditional fields properly required/optional
 * based on the current form state — fields hidden by a condition become fully optional.
 *
 * Usage in your page component:
 *   const schema = useMemo(() => buildZodSchema(extractFields(config)), [config]);
 *   <GenericForm config={config} schema={schema} onSubmit={handleSubmit} />
 */
export function buildZodSchema(
  fields: FormFieldConfig[],
  formValues?: Record<string, unknown>
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of fields) {
    let fieldSchema: z.ZodTypeAny;

    // If the field has a condition and we have form values, check visibility.
    const isVisible = field.condition && formValues
      ? evaluateCondition(field.condition, formValues)
      : true;

    // SHORTCUT: hidden conditional fields → z.any().optional() immediately.
    // This skips ALL constraints (min length, required, etc.) for hidden fields,
    // so empty-string default values don't cause spurious validation errors.
    if (field.condition && formValues && !isVisible) {
      shape[field.name] = z.any().optional();
      continue;
    }

    switch (field.type) {
      case "text":
      case "password":
      case "tel":
      case "url":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label || field.name} is required`);
        }
        if ((field as TextFieldConfig).minLength) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            (field as TextFieldConfig).minLength!,
            `Minimum ${(field as TextFieldConfig).minLength} characters`
          );
        }
        if ((field as TextFieldConfig).maxLength) {
          fieldSchema = (fieldSchema as z.ZodString).max(
            (field as TextFieldConfig).maxLength!,
            `Maximum ${(field as TextFieldConfig).maxLength} characters`
          );
        }
        break;

      case "email":
        fieldSchema = field.required
          ? z.string().min(1, `${field.label || field.name} is required`).email("Invalid email address")
          : z.string().email("Invalid email address");
        break;

      case "number": {
        // Normalise raw value: empty string / null → undefined so optional fields pass.
        const toNum = (val: unknown) =>
          val === "" || val === null || val === undefined ? undefined : Number(val);

        const numField = field as NumberFieldConfig;
        let baseNum = z.number({ invalid_type_error: "Must be a number" });
        if (numField.min !== undefined)
          baseNum = baseNum.min(numField.min, `Minimum value is ${numField.min}`);
        if (numField.max !== undefined)
          baseNum = baseNum.max(numField.max, `Maximum value is ${numField.max}`);

        if (field.required) {
          // Required: empty string is an error, must be a valid number
          fieldSchema = z.preprocess(
            (val) => (val === "" || val === null || val === undefined ? undefined : Number(val)),
            baseNum
          );
        } else {
          // Optional: preprocess normalises empty string → undefined,
          // then allow undefined OR a valid number.
          fieldSchema = z.preprocess(toNum, baseNum.optional());
        }
        break;
      }

      case "textarea":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label || field.name} is required`);
        }
        if ((field as TextareaFieldConfig).minLength) {
          fieldSchema = (fieldSchema as z.ZodString).min(
            (field as TextareaFieldConfig).minLength!,
            `Minimum ${(field as TextareaFieldConfig).minLength} characters`
          );
        }
        if ((field as TextareaFieldConfig).maxLength) {
          fieldSchema = (fieldSchema as z.ZodString).max(
            (field as TextareaFieldConfig).maxLength!,
            `Maximum ${(field as TextareaFieldConfig).maxLength} characters`
          );
        }
        break;

      case "select":
      case "combobox":
      case "asyncselect":
      case "asynccombobox":
      case "infiniteselect":
      case "infinitecombobox":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label || field.name} is required`);
        }
        break;

      case "radio":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label || field.name} is required`);
        }
        break;

      case "checkbox":
      case "switch":
        fieldSchema = z.boolean();
        break;

      case "checkboxgroup":
        fieldSchema = z.array(z.string());
        break;

      case "switchgroup":
        fieldSchema = z.record(z.string(), z.boolean());
        break;

      case "multiselect":
      case "multicombobox":
      case "asyncmultiselect":
      case "asyncmulticombobox":
      case "infinitemultiselect":
      case "infinitemulticombobox":
        fieldSchema = z.array(z.string());
        if ((field as MultiselectFieldConfig).maxItems) {
          fieldSchema = (fieldSchema as z.ZodArray<z.ZodString>).max(
            (field as MultiselectFieldConfig).maxItems!,
            `Maximum ${(field as MultiselectFieldConfig).maxItems} items`
          );
        }
        break;

      case "file": {
        const fileField = field as FileFieldConfig;
        if (fileField.multiple) {
          fieldSchema = z.array(z.instanceof(File)).refine(
            (files) => {
              if (fileField.validation?.maxFiles && files.length > fileField.validation.maxFiles) return false;
              if (fileField.validation?.maxSize) return files.every((f) => f.size <= fileField.validation!.maxSize!);
              return true;
            },
            { message: fileField.validation?.maxSize ? `File size must be less than ${Math.round(fileField.validation.maxSize / 1024 / 1024)}MB` : "Invalid file" }
          );
        } else {
          fieldSchema = z.instanceof(File).optional().refine(
            (file) => {
              if (!file) return true;
              if (fileField.validation?.maxSize && file.size > fileField.validation.maxSize) return false;
              return true;
            },
            { message: fileField.validation?.maxSize ? `File size must be less than ${Math.round(fileField.validation.maxSize / 1024 / 1024)}MB` : "Invalid file" }
          );
        }
        break;
      }

      case "date":
        fieldSchema = z.string();
        if (field.required) {
          fieldSchema = (fieldSchema as z.ZodString).min(1, `${field.label || field.name} is required`);
        }
        break;

      case "hidden":
        fieldSchema = z.string();
        break;

      default:
        fieldSchema = z.string();
    }

    // Post-processing: make field optional when it is hidden (conditional + not visible)
    // or when it is simply not required.
    // boolean types (checkbox/switch) and number (already handled above) are skipped.
    const fieldIsHidden = !!field.condition && !isVisible;
    const isBoolType = field.type === "checkbox" || field.type === "switch";
    const isNumType = field.type === "number";

    if (fieldIsHidden) {
      // Hidden field → fully optional regardless of field.required
      if (!isNumType && !isBoolType) {
        fieldSchema = fieldSchema.optional();
      } else if (isNumType) {
        // Hidden number → accept anything (empty string, undefined, number)
        fieldSchema = z.any().optional();
      }
      // boolean hidden fields: keep z.boolean() — they default to false and that's fine
    } else if (!field.required && !isBoolType && !isNumType) {
      // Visible but not required non-boolean non-number → optional
      fieldSchema = fieldSchema.optional();
    }
    // Required visible fields: no change — keep as-is (required by schema)

    shape[field.name] = fieldSchema;
  }

  return z.object(shape);
}

/**
 * Generate compile-time Zod schema code from field config.
 * Produces a static formSchema.ts file string for full IDE type inference.
 */
export function generateZodSchemaCode(fields: FormFieldConfig[]): string {
  const lines: string[] = ['import { z } from "zod";', '', 'export const formSchema = z.object({'];

  for (const field of fields) {
    let chain = '';
    switch (field.type) {
      case "email":
        chain = field.required
          ? 'z.string().min(1, "' + (field.label || field.name) + ' is required").email("Invalid email")'
          : 'z.string().email("Invalid email").optional()';
        break;
      case "number":
        chain = 'z.coerce.number()';
        if ((field as NumberFieldConfig).min !== undefined) chain += `.min(${(field as NumberFieldConfig).min})`;
        if ((field as NumberFieldConfig).max !== undefined) chain += `.max(${(field as NumberFieldConfig).max})`;
        if (!field.required) chain += '.optional()';
        break;
      case "checkbox":
      case "switch":
        chain = 'z.boolean()';
        break;
      case "checkboxgroup":
      case "multiselect":
      case "multicombobox":
      case "asyncmultiselect":
      case "asyncmulticombobox":
      case "infinitemultiselect":
      case "infinitemulticombobox":
        chain = 'z.array(z.string())';
        if ((field as MultiselectFieldConfig).maxItems) chain += `.max(${(field as MultiselectFieldConfig).maxItems})`;
        if (!field.required) chain += '.optional()';
        break;
      case "switchgroup":
        chain = 'z.record(z.string(), z.boolean())';
        break;
      case "file":
        chain = 'z.instanceof(File).optional()';
        break;
      default:
        chain = 'z.string()';
        if (field.required) chain += `.min(1, "${field.label || field.name} is required")`;
        else chain += '.optional()';
    }
    lines.push(`  ${field.name}: ${chain},`);
  }

  lines.push('});', '', 'export type FormValues = z.infer<typeof formSchema>;');
  return lines.join('\n');
}
