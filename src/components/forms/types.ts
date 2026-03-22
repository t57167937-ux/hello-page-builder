// Note: buildZodSchema and generateZodSchemaCode are in @/utils/zodSchemaBuilder.ts (optional import)
// Note: Hydration utilities (applyHydration, FormHydration) are in ./hydration.ts (optional import)

// Field types supported by the form system
export type FieldType =
  | "text" | "email" | "password" | "number" | "tel" | "url"
  | "textarea" | "select" | "radio"
  | "checkbox" | "checkboxgroup"
  | "switch" | "switchgroup"
  | "combobox" | "multiselect" | "multicombobox"
  | "file" | "date" | "hidden"
  | "asyncselect" | "asyncmultiselect" | "asynccombobox" | "asyncmulticombobox"
  | "infiniteselect" | "infinitemultiselect" | "infinitecombobox" | "infinitemulticombobox";

// Option for select, radio, combobox fields
export interface FieldOption {
  label: string;
  value: string;
  disabled?: boolean;
  description?: string;
  icon?: string;
}

// File validation config
export interface FileValidation {
  maxSize?: number;
  maxFiles?: number;
  acceptedTypes?: string[];
}

// Watch transform options for auto-populate constraints
export interface WatchTransform {
  slice?: { start: number; end?: number };
  filter?: 'numbers' | 'letters' | 'alphanumeric';
  case?: 'upper' | 'lower' | 'capitalize' | 'title';
  template?: string;
}

/**
 * API configuration for async and infinite field types.
 */
export interface AsyncApiConfig {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  payload?: Record<string, unknown>;
  responseMapping: {
    dataPath: string;
    labelKey: string;
    valueKey: string;
  };
  searchParam?: string;
  pageParam?: string;
  pageSizeParam?: string;
  pageSize?: number;
  hasMorePath?: string;
}

// Base field configuration
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

// Text-based field config
export interface TextFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "password" | "tel" | "url";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// Number field config
export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

// Textarea field config
export interface TextareaFieldConfig extends BaseFieldConfig {
  type: "textarea";
  rows?: number;
  minLength?: number;
  maxLength?: number;
}

// Select field config
export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: FieldOption[];
}

// Async select field config
export interface AsyncSelectFieldConfig extends BaseFieldConfig {
  type: "asyncselect";
  options: FieldOption[];
  apiConfig?: AsyncApiConfig;
}

// Infinite select field config
export interface InfiniteSelectFieldConfig extends BaseFieldConfig {
  type: "infiniteselect";
  options: FieldOption[];
  apiConfig?: AsyncApiConfig;
}

// Radio field config
export interface RadioFieldConfig extends BaseFieldConfig {
  type: "radio";
  options: FieldOption[];
  orientation?: "horizontal" | "vertical";
}

// Checkbox field config
export interface CheckboxFieldConfig extends BaseFieldConfig {
  type: "checkbox";
  checkboxLabel?: string;
}

// Checkbox Group field config
export interface CheckboxGroupFieldConfig extends BaseFieldConfig {
  type: "checkboxgroup";
  options: FieldOption[];
  orientation?: "horizontal" | "vertical";
}

// Switch field config
export interface SwitchFieldConfig extends BaseFieldConfig {
  type: "switch";
  switchLabel?: string;
}

// Switch Group field config
export interface SwitchGroupFieldConfig extends BaseFieldConfig {
  type: "switchgroup";
  options: FieldOption[];
}

