import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { useInfiniteOptions } from "@/hooks/useInfiniteOptions";
import type { InfiniteSelectFieldConfig } from "../types";

interface InfiniteSelectFieldProps {
  config: InfiniteSelectFieldConfig;
}

export function InfiniteSelectField({ config }: InfiniteSelectFieldProps) {
  const form = useFormContext();
  const [selectedLabel, setSelectedLabel] = useState("");

  const {
    options, isLoading, isFetchingNextPage, hasMore, searchTerm, setSearchTerm, sentinelRef,
  } = useInfiniteOptions({
    apiConfig: config.apiConfig,
    pageSize: config.apiConfig?.pageSize,
  });

  useEffect(() => {
    const value = form.watch(config.name);
    if (value) {
      const option = options.find((opt) => opt.value === value);
      if (option) setSelectedLabel(option.label);
    } else {
      setSelectedLabel("");
    }
  }, [form, config.name, options]);

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
              const option = options.find((o) => o.value === value);
              if (option) setSelectedLabel(option.label);
            }}
            value={field.value}
            disabled={config.disabled}
          >
            <FormControl>
              <SelectTrigger className={cn("w-full", !field.value && "text-muted-foreground")}>
                <SelectValue placeholder={config.placeholder || "Select an option"}>
                  {selectedLabel || config.placeholder || "Select an option"}
                </SelectValue>
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <div className="p-2">
                <Input placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="h-8" />
              </div>
              <div className="max-h-[200px] overflow-y-auto">
                {options.length === 0 && isLoading ? (
                  <div className="flex items-center justify-center py-6">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : options.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">No options found</div>
                ) : (
                  <>
                    {options.map((option) => (
                      <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
                        {option.label}
                      </SelectItem>
                    ))}
                    {hasMore && (
                      <div ref={sentinelRef} className="flex items-center justify-center py-2">
                        {isFetchingNextPage ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <span className="text-center text-xs text-muted-foreground">Scroll for more</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            </SelectContent>
          </Select>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
