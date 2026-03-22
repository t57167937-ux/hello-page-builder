import { useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { FormFieldConfig, AsyncApiConfig } from "@/components/forms/types";
import { Plus, Trash2, TextCursorInput, HelpCircle, Layers, GitBranch, Globe, Server } from "lucide-react";

interface PropertiesPanelProps {
  selectedField: FormFieldConfig | null;
  selectedFieldIndex: number | null;
  allFieldNames: { label: string; value: string }[];
  updateField: (index: number, updates: Partial<FormFieldConfig>) => void;
}

export function PropertiesPanel({ selectedField, selectedFieldIndex, allFieldNames, updateField }: PropertiesPanelProps) {
  const addOption = useCallback(() => {
    if (selectedFieldIndex === null || !selectedField) return;
    const field = selectedField as any;
    if (field.options) {
      const newOption = { label: `Option ${field.options.length + 1}`, value: `option${field.options.length + 1}` };
      updateField(selectedFieldIndex, { options: [...field.options, newOption] } as any);
    }
  }, [selectedFieldIndex, selectedField, updateField]);

  const removeOption = useCallback((optionIndex: number) => {
    if (selectedFieldIndex === null || !selectedField) return;
    const field = selectedField as any;
    if (field.options) {
      updateField(selectedFieldIndex, { options: field.options.filter((_: any, i: number) => i !== optionIndex) } as any);
    }
  }, [selectedFieldIndex, selectedField, updateField]);

  const renderFieldSpecificProperties = () => {
    if (!selectedField || selectedFieldIndex === null) return null;
    switch (selectedField.type) {
      case "text": case "password": case "tel": case "url":
        return (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Min Length</Label>
              <Input type="number" min={0} value={(selectedField as any).minLength || ""} onChange={(e) => { const v = parseInt(e.target.value); updateField(selectedFieldIndex, { minLength: !isNaN(v) && v >= 0 ? v : undefined } as any); }} className="h-8 text-sm" placeholder="No minimum" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max Length</Label>
              <Input type="number" min={0} value={(selectedField as any).maxLength || ""} onChange={(e) => { const v = parseInt(e.target.value); updateField(selectedFieldIndex, { maxLength: !isNaN(v) && v >= 0 ? v : undefined } as any); }} className="h-8 text-sm" placeholder="No maximum" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Pattern (Regex)</Label>
              <Input value={(selectedField as any).pattern || ""} onChange={(e) => updateField(selectedFieldIndex, { pattern: e.target.value } as any)} className="h-8 text-sm font-mono" placeholder="e.g. [A-Za-z]+" />
            </div>
          </>
        );
      case "number":
        return (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Minimum Value</Label>
              <Input type="number" value={(selectedField as any).min ?? ""} onChange={(e) => updateField(selectedFieldIndex, { min: e.target.value ? parseFloat(e.target.value) : undefined } as any)} className="h-8 text-sm" placeholder="No minimum" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Maximum Value</Label>
              <Input type="number" value={(selectedField as any).max ?? ""} onChange={(e) => updateField(selectedFieldIndex, { max: e.target.value ? parseFloat(e.target.value) : undefined } as any)} className="h-8 text-sm" placeholder="No maximum" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Step</Label>
              <Input type="number" min={0} value={(selectedField as any).step ?? ""} onChange={(e) => updateField(selectedFieldIndex, { step: e.target.value ? parseFloat(e.target.value) : undefined } as any)} className="h-8 text-sm" placeholder="Default (1)" />
              <p className="text-[10px] text-muted-foreground">Increment/decrement interval</p>
            </div>
          </>
        );
      case "textarea":
        return (
          <div className="space-y-1">
            <Label className="text-xs">Rows</Label>
            <Input type="number" value={(selectedField as any).rows || 4} onChange={(e) => { const v = parseInt(e.target.value); updateField(selectedFieldIndex, { rows: !isNaN(v) && v >= 2 ? Math.min(v, 20) : 4 } as any); }} className="h-8 text-sm" min={2} max={20} />
          </div>
        );
      case "file":
        return (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Accept (file types)</Label>
              <Input value={(selectedField as any).accept || ""} onChange={(e) => updateField(selectedFieldIndex, { accept: e.target.value } as any)} className="h-8 text-sm font-mono" placeholder=".pdf,.doc,.jpg" />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Allow Multiple Files</Label>
              <Switch checked={(selectedField as any).multiple || false} onCheckedChange={(checked) => updateField(selectedFieldIndex, { multiple: checked } as any)} />
            </div>
          </>
        );
      case "radio": case "checkboxgroup":
        return (
          <div className="space-y-1">
            <Label className="text-xs">Orientation</Label>
            <Select value={(selectedField as any).orientation || "vertical"} onValueChange={(v) => updateField(selectedFieldIndex, { orientation: v } as any)}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="vertical">Vertical</SelectItem>
                <SelectItem value="horizontal">Horizontal</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );
      case "checkbox":
        return (
          <div className="space-y-1">
            <Label className="text-xs">Checkbox Label</Label>
            <Input value={(selectedField as any).checkboxLabel || ""} onChange={(e) => updateField(selectedFieldIndex, { checkboxLabel: e.target.value } as any)} className="h-8 text-sm" />
          </div>
        );
      case "switch":
        return (
          <div className="space-y-1">
            <Label className="text-xs">Switch Label</Label>
            <Input value={(selectedField as any).switchLabel || ""} onChange={(e) => updateField(selectedFieldIndex, { switchLabel: e.target.value } as any)} className="h-8 text-sm" />
          </div>
        );
      case "combobox": case "asynccombobox": case "infinitecombobox":
        return (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Search Placeholder</Label>
              <Input value={(selectedField as any).searchPlaceholder || ""} onChange={(e) => updateField(selectedFieldIndex, { searchPlaceholder: e.target.value } as any)} className="h-8 text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Empty Message</Label>
              <Input value={(selectedField as any).emptyMessage || ""} onChange={(e) => updateField(selectedFieldIndex, { emptyMessage: e.target.value } as any)} className="h-8 text-sm" />
            </div>
          </>
        );
      case "multiselect": case "multicombobox":
      case "asyncmultiselect": case "asyncmultiselect":
      case "infinitemultiselect": case "infinitemulticombobox":
      case "asyncmulticombobox":
        return (
          <div className="space-y-1">
            <Label className="text-xs">Max Items</Label>
            <Input type="number" min={0} value={(selectedField as any).maxItems || ""} onChange={(e) => { const v = parseInt(e.target.value); updateField(selectedFieldIndex, { maxItems: !isNaN(v) && v >= 0 ? v : undefined } as any); }} className="h-8 text-sm" placeholder="No limit" />
          </div>
        );
      case "date":
        return (
          <>
            <div className="space-y-1">
              <Label className="text-xs">Min Date Field</Label>
              <Select value={(selectedField as any).minDateField || "__none__"} onValueChange={(v) => updateField(selectedFieldIndex, { minDateField: v === "__none__" ? undefined : v } as any)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="No constraint" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No constraint</SelectItem>
                  {allFieldNames.filter(f => f.value !== selectedField.name).map(f => (<SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>))}
                </SelectContent>
              </Select>
              <p className="text-[10px] text-muted-foreground">Can't select a date before this field's value</p>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Max Date Field</Label>
              <Select value={(selectedField as any).maxDateField || "__none__"} onValueChange={(v) => updateField(selectedFieldIndex, { maxDateField: v === "__none__" ? undefined : v } as any)}>
                <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="No constraint" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No constraint</SelectItem>
                  {allFieldNames.filter(f => f.value !== selectedField.name).map(f => (<SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const renderDefaultValueEditor = () => {
    if (!selectedField || selectedFieldIndex === null) return null;
    if (selectedField.type === "file") return null;

    if (selectedField.type === "checkbox" || selectedField.type === "switch") {
      return (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Label className="text-xs">Default Value</Label>
            <Tooltip>
              <TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger>
              <TooltipContent side="left" className="max-w-[200px]"><p className="text-xs">Initial value when the form loads. For checkbox/switch: on or off.</p></TooltipContent>
            </Tooltip>
          </div>
          <Switch checked={!!selectedField.defaultValue} onCheckedChange={(checked) => updateField(selectedFieldIndex, { defaultValue: checked })} />
        </div>
      );
    }

    if ((selectedField.type === "select" || selectedField.type === "radio" || selectedField.type === "combobox") && (selectedField as any).options?.length) {
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Label className="text-xs">Default Value</Label>
            <Tooltip>
              <TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger>
              <TooltipContent side="left" className="max-w-[200px]"><p className="text-xs">Pre-selected option when the form loads.</p></TooltipContent>
            </Tooltip>
          </div>
          <Select value={String(selectedField.defaultValue || "__none__")} onValueChange={(v) => updateField(selectedFieldIndex, { defaultValue: v === "__none__" ? undefined : v })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="No default" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">No default</SelectItem>
              {(selectedField as any).options.map((o: any) => (
                <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-1">
          <Label className="text-xs">Default Value</Label>
          <Tooltip>
            <TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger>
            <TooltipContent side="left" className="max-w-[200px]"><p className="text-xs">Initial value when the form loads.</p></TooltipContent>
          </Tooltip>
        </div>
        <Input
          value={String(selectedField.defaultValue || "")}
          onChange={(e) => updateField(selectedFieldIndex, { defaultValue: e.target.value || undefined })}
          className="h-8 text-sm" placeholder="No default"
        />
      </div>
    );
  };

  const isAsyncOrInfinite = (type: string) =>
    type.startsWith('async') || type.startsWith('infinite');

  const isInfinite = (type: string) => type.startsWith('infinite');

  const renderApiConfigEditor = () => {
    if (!selectedField || selectedFieldIndex === null) return null;
    if (!isAsyncOrInfinite(selectedField.type)) return null;

    const apiConfig: AsyncApiConfig | undefined = (selectedField as any).apiConfig;
    const defaultApiConfig: AsyncApiConfig = {
      url: '',
      method: 'GET',
      responseMapping: { dataPath: 'data', labelKey: 'name', valueKey: 'id' },
    };

    const updateApiConfig = (updates: Partial<AsyncApiConfig>) => {
      const current = apiConfig || defaultApiConfig;
      updateField(selectedFieldIndex, { apiConfig: { ...current, ...updates } } as any);
    };

    const updateResponseMapping = (updates: Partial<AsyncApiConfig['responseMapping']>) => {
      const current = apiConfig || defaultApiConfig;
      updateField(selectedFieldIndex, {
        apiConfig: { ...current, responseMapping: { ...current.responseMapping, ...updates } }
      } as any);
    };

    return (
      <>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-3.5 w-3.5 text-primary" />
            <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
              API Configuration
            </Label>
          </div>
          <p className="text-[10px] text-muted-foreground">
            {isInfinite(selectedField.type)
              ? "Configure the API endpoint for infinite scroll loading. Options load in chunks as user types/scrolls, cached by query."
              : "Configure the API endpoint to fetch options via axios when the component mounts."}
          </p>

          <div className="flex items-center justify-between">
            <Label className="text-xs">Enable API Config</Label>
            <Switch
              checked={!!apiConfig}
              onCheckedChange={(checked) => {
                if (checked) updateField(selectedFieldIndex, { apiConfig: defaultApiConfig } as any);
                else updateField(selectedFieldIndex, { apiConfig: undefined } as any);
              }}
            />
          </div>

          {apiConfig && (
            <div className="space-y-2 pl-1">
              <div className="space-y-1">
                <Label className="text-xs">Endpoint URL</Label>
                <Input
                  value={apiConfig.url}
                  onChange={(e) => updateApiConfig({ url: e.target.value })}
                  className="h-8 text-sm font-mono"
                  placeholder="https://api.example.com/items"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs">HTTP Method</Label>
                <Select value={apiConfig.method} onValueChange={(v) => updateApiConfig({ method: v as any })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {['POST', 'PUT', 'PATCH'].includes(apiConfig.method) && (
                <div className="space-y-1">
                  <Label className="text-xs">JSON Payload</Label>
                  <Input
                    value={apiConfig.payload ? JSON.stringify(apiConfig.payload) : ''}
                    onChange={(e) => {
                      try { updateApiConfig({ payload: JSON.parse(e.target.value) }); }
                      catch { /* ignore invalid JSON while typing */ }
                    }}
                    className="h-8 text-sm font-mono"
                    placeholder='{"key": "value"}'
                  />
                  <p className="text-[10px] text-muted-foreground">JSON body sent with the request</p>
                </div>
              )}

              <div className="space-y-1">
                <Label className="text-xs">Custom Headers (optional)</Label>
                <Input
                  value={apiConfig.headers ? JSON.stringify(apiConfig.headers) : ''}
                  onChange={(e) => {
                    try { updateApiConfig({ headers: JSON.parse(e.target.value) }); }
                    catch { /* ignore */ }
                  }}
                  className="h-8 text-sm font-mono"
                  placeholder='{"Authorization": "Bearer ..."}'
                />
              </div>

              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Server className="h-3 w-3 text-primary" />
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Response Mapping</Label>
                </div>
                <p className="text-[10px] text-muted-foreground">Map API response to {'{label, value}'} format</p>

                <div className="space-y-1">
                  <Label className="text-xs">Data Path</Label>
                  <Input
                    value={apiConfig.responseMapping.dataPath}
                    onChange={(e) => updateResponseMapping({ dataPath: e.target.value })}
                    className="h-8 text-sm font-mono"
                    placeholder="data.items"
                  />
                  <p className="text-[10px] text-muted-foreground">Dot-notation path to array in response (e.g. "data.items", "results")</p>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  <div className="space-y-1">
                    <Label className="text-xs">Label Key</Label>
                    <Input
                      value={apiConfig.responseMapping.labelKey}
                      onChange={(e) => updateResponseMapping({ labelKey: e.target.value })}
                      className="h-8 text-sm font-mono"
                      placeholder="name"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Value Key</Label>
                    <Input
                      value={apiConfig.responseMapping.valueKey}
                      onChange={(e) => updateResponseMapping({ valueKey: e.target.value })}
                      className="h-8 text-sm font-mono"
                      placeholder="id"
                    />
                  </div>
                </div>
              </div>

              {/* Infinite-specific settings */}
              {isInfinite(selectedField.type) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Infinite Scroll Settings</Label>
                    <p className="text-[10px] text-muted-foreground">Configure pagination and search-as-you-type behavior</p>

                    <div className="space-y-1">
                      <Label className="text-xs">Search Param</Label>
                      <Input
                        value={apiConfig.searchParam || ''}
                        onChange={(e) => updateApiConfig({ searchParam: e.target.value || undefined })}
                        className="h-8 text-sm font-mono"
                        placeholder="q"
                      />
                      <p className="text-[10px] text-muted-foreground">Query param name for search term (e.g. "q", "search")</p>
                    </div>

                    <div className="grid grid-cols-2 gap-1.5">
                      <div className="space-y-1">
                        <Label className="text-xs">Page Param</Label>
                        <Input
                          value={apiConfig.pageParam || ''}
                          onChange={(e) => updateApiConfig({ pageParam: e.target.value || undefined })}
                          className="h-8 text-sm font-mono"
                          placeholder="page"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs">Page Size Param</Label>
                        <Input
                          value={apiConfig.pageSizeParam || ''}
                          onChange={(e) => updateApiConfig({ pageSizeParam: e.target.value || undefined })}
                          className="h-8 text-sm font-mono"
                          placeholder="limit"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Page Size</Label>
                      <Input
                        type="number"
                        min={1}
                        value={apiConfig.pageSize || 20}
                        onChange={(e) => { const v = parseInt(e.target.value); updateApiConfig({ pageSize: !isNaN(v) && v >= 1 ? v : 20 }); }}
                        className="h-8 text-sm"
                        placeholder="20"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Has More Path</Label>
                      <Input
                        value={apiConfig.hasMorePath || ''}
                        onChange={(e) => updateApiConfig({ hasMorePath: e.target.value || undefined })}
                        className="h-8 text-sm font-mono"
                        placeholder="meta.hasMore"
                      />
                      <p className="text-[10px] text-muted-foreground">Dot-notation path to boolean in response indicating more pages</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </>
    );
  };

  const renderDependentOptionsEditor = () => {
    if (!selectedField || selectedFieldIndex === null) return null;
    const hasOptions = ['select', 'combobox', 'radio', 'multiselect', 'multicombobox', 'checkboxgroup',
      'asyncselect', 'asynccombobox', 'asyncmultiselect', 'asyncmulticombobox',
      'infiniteselect', 'infinitecombobox', 'infinitemultiselect', 'infinitemulticombobox'].includes(selectedField.type);
    if (!hasOptions) return null;
    const depConfig = (selectedField as any).dependentOptions;

    return (
      <>
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <GitBranch className="h-3.5 w-3.5 text-primary" />
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Dependent Options</Label>
          </div>
          <p className="text-[10px] text-muted-foreground">Options change based on another field's value (e.g. Country → States)</p>
          <div className="flex items-center justify-between">
            <Label className="text-xs">Enable</Label>
            <Switch checked={!!depConfig} onCheckedChange={(checked) => {
              if (checked) updateField(selectedFieldIndex, { dependentOptions: { watchField: '', optionsMap: {} } } as any);
              else updateField(selectedFieldIndex, { dependentOptions: undefined } as any);
            }} />
          </div>
          {depConfig && (
            <div className="space-y-3">
              <div className="space-y-1">
                <Label className="text-xs">Watch Field</Label>
                <Select value={depConfig.watchField || ""} onValueChange={(v) => updateField(selectedFieldIndex, { dependentOptions: { ...depConfig, watchField: v } } as any)}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select parent field" /></SelectTrigger>
                  <SelectContent>
                    {allFieldNames.filter(f => f.value !== selectedField.name).map(f => (
                      <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Options Map</Label>
                  <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => {
                    const newKey = `value_${Object.keys(depConfig.optionsMap).length + 1}`;
                    updateField(selectedFieldIndex, { dependentOptions: { ...depConfig, optionsMap: { ...depConfig.optionsMap, [newKey]: [{ label: "Option 1", value: "opt1" }] } } } as any);
                  }}><Plus className="h-3 w-3 mr-1" /> Add Group</Button>
                </div>
                <p className="text-[10px] text-muted-foreground">When parent field = key, show these options</p>
                {Object.entries(depConfig.optionsMap || {}).map(([key, options]: [string, any]) => (
                  <div key={key} className="p-2 rounded border border-border space-y-2 bg-muted/30">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">When =</span>
                      <Input value={key} onChange={(e) => {
                        const newMap = { ...depConfig.optionsMap }; const opts = newMap[key]; delete newMap[key]; newMap[e.target.value] = opts;
                        updateField(selectedFieldIndex, { dependentOptions: { ...depConfig, optionsMap: newMap } } as any);
                      }} className="h-6 text-xs flex-1 font-mono" />
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                        const newMap = { ...depConfig.optionsMap }; delete newMap[key];
                        updateField(selectedFieldIndex, { dependentOptions: { ...depConfig, optionsMap: newMap } } as any);
                      }}><Trash2 className="h-3 w-3 text-destructive" /></Button>
                    </div>
                    {(options as any[]).map((opt: any, oi: number) => (
                      <div key={oi} className="flex gap-1 pl-4">
                        <Input value={opt.label} onChange={(e) => {
                          const newMap = { ...depConfig.optionsMap }; const newOpts = [...newMap[key]]; newOpts[oi] = { ...newOpts[oi], label: e.target.value }; newMap[key] = newOpts;
                          updateField(selectedFieldIndex, { dependentOptions: { ...depConfig, optionsMap: newMap } } as any);
                        }} placeholder="Label" className="h-6 text-[10px] flex-1" />
                        <Input value={opt.value} onChange={(e) => {
                          const newMap = { ...depConfig.optionsMap }; const newOpts = [...newMap[key]]; newOpts[oi] = { ...newOpts[oi], value: e.target.value }; newMap[key] = newOpts;
                          updateField(selectedFieldIndex, { dependentOptions: { ...depConfig, optionsMap: newMap } } as any);
                        }} placeholder="Value" className="h-6 text-[10px] flex-1 font-mono" />
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                          const newMap = { ...depConfig.optionsMap }; newMap[key] = newMap[key].filter((_: any, i: number) => i !== oi);
                          updateField(selectedFieldIndex, { dependentOptions: { ...depConfig, optionsMap: newMap } } as any);
                        }}><Trash2 className="h-2.5 w-2.5" /></Button>
                      </div>
                    ))}
                    <Button variant="ghost" size="sm" className="h-5 text-[10px] ml-4" onClick={() => {
                      const newMap = { ...depConfig.optionsMap }; newMap[key] = [...newMap[key], { label: `Option ${newMap[key].length + 1}`, value: `opt${newMap[key].length + 1}` }];
                      updateField(selectedFieldIndex, { dependentOptions: { ...depConfig, optionsMap: newMap } } as any);
                    }}><Plus className="h-2.5 w-2.5 mr-0.5" /> Option</Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  return (
    <Card className="border-border">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-sm">Properties</CardTitle>
        <CardDescription className="text-xs">
          {selectedField ? `Editing: ${selectedField.label || selectedField.name}` : "Select a field"}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-2">
        <ScrollArea className="h-[520px]">
          {selectedField && selectedFieldIndex !== null ? (
            <div className="space-y-3 p-2">
              {/* Basic Properties */}
              <div className="space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input value={selectedField.label || ""} onChange={(e) => updateField(selectedFieldIndex, { label: e.target.value })} className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">Name (ID)</Label>
                    <Tooltip>
                      <TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger>
                      <TooltipContent side="left" className="max-w-[200px]"><p className="text-xs">Unique identifier used in code. Becomes the key in submitted data.</p></TooltipContent>
                    </Tooltip>
                  </div>
                  <Input value={selectedField.name} onChange={(e) => updateField(selectedFieldIndex, { name: e.target.value })} className="h-8 text-sm font-mono" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Placeholder</Label>
                  <Input value={selectedField.placeholder || ""} onChange={(e) => updateField(selectedFieldIndex, { placeholder: e.target.value })} className="h-8 text-sm" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description</Label>
                  <Input value={selectedField.description || ""} onChange={(e) => updateField(selectedFieldIndex, { description: e.target.value })} className="h-8 text-sm" />
                </div>
                {renderDefaultValueEditor()}
              </div>

              <Separator />
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">Required</Label>
                    <Tooltip>
                      <TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger>
                      <TooltipContent side="left" className="max-w-[200px]"><p className="text-xs">Field must be filled before form can be submitted.</p></TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch checked={selectedField.required || false} onCheckedChange={(checked) => updateField(selectedFieldIndex, { required: checked })} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Label className="text-xs">Disabled</Label>
                    <Tooltip>
                      <TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger>
                      <TooltipContent side="left" className="max-w-[200px]"><p className="text-xs">Grays out the field and prevents user interaction.</p></TooltipContent>
                    </Tooltip>
                  </div>
                  <Switch checked={selectedField.disabled || false} onCheckedChange={(checked) => updateField(selectedFieldIndex, { disabled: checked })} />
                </div>
              </div>

              {/* Field-Specific */}
              {renderFieldSpecificProperties() && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">{selectedField.type} Settings</Label>
                    {renderFieldSpecificProperties()}
                  </div>
                </>
              )}

              {/* API Config for async/infinite fields */}
              {renderApiConfigEditor()}

              {/* Options */}
              {(selectedField as any).options && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Options</Label>
                      <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={addOption}><Plus className="h-3 w-3 mr-1" /> Add</Button>
                    </div>
                    {(selectedField as any).options.map((opt: any, idx: number) => (
                      <div key={idx} className="flex gap-1.5">
                        <Input value={opt.label} onChange={(e) => {
                          const newOptions = [...(selectedField as any).options]; newOptions[idx] = { ...newOptions[idx], label: e.target.value };
                          updateField(selectedFieldIndex, { options: newOptions } as any);
                        }} placeholder="Label" className="h-7 text-xs flex-1" />
                        <Input value={opt.value} onChange={(e) => {
                          const newOptions = [...(selectedField as any).options]; newOptions[idx] = { ...newOptions[idx], value: e.target.value };
                          updateField(selectedFieldIndex, { options: newOptions } as any);
                        }} placeholder="Value" className="h-7 text-xs flex-1 font-mono" />
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeOption(idx)}><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Dependent Options */}
              {renderDependentOptionsEditor()}

              {/* Conditional Visibility */}
              <Separator />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-primary" />
                  <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Conditional Visibility</Label>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Enable</Label>
                  <Switch
                    checked={!!(selectedField as any).condition}
                    onCheckedChange={(checked) => {
                      if (checked) updateField(selectedFieldIndex, { condition: { field: '', operator: 'equals', value: '' } } as any);
                      else updateField(selectedFieldIndex, { condition: undefined } as any);
                    }}
                  />
                </div>
                {(selectedField as any).condition && (
                  <div className="space-y-2 pl-1">
                    <div className="space-y-1">
                      <Label className="text-xs">Watch Field</Label>
                      <Select value={(selectedField as any).condition.field || ""} onValueChange={(v) => updateField(selectedFieldIndex, { condition: { ...(selectedField as any).condition, field: v } } as any)}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select field" /></SelectTrigger>
                        <SelectContent>
                          {allFieldNames.filter(f => f.value !== selectedField.name).map(f => (<SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Operator</Label>
                      <Select value={(selectedField as any).condition.operator || "equals"} onValueChange={(v) => updateField(selectedFieldIndex, { condition: { ...(selectedField as any).condition, operator: v } } as any)}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="equals">Equals</SelectItem>
                          <SelectItem value="notEquals">Not Equals</SelectItem>
                          <SelectItem value="contains">Contains</SelectItem>
                          <SelectItem value="in">In (comma-separated)</SelectItem>
                          <SelectItem value="notEmpty">Not Empty</SelectItem>
                          <SelectItem value="empty">Is Empty</SelectItem>
                          <SelectItem value="isTrue">Is True (for checkbox/switch)</SelectItem>
                          <SelectItem value="isFalse">Is False (for checkbox/switch)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {['equals', 'notEquals', 'contains', 'in'].includes((selectedField as any).condition.operator) && (
                      <div className="space-y-1">
                        <Label className="text-xs">Value</Label>
                        <Input value={(selectedField as any).condition.value || ""} onChange={(e) => updateField(selectedFieldIndex, { condition: { ...(selectedField as any).condition, value: e.target.value } } as any)} className="h-8 text-sm" placeholder="Expected value" />
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Watch / Auto-Populate */}
              <Separator />
              <div className="space-y-2">
                <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Auto-Populate (Watch)</Label>
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Enable</Label>
                  <Switch
                    checked={!!(selectedField as any).watchConfig}
                    onCheckedChange={(checked) => {
                      if (checked) updateField(selectedFieldIndex, { watchConfig: { watchField: '' } } as any);
                      else updateField(selectedFieldIndex, { watchConfig: undefined } as any);
                    }}
                  />
                </div>
                {(selectedField as any).watchConfig && (
                  <div className="space-y-3 pl-1">
                    <div className="space-y-1">
                      <Label className="text-xs">Source Field</Label>
                      <Select value={(selectedField as any).watchConfig.watchField || ""} onValueChange={(v) => updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, watchField: v } } as any)}>
                        <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select field" /></SelectTrigger>
                        <SelectContent>
                          {allFieldNames.filter(f => f.value !== selectedField.name).map(f => (<SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Transform Constraints */}
                    <Separator />
                    <div className="space-y-2">
                      <Label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">Transform Constraints</Label>
                      <p className="text-[10px] text-muted-foreground">Apply transformations to the watched value before populating this field</p>
                      <div className="space-y-1.5">
                        <div className="space-y-1">
                          <Label className="text-xs">Filter Characters</Label>
                          <Select value={(selectedField as any).watchConfig?.transform?.filter || "__none__"} onValueChange={(v) => {
                            const transform = { ...(selectedField as any).watchConfig?.transform, filter: v === "__none__" ? undefined : v };
                            updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, transform } } as any);
                          }}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__none__">No filter</SelectItem>
                              <SelectItem value="numbers">Numbers only</SelectItem>
                              <SelectItem value="letters">Letters only</SelectItem>
                              <SelectItem value="alphanumeric">Alphanumeric</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Text Case</Label>
                          <Select value={(selectedField as any).watchConfig?.transform?.case || "__none__"} onValueChange={(v) => {
                            const transform = { ...(selectedField as any).watchConfig?.transform, case: v === "__none__" ? undefined : v };
                            updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, transform } } as any);
                          }}>
                            <SelectTrigger className="h-7 text-xs"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="__none__">No transform</SelectItem>
                              <SelectItem value="upper">UPPERCASE</SelectItem>
                              <SelectItem value="lower">lowercase</SelectItem>
                              <SelectItem value="capitalize">Capitalize first</SelectItem>
                              <SelectItem value="title">Title Case</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="space-y-1">
                            <Label className="text-xs">Slice Start</Label>
                            <Input type="number" value={(selectedField as any).watchConfig?.transform?.slice?.start ?? ""} onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value) : undefined;
                              const currentSlice = (selectedField as any).watchConfig?.transform?.slice;
                              const slice = val !== undefined ? { start: val, end: currentSlice?.end } : undefined;
                              const transform = { ...(selectedField as any).watchConfig?.transform, slice };
                              updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, transform } } as any);
                            }} className="h-7 text-xs" placeholder="0" />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Slice End</Label>
                            <Input type="number" value={(selectedField as any).watchConfig?.transform?.slice?.end ?? ""} onChange={(e) => {
                              const val = e.target.value ? parseInt(e.target.value) : undefined;
                              const currentSlice = (selectedField as any).watchConfig?.transform?.slice;
                              const transform = { ...(selectedField as any).watchConfig?.transform, slice: { start: currentSlice?.start ?? 0, end: val } };
                              updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, transform } } as any);
                            }} className="h-7 text-xs" placeholder="No limit" />
                          </div>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Template</Label>
                          <Input value={(selectedField as any).watchConfig?.transform?.template || ""} onChange={(e) => {
                            const transform = { ...(selectedField as any).watchConfig?.transform, template: e.target.value || undefined };
                            updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, transform } } as any);
                          }} className="h-7 text-xs font-mono" placeholder="PREFIX-{value}-SUFFIX" />
                          <p className="text-[10px] text-muted-foreground">Use {'{value}'} as placeholder for the transformed value</p>
                        </div>
                      </div>
                    </div>

                    {/* Value Map */}
                    <Separator />
                    <div className="flex items-center justify-between">
                      <Label className="text-xs">Use Value Map</Label>
                      <Switch
                        checked={!!(selectedField as any).watchConfig.valueMap}
                        onCheckedChange={(checked) => {
                          if (checked) updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, valueMap: {} } } as any);
                          else {
                            const { valueMap, ...rest } = (selectedField as any).watchConfig;
                            updateField(selectedFieldIndex, { watchConfig: rest } as any);
                          }
                        }}
                      />
                    </div>
                    {(selectedField as any).watchConfig.valueMap && (
                      <div className="space-y-1.5">
                        {Object.entries((selectedField as any).watchConfig.valueMap).map(([key, val], idx) => (
                          <div key={idx} className="flex gap-1.5">
                            <Input value={key} onChange={(e) => {
                              const newMap = { ...(selectedField as any).watchConfig.valueMap }; const oldVal = newMap[key]; delete newMap[key]; newMap[e.target.value] = oldVal;
                              updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, valueMap: newMap } } as any);
                            }} placeholder="When" className="h-6 text-[10px] flex-1" />
                            <Input value={val as string} onChange={(e) => {
                              const newMap = { ...(selectedField as any).watchConfig.valueMap }; newMap[key] = e.target.value;
                              updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, valueMap: newMap } } as any);
                            }} placeholder="Show" className="h-6 text-[10px] flex-1" />
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => {
                              const newMap = { ...(selectedField as any).watchConfig.valueMap }; delete newMap[key];
                              updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, valueMap: newMap } } as any);
                            }}><Trash2 className="h-2.5 w-2.5" /></Button>
                          </div>
                        ))}
                        <Button variant="ghost" size="sm" className="h-5 text-[10px]" onClick={() => {
                          const newMap = { ...(selectedField as any).watchConfig.valueMap, [`key_${Date.now()}`]: '' };
                          updateField(selectedFieldIndex, { watchConfig: { ...(selectedField as any).watchConfig, valueMap: newMap } } as any);
                        }}><Plus className="h-2.5 w-2.5 mr-0.5" /> Mapping</Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <TextCursorInput className="h-8 w-8 text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">No field selected</p>
              <p className="text-xs text-muted-foreground mt-1">Click a field in the canvas to edit</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
