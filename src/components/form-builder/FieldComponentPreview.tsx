import { TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./CodeBlock";
import { Package } from "lucide-react";

const fieldSourceCode: Record<string, string> = {
  "TextField.tsx": `import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TextFieldConfig } from "../types";

interface TextFieldProps { config: TextFieldConfig; }

export function TextField({ config }: TextFieldProps) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={config.className}>
          {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
          <FormControl>
            <Input type={config.type} placeholder={config.placeholder} disabled={config.disabled}
              min={config.min} max={config.max} minLength={config.minLength} maxLength={config.maxLength}
              {...field} onChange={(e) => field.onChange(config.type === "number" && e.target.value === "" ? "" : e.target.value)} />
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )} />
  );
}`,
  "TextareaField.tsx": `import { useFormContext } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TextareaFieldConfig } from "../types";

interface TextareaFieldProps { config: TextareaFieldConfig; }

export function TextareaField({ config }: TextareaFieldProps) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={config.className}>
          {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
          <FormControl>
            <Textarea placeholder={config.placeholder} disabled={config.disabled} rows={config.rows || 4}
              minLength={config.minLength} maxLength={config.maxLength} {...field} />
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )} />
  );
}`,
  "SelectField.tsx": `import { useFormContext } from "react-hook-form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SelectFieldConfig } from "../types";

interface SelectFieldProps { config: SelectFieldConfig; }

export function SelectField({ config }: SelectFieldProps) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={config.className}>
          {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
          <Select onValueChange={field.onChange} defaultValue={field.value} disabled={config.disabled}>
            <FormControl>
              <SelectTrigger><SelectValue placeholder={config.placeholder || "Select an option"} /></SelectTrigger>
            </FormControl>
            <SelectContent>
              {config.options.map((option) => (
                <SelectItem key={option.value} value={option.value} disabled={option.disabled}>{option.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )} />
  );
}`,
  "RadioField.tsx": `import { useFormContext } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioFieldConfig } from "../types";
import { cn } from "@/lib/utils";

interface RadioFieldProps { config: RadioFieldConfig; }

export function RadioField({ config }: RadioFieldProps) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={cn("space-y-3", config.className)}>
          {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
          <FormControl>
            <RadioGroup onValueChange={field.onChange} defaultValue={field.value}
              className={cn(config.orientation === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col space-y-2")} disabled={config.disabled}>
              {config.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={\`\${config.name}-\${option.value}\`} disabled={option.disabled} />
                  <Label htmlFor={\`\${config.name}-\${option.value}\`} className="font-normal cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )} />
  );
}`,
  "CheckboxField.tsx": `import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckboxFieldConfig } from "../types";
import { cn } from "@/lib/utils";

interface CheckboxFieldProps { config: CheckboxFieldConfig; }

export function CheckboxField({ config }: CheckboxFieldProps) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4", config.className)}>
          <FormControl>
            <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={config.disabled} />
          </FormControl>
          <div className="space-y-1 leading-none">
            {(config.checkboxLabel || config.label) && (
              <FormLabel className="cursor-pointer">{config.checkboxLabel || config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>
            )}
            {config.description && <FormDescription>{config.description}</FormDescription>}
            <FormMessage />
          </div>
        </FormItem>
      )} />
  );
}`,
  "CheckboxGroupField.tsx": `import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CheckboxGroupFieldConfig } from "../types";
import { cn } from "@/lib/utils";

interface Props { config: CheckboxGroupFieldConfig; }

export function CheckboxGroupField({ config }: Props) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => {
        const selected: string[] = field.value || [];
        return (
          <FormItem className={config.className}>
            {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
            <div className={cn(config.orientation === "horizontal" ? "flex flex-wrap gap-4" : "flex flex-col space-y-2")}>
              {config.options.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <FormControl>
                    <Checkbox checked={selected.includes(option.value)} disabled={config.disabled || option.disabled}
                      onCheckedChange={(checked) => {
                        if (checked) field.onChange([...selected, option.value]);
                        else field.onChange(selected.filter((v: string) => v !== option.value));
                      }} />
                  </FormControl>
                  <Label className="font-normal cursor-pointer">{option.label}</Label>
                </div>
              ))}
            </div>
            {config.description && <FormDescription>{config.description}</FormDescription>}
            <FormMessage />
          </FormItem>
        );
      }} />
  );
}`,
  "SwitchField.tsx": `import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SwitchFieldConfig } from "../types";
import { cn } from "@/lib/utils";

interface SwitchFieldProps { config: SwitchFieldConfig; }

export function SwitchField({ config }: SwitchFieldProps) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-row items-center justify-between rounded-lg border p-4", config.className)}>
          <div className="space-y-0.5">
            {(config.switchLabel || config.label) && (
              <FormLabel className="cursor-pointer">{config.switchLabel || config.label}</FormLabel>
            )}
            {config.description && <FormDescription>{config.description}</FormDescription>}
          </div>
          <FormControl>
            <Switch checked={field.value} onCheckedChange={field.onChange} disabled={config.disabled} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )} />
  );
}`,
  "SwitchGroupField.tsx": `import { useFormContext } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SwitchGroupFieldConfig } from "../types";

interface Props { config: SwitchGroupFieldConfig; }

export function SwitchGroupField({ config }: Props) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={config.className}>
          {config.label && <FormLabel>{config.label}</FormLabel>}
          <div className="space-y-3">
            {config.options.map((option) => (
              <div key={option.value} className="flex items-center justify-between rounded-lg border p-3">
                <Label className="font-normal">{option.label}</Label>
                <FormControl>
                  <Switch
                    checked={field.value?.[option.value] || false}
                    onCheckedChange={(checked) => field.onChange({ ...field.value, [option.value]: checked })}
                    disabled={config.disabled} />
                </FormControl>
              </div>
            ))}
          </div>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )} />
  );
}`,
  "ComboboxField.tsx": `import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ComboboxFieldConfig } from "../types";

interface ComboboxFieldProps { config: ComboboxFieldConfig; }

export function ComboboxField({ config }: ComboboxFieldProps) {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", config.className)}>
          {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" role="combobox" className={cn("w-full justify-between", !field.value && "text-muted-foreground")} disabled={config.disabled}>
                  {field.value ? config.options.find(o => o.value === field.value)?.label : config.placeholder || "Select..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput placeholder={config.searchPlaceholder || "Search..."} />
                <CommandList>
                  <CommandEmpty>{config.emptyMessage || "No results."}</CommandEmpty>
                  <CommandGroup>
                    {config.options.map((option) => (
                      <CommandItem key={option.value} value={option.value} onSelect={() => { form.setValue(config.name, option.value); setOpen(false); }} disabled={option.disabled}>
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
      )} />
  );
}`,
  "MultiselectField.tsx": `import { useFormContext } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MultiselectFieldConfig } from "../types";
import { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props { config: MultiselectFieldConfig; }

export function MultiselectField({ config }: Props) {
  const form = useFormContext();
  const [open, setOpen] = useState(false);
  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => {
        const selected: string[] = field.value || [];
        return (
          <FormItem className={config.className}>
            {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" className={cn("w-full justify-between min-h-[40px] h-auto", !selected.length && "text-muted-foreground")}>
                    <div className="flex flex-wrap gap-1">
                      {selected.length ? selected.map(v => {
                        const opt = config.options.find(o => o.value === v);
                        return <Badge key={v} variant="secondary" className="text-xs">{opt?.label || v}
                          <X className="ml-1 h-3 w-3 cursor-pointer" onClick={(e) => { e.stopPropagation(); field.onChange(selected.filter(s => s !== v)); }} /></Badge>;
                      }) : config.placeholder || "Select..."}
                    </div>
                    <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No results.</CommandEmpty>
                    <CommandGroup>
                      {config.options.map((option) => (
                        <CommandItem key={option.value} value={option.value} onSelect={() => {
                          const isSelected = selected.includes(option.value);
                          if (isSelected) field.onChange(selected.filter(v => v !== option.value));
                          else if (!config.maxItems || selected.length < config.maxItems) field.onChange([...selected, option.value]);
                        }}>
                          <Check className={cn("mr-2 h-4 w-4", selected.includes(option.value) ? "opacity-100" : "opacity-0")} />
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
      }} />
  );
}`,
  "MultiComboboxField.tsx": `import { MultiselectField } from "./MultiselectField";
import { MultiComboboxFieldConfig } from "../types";

interface Props { config: MultiComboboxFieldConfig; }

export function MultiComboboxField({ config }: Props) {
  return <MultiselectField config={config as any} />;
}`,
  "FileField.tsx": `import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { FileFieldConfig } from "../types";

interface FileFieldProps { config: FileFieldConfig; }

export function FileField({ config }: FileFieldProps) {
  const form = useFormContext();
  return (
    <FormField control={form.control} name={config.name}
      render={({ field: { value, onChange, ...field } }) => (
        <FormItem className={config.className}>
          {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
          <FormControl>
            <Input type="file" accept={config.accept} multiple={config.multiple} disabled={config.disabled}
              onChange={(e) => onChange(config.multiple ? Array.from(e.target.files || []) : e.target.files?.[0])} {...field} />
          </FormControl>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )} />
  );
}`,
  "DateField.tsx": `import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DateFieldConfig } from "../types";

interface DateFieldProps { config: DateFieldConfig; }

export function DateField({ config }: DateFieldProps) {
  const form = useFormContext();
  const minDateFieldValue = config.minDateField ? form.watch(config.minDateField) : undefined;
  const maxDateFieldValue = config.maxDateField ? form.watch(config.maxDateField) : undefined;
  const minDate = minDateFieldValue ? new Date(minDateFieldValue) : config.minDate;
  const maxDate = maxDateFieldValue ? new Date(maxDateFieldValue) : config.maxDate;

  useEffect(() => {
    const val = form.getValues(config.name);
    if (!val) return;
    const current = new Date(val);
    if (minDate && current < minDate) form.setValue(config.name, '', { shouldValidate: true });
    if (maxDate && current > maxDate) form.setValue(config.name, '', { shouldValidate: true });
  }, [minDateFieldValue, maxDateFieldValue]);

  return (
    <FormField control={form.control} name={config.name}
      render={({ field }) => (
        <FormItem className={cn("flex flex-col", config.className)}>
          {config.label && <FormLabel>{config.label}{config.required && <span className="text-destructive ml-1">*</span>}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button variant="outline" className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")} disabled={config.disabled}>
                  {field.value ? format(new Date(field.value), "PPP") : <span>{config.placeholder || "Pick a date"}</span>}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={field.value ? new Date(field.value) : undefined}
                onSelect={(date) => field.onChange(date?.toISOString() || '')}
                disabled={(date) => {
                  if (minDate && date < new Date(new Date(minDate).setHours(0,0,0,0))) return true;
                  if (maxDate && date > new Date(new Date(maxDate).setHours(23,59,59,999))) return true;
                  return false;
                }} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          {config.description && <FormDescription>{config.description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )} />
  );
}`,
};

interface FieldComponentPreviewProps {
  components: { component: string; file: string }[];
}

export function FieldComponentPreview({ components }: FieldComponentPreviewProps) {
  return (
    <>
      {components.map(comp => (
        <TabsContent key={comp.file} value={comp.file} className="mt-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="text-[10px] shrink-0">
                <Package className="h-3 w-3 mr-1" /> Reusable field component
              </Badge>
              <p className="text-xs text-muted-foreground">
                Copy into <code className="bg-muted px-1 rounded">src/components/forms/fields/{comp.file}</code>
              </p>
            </div>
            <CodeBlock
              code={fieldSourceCode[comp.file] || `// Source code for ${comp.component}\n// Copy from your project's src/components/forms/fields/${comp.file}`}
              language="tsx"
              filename={`src/components/forms/fields/${comp.file}`}
            />
          </div>
        </TabsContent>
      ))}
    </>
  );
}