// Combobox field config
export interface ComboboxFieldConfig extends BaseFieldConfig {
  type: "combobox";
  options: FieldOption[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  creatable?: boolean;
}

// Async combobox field config
export interface AsyncComboboxFieldConfig extends BaseFieldConfig {
  type: "asynccombobox";
  options: FieldOption[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  creatable?: boolean;
  apiConfig?: AsyncApiConfig;
}

// Infinite combobox field config
export interface InfiniteComboboxFieldConfig extends BaseFieldConfig {
  type: "infinitecombobox";
  options: FieldOption[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  creatable?: boolean;
  apiConfig?: AsyncApiConfig;
}

// Multiselect field config
export interface MultiselectFieldConfig extends BaseFieldConfig {
  type: "multiselect";
  options: FieldOption[];
  maxItems?: number;
}

// Async multiselect field config
export interface AsyncMultiselectFieldConfig extends BaseFieldConfig {
  type: "asyncmultiselect";
  options: FieldOption[];
  maxItems?: number;
  apiConfig?: AsyncApiConfig;
}

// Infinite multiselect field config
export interface InfiniteMultiselectFieldConfig extends BaseFieldConfig {
  type: "infinitemultiselect";
  options: FieldOption[];
  maxItems?: number;
  apiConfig?: AsyncApiConfig;
}

// Multi-combobox field config
export interface MultiComboboxFieldConfig extends BaseFieldConfig {
  type: "multicombobox";
  options: FieldOption[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxItems?: number;
  creatable?: boolean;
}

// Async multi-combobox field config
export interface AsyncMultiComboboxFieldConfig extends BaseFieldConfig {
  type: "asyncmulticombobox";
  options: FieldOption[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxItems?: number;
  creatable?: boolean;
  apiConfig?: AsyncApiConfig;
}

// Infinite multi-combobox field config
export interface InfiniteMultiComboboxFieldConfig extends BaseFieldConfig {
  type: "infinitemulticombobox";
  options: FieldOption[];
  searchPlaceholder?: string;
  emptyMessage?: string;
  maxItems?: number;
  creatable?: boolean;
  apiConfig?: AsyncApiConfig;
}

// File field config
export interface FileFieldConfig extends BaseFieldConfig {
  type: "file";
  multiple?: boolean;
  accept?: string;
  validation?: FileValidation;
}

// Date field config
export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  minDate?: Date;
  maxDate?: Date;
  minDateField?: string;
  maxDateField?: string;
}

// Hidden field config
export interface HiddenFieldConfig extends BaseFieldConfig {
  type: "hidden";
}

// Union of all field configs
export type FormFieldConfig =
  | TextFieldConfig
  | NumberFieldConfig
  | TextareaFieldConfig
  | SelectFieldConfig
  | AsyncSelectFieldConfig
  | InfiniteSelectFieldConfig
  | RadioFieldConfig
  | CheckboxFieldConfig
  | CheckboxGroupFieldConfig
  | SwitchFieldConfig
  | SwitchGroupFieldConfig
  | ComboboxFieldConfig
  | AsyncComboboxFieldConfig
  | InfiniteComboboxFieldConfig
  | MultiselectFieldConfig
  | AsyncMultiselectFieldConfig
  | InfiniteMultiselectFieldConfig
  | MultiComboboxFieldConfig
  | AsyncMultiComboboxFieldConfig
  | InfiniteMultiComboboxFieldConfig
  | FileFieldConfig
  | DateFieldConfig
  | HiddenFieldConfig;

/** Helper type: fields that have an options property */
export type OptionFieldConfig = Extract<FormFieldConfig, { options: FieldOption[] }>;

// Form section for grouping fields
export interface FormSection {
  id: string;
  title?: string;
  description?: string;
  fields: FormFieldConfig[];
  columns?: 1 | 2 | 3 | 4;
}

// Form layout types
export type FormLayout = "single" | "multi-tab" | "wizard" | "compact";

// Complete form configuration
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

// Form submission handler
export type FormSubmitHandler<T = Record<string, unknown>> = (data: T) => void | Promise<void>;

// Get default values from form config
export function getDefaultValues(config: FormConfig): Record<string, unknown> {
  const defaults: Record<string, unknown> = {};
  const fields = config.sections.flatMap(s => s.fields);

  for (const field of fields) {
    if (field.defaultValue !== undefined) {
      defaults[field.name] = field.defaultValue;
    } else {
      switch (field.type) {
        case "checkbox":
        case "switch":
          defaults[field.name] = false;
          break;
        case "multiselect":
        case "multicombobox":
        case "asyncmultiselect":
        case "asyncmulticombobox":
        case "infinitemultiselect":
        case "infinitemulticombobox":
        case "checkboxgroup":
          defaults[field.name] = [];
          break;
        case "switchgroup":
          defaults[field.name] = {};
          break;
        case "number":
          defaults[field.name] = "";
          break;
        default:
          defaults[field.name] = "";
      }
    }
  }

  return defaults;
}
