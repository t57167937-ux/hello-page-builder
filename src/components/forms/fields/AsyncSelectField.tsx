import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useAsyncOptions } from "@/hooks/useInfiniteOptions";
import type { AsyncSelectFieldConfig } from "../types";

interface AsyncSelectFieldProps {
  config: AsyncSelectFieldConfig;
}

export function AsyncSelectField({ config }: AsyncSelectFieldProps) {
  const form = useFormContext();
  const [selectedLabel, setSelectedLabel] = useState("");

  const { options, isLoading } = useAsyncOptions({
    apiConfig: config.apiConfig,
    initialOptions: config.options,
  });

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
          <Select
            onValueChange={(value) => {
              field.onChange(value);
              const opt = options.find((o) => o.value === value);
              if (opt) setSelectedLabel(opt.label);
            }}
            value={field.value}
            disabled={config.disabled || isLoading}
          >
            <FormControl>
              <SelectTrigger className={cn("w-full", !field.value && "text-muted-foreground")}>
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Loading...</span>
                  </div>
                ) : (
                  <SelectValue placeholder={config.placeholder || "Select an option"}>
                    {selectedLabel || field.value || config.placeholder || "Select an option"}
                  </SelectValue>
                )}
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
