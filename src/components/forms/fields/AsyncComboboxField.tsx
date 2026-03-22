import { useState, useMemo } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useAsyncOptions } from "@/hooks/useInfiniteOptions";
import type { AsyncComboboxFieldConfig } from "../types";

interface AsyncComboboxFieldProps {
  config: AsyncComboboxFieldConfig;
}

export function AsyncComboboxField({ config }: AsyncComboboxFieldProps) {
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
        const selectedOption = options.find((opt) => opt.value === field.value);
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
                    className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                    disabled={config.disabled || isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Loading...</span>
                      </div>
                    ) : field.value ? (
                      selectedOption?.label || field.value
                    ) : (
                      config.placeholder || "Select an option"
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command shouldFilter={false}>
                  <CommandInput
                    placeholder={config.searchPlaceholder || "Search..."}
                    value={searchTerm}
                    onValueChange={setSearchTerm}
                  />
                  <CommandList className="max-h-[300px]">
                    <CommandEmpty>{config.emptyMessage || "No option found."}</CommandEmpty>
                    <CommandGroup>
                      {filteredOptions.map((option) => (
                        <CommandItem
                          key={option.value}
                          value={option.value}
                          onSelect={() => {
                            form.setValue(config.name, option.value);
                            setOpen(false);
                          }}
                          disabled={option.disabled}
                        >
                          <Check className={cn("mr-2 h-4 w-4", field.value === option.value ? "opacity-100" : "opacity-0")} />
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
