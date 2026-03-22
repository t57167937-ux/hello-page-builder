import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { TextFieldConfig, NumberFieldConfig } from "../types";

type TextOrNumberFieldConfig = TextFieldConfig | NumberFieldConfig;

interface TextFieldProps {
  config: TextOrNumberFieldConfig;
}

export function TextField({ config }: TextFieldProps) {
  const form = useFormContext();

  const inputType = config.type;
  const isNumber = config.type === "number";
  const min = isNumber ? (config as NumberFieldConfig).min : undefined;
  const max = isNumber ? (config as NumberFieldConfig).max : undefined;
  const step = isNumber ? (config as NumberFieldConfig).step : undefined;
  const minLength = 'minLength' in config ? config.minLength : undefined;
  const maxLength = 'maxLength' in config ? config.maxLength : undefined;

  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field }) => (
        <FormItem className={config.className}>
          {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
          <FormControl>
            <Input
              type={inputType}
              placeholder={config.placeholder}
              disabled={config.disabled}
              min={min}
              max={max}
              step={step}
              minLength={minLength}
              maxLength={maxLength}
              {...field}
              onChange={(e) => {
                if (isNumber) {
                  const raw = e.target.value;
                  if (raw === "") {
                    field.onChange("");
                    return;
                  }
                  let num = parseFloat(raw);
                  // Clamp to min/max on change
                  if (min !== undefined && !isNaN(num) && num < min) num = min;
                  if (max !== undefined && !isNaN(num) && num > max) num = max;
                  field.onChange(isNaN(num) ? raw : String(num));
                  // Also update the native input value to reflect the clamp
                  if (!isNaN(num)) e.target.value = String(num);
                } else {
                  field.onChange(e.target.value);
                }
              }}
              onBlur={(e) => {
                if (isNumber && e.target.value !== "") {
                  let num = parseFloat(e.target.value);
                  if (!isNaN(num)) {
                    if (min !== undefined && num < min) num = min;
                    if (max !== undefined && num > max) num = max;
                    field.onChange(String(num));
                    e.target.value = String(num);
                  }
                }
                field.onBlur();
              }}
            />
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
