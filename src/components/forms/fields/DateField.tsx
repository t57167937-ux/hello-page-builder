import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DateFieldConfig } from "../types";

interface DateFieldProps {
  config: DateFieldConfig;
}

export function DateField({ config }: DateFieldProps) {
  const form = useFormContext();

  // Watch linked date fields for min/max constraints
  const minDateFieldValue = config.minDateField ? form.watch(config.minDateField) : undefined;
  const maxDateFieldValue = config.maxDateField ? form.watch(config.maxDateField) : undefined;

  const minDate = minDateFieldValue ? new Date(minDateFieldValue) : config.minDate;
  const maxDate = maxDateFieldValue ? new Date(maxDateFieldValue) : config.maxDate;

  // Auto-clear if linked date makes current value invalid
  useEffect(() => {
    const val = form.getValues(config.name);
    if (!val) return;
    const current = new Date(val);
    if (minDate && current < new Date(new Date(minDate).setHours(0, 0, 0, 0))) {
      form.setValue(config.name, '', { shouldValidate: true });
    }
    if (maxDate && current > new Date(new Date(maxDate).setHours(23, 59, 59, 999))) {
      form.setValue(config.name, '', { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minDateFieldValue, maxDateFieldValue]);

  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", config.className)}>
          {config.label && (
            <FormLabel>
              {config.label}
              {config.required && <span className="text-destructive ml-1">*</span>}
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                  disabled={config.disabled}
                >
                  {field.value ? (
                    format(new Date(field.value), "PPP")
                  ) : (
                    <span>{config.placeholder || "Pick a date"}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date?.toISOString() || '')}
                disabled={(date) => {
                  if (minDate) {
                    const min = new Date(minDate);
                    min.setHours(0, 0, 0, 0);
                    if (date < min) return true;
                  }
                  if (maxDate) {
                    const max = new Date(maxDate);
                    max.setHours(23, 59, 59, 999);
                    if (date > max) return true;
                  }
                  return false;
                }}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
