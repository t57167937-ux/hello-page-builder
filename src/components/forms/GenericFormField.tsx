import { useEffect, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import type {
  FormFieldConfig, FieldOption, WatchTransform,
  BaseFieldConfig, OptionFieldConfig,
} from "./types";
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
  else if (transform.filter === 'letters') result = result.replace(/[^a-zA-Z\s]/g, '');
  else if (transform.filter === 'alphanumeric') result = result.replace(/[^a-zA-Z0-9]/g, '');

  if (transform.slice) {
    result = result.slice(transform.slice.start, transform.slice.end);
  }

  if (transform.case === 'upper') result = result.toUpperCase();
  else if (transform.case === 'lower') result = result.toLowerCase();
  else if (transform.case === 'capitalize') result = result.charAt(0).toUpperCase() + result.slice(1).toLowerCase();
  else if (transform.case === 'title') result = result.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase());

  if (transform.template) {
    result = transform.template.replace('{value}', result);
  }

  return result;
}

/** Type guard: check if a field config has options */
function hasOptions(config: FormFieldConfig): config is OptionFieldConfig {
  return 'options' in config;
}

interface GenericFormFieldProps {
  config: FormFieldConfig;
}

export function GenericFormField({ config }: GenericFormFieldProps) {
  const form = useFormContext();

  // Conditional visibility
  const conditionFieldName = config.condition?.field;
  const conditionValue = conditionFieldName ? form.watch(conditionFieldName) : undefined;

  // Watch auto-populate
  const watchFieldName = config.watchConfig?.watchField;
  const watchedValue = watchFieldName ? form.watch(watchFieldName) : undefined;

  // Dependent options
  const depFieldName = config.dependentOptions?.watchField;
  const depValue = depFieldName ? form.watch(depFieldName) : undefined;

  useEffect(() => {
    if (!config.watchConfig || !watchFieldName) return;
    const wc = config.watchConfig;
    const valueMap = wc.valueMap;
    let mapped = valueMap?.[String(watchedValue)] ?? String(watchedValue || '');

    if (wc.transform) {
      mapped = applyWatchTransform(mapped, wc.transform);
    }

    form.setValue(config.name, mapped, { shouldDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchedValue, watchFieldName, config.name]);

  // Clear dependent field when parent changes
  useEffect(() => {
    if (!config.dependentOptions || !depFieldName) return;
    form.setValue(config.name, '', { shouldDirty: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depValue]);

  // Resolve dependent options
  const resolvedConfig = useMemo((): FormFieldConfig => {
    if (!config.dependentOptions || !depValue) return config;
    const depConfig = config.dependentOptions;
    const matchedOptions: FieldOption[] = depConfig.optionsMap[String(depValue)] || [];
    if (hasOptions(config)) {
      return { ...config, options: matchedOptions };
    }
    return config;
  }, [config, depValue]);

  // Evaluate condition — AFTER all hooks
  if (config.condition && conditionFieldName) {
    const { operator, value } = config.condition;
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

  // ─── Field type → Component mapping ───
  switch (resolvedConfig.type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "url":
      return <TextField config={resolvedConfig} />;
    case "number":
      return <TextField config={resolvedConfig} />;
    case "textarea":
      return <TextareaField config={resolvedConfig} />;

    // ─── Select variants ───
    case "select":
      return <SelectField config={resolvedConfig} />;
    case "asyncselect":
      return <AsyncSelectField config={resolvedConfig} />;
    case "infiniteselect":
      return <InfiniteSelectField config={resolvedConfig} />;

    // ─── Combobox variants ───
    case "combobox":
      return <ComboboxField config={resolvedConfig} />;
    case "asynccombobox":
      return <AsyncComboboxField config={resolvedConfig} />;
    case "infinitecombobox":
      return <InfiniteComboboxField config={resolvedConfig} />;

    // ─── Multiselect variants ───
    case "multiselect":
      return <MultiselectField config={resolvedConfig} />;
    case "asyncmultiselect":
      return <AsyncMultiSelectField config={resolvedConfig} />;
    case "infinitemultiselect":
      return <InfiniteMultiSelectField config={resolvedConfig} />;

    // ─── Multi-combobox variants ───
    case "multicombobox":
      return <MultiComboboxField config={resolvedConfig} />;
    case "asyncmulticombobox":
      return <AsyncMultiComboboxField config={resolvedConfig} />;
    case "infinitemulticombobox":
      return <InfiniteMultiComboboxField config={resolvedConfig} />;

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
