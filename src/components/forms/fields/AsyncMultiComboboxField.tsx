import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useAsyncOptions, type InfiniteOption } from "@/hooks/useInfiniteOptions";
import type { AsyncMultiComboboxFieldConfig } from "../types";

interface AsyncMultiComboboxFieldProps {
  config: AsyncMultiComboboxFieldConfig;
}

export function AsyncMultiComboboxField({ config }: AsyncMultiComboboxFieldProps) {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const { options, isLoading, filterOptions } = useAsyncOptions({
    apiConfig: config.apiConfig,
    initialOptions: config.options,
  });

  const filteredOptions = useMemo(() => filterOptions(searchTerm), [filterOptions, searchTerm]);

  return (
    <FormField
      control={form.control}
      name={config.name}
      render={({ field }) => {
        const selectedValues = (field.value as string[]) || [];

        const toggleOption = (option: InfiniteOption) => {
          const newValues = selectedValues.includes(option.value)
            ? selectedValues.filter((v) => v !== option.value)
            : [...selectedValues, option.value];
          if (config.maxItems && newValues.length > config.maxItems) return;
          field.onChange(newValues);
        };

        const removeValue = (value: string) => {
          field.onChange(selectedValues.filter((v) => v !== value));
        };

        const getLabel = (value: string) => options.find((o) => o.value === value)?.label || value;

        return (
          <FormItem className={cn("flex flex-col", config.className)}>
            {config.label && (
              <FormLabel>
                {config.label}
                {config.required && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full min-h-10 h-auto justify-between", !selectedValues.length && "text-muted-foreground")}
                    disabled={config.disabled || isLoading}
                  >
                    <div className="flex flex-wrap gap-1 flex-1">
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading...</span>
                        </div>
                      ) : selectedValues.length > 0 ? (
                        selectedValues.map((value) => (
                          <Badge key={value} variant="secondary" className="mr-1">
                            {getLabel(value)}
                            <button
                              className="ml-1 rounded-full outline-none focus:ring-2 focus:ring-ring"
                              onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); }}
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); removeValue(value); }}
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      ) : (
                        <span>{config.placeholder || "Select options"}</span>
                      )}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput placeholder={config.searchPlaceholder || "Search..."} value={searchTerm} onValueChange={setSearchTerm} />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>{config.emptyMessage || "No option found."}</CommandEmpty>
                    <CommandGroup>
                      {filteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => toggleOption(option)}
                          disabled={option.disabled}
                        >
                          <Check className={cn("mr-2 h-4 w-4", selectedValues.includes(option.value) ? "opacity-100" : "opacity-0")} />
                          {option.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {config.description && <FormDescription>{config.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
