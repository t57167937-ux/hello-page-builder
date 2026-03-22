import { useState, useCallback, useMemo } from "react";
import { FormConfig, FormFieldConfig } from "@/components/forms";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "@/hooks/use-toast";
import { TextCursorInput, Eye, Code2, BookOpen, Sparkles, Undo2, Redo2, HelpCircle, Badge as BadgeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { useFormBuilderHistory } from "@/hooks/useFormBuilderHistory";
import { formTemplates } from "@/data/formBuilderTemplates";
import { LayoutPicker, FormLayoutType, createLayoutConfig } from "@/components/form-builder/LayoutPicker";
import { FormBuilderGuide } from "@/components/form-builder/FormBuilderGuide";
import { FieldPalette } from "@/components/form-builder/FieldPalette";
import { FormCanvas } from "@/components/form-builder/FormCanvas";
import { PropertiesPanel } from "@/components/form-builder/PropertiesPanel";
import { PreviewTab } from "@/components/form-builder/PreviewTab";
import { ExportTab } from "@/components/form-builder/ExportTab";
import { createField, initialConfig } from "@/components/form-builder/constants";

export default function FormBuilder() {
  const { state: formConfig, set: setFormConfig, undo, redo, reset: resetHistory, canUndo, canRedo } = useFormBuilderHistory<FormConfig>(initialConfig);
  const [selectedFieldIndex, setSelectedFieldIndex] = useState<number | null>(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<"builder" | "preview" | "code" | "guide">("builder");
  const [currentLayout, setCurrentLayout] = useState<FormLayoutType>("single");
  const [submittedData, setSubmittedData] = useState<Record<string, unknown> | null>(null);

  const currentSection = formConfig.sections[selectedSectionIndex];
  const selectedField = selectedFieldIndex !== null ? currentSection?.fields[selectedFieldIndex] : null;
  const allFieldNames = useMemo(() => formConfig.sections.flatMap(s => s.fields).map(f => ({ label: f.label || f.name, value: f.name })), [formConfig]);

  // ─── Field CRUD ───
  const addField = useCallback((type: string) => {
    setFormConfig(prev => {
      const newConfig = { ...prev };
      const section = newConfig.sections[selectedSectionIndex];
      if (section) {
        const newField = createField(type, section.fields.length);
        section.fields = [...section.fields, newField];
      }
      return { ...newConfig };
    });
    toast({ title: "Field added", description: `Added ${type} field` });
  }, [selectedSectionIndex, setFormConfig]);

  const removeField = useCallback((index: number) => {
    setFormConfig(prev => {
      const newConfig = { ...prev };
      const section = newConfig.sections[selectedSectionIndex];
      if (section) section.fields = section.fields.filter((_, i) => i !== index);
      return { ...newConfig };
    });
    setSelectedFieldIndex(null);
  }, [selectedSectionIndex, setFormConfig]);

  const updateField = useCallback((index: number, updates: Partial<FormFieldConfig>) => {
    setFormConfig(prev => {
      const newConfig = { ...prev };
      const section = newConfig.sections[selectedSectionIndex];
      if (section && section.fields[index]) {
        section.fields[index] = { ...section.fields[index], ...updates } as FormFieldConfig;
      }
      return { ...newConfig };
    });
  }, [selectedSectionIndex, setFormConfig]);

  const updateFormConfig = useCallback((updates: Partial<FormConfig>) => {
    setFormConfig(prev => ({ ...prev, ...updates }));
  }, [setFormConfig]);

  const updateSection = useCallback((updates: Partial<typeof currentSection>) => {
    setFormConfig(prev => {
      const newConfig = { ...prev };
      if (newConfig.sections[selectedSectionIndex]) {
        newConfig.sections[selectedSectionIndex] = { ...newConfig.sections[selectedSectionIndex], ...updates };
      }
      return { ...newConfig };
    });
  }, [selectedSectionIndex, setFormConfig]);

  const addSection = useCallback(() => {
    setFormConfig(prev => ({
      ...prev,
      sections: [...prev.sections, {
        id: `section-${Date.now()}`,
        title: `Section ${prev.sections.length + 1}`,
        description: "",
        columns: 1,
        fields: [],
      }],
    }));
    setSelectedSectionIndex(formConfig.sections.length);
  }, [formConfig.sections.length, setFormConfig]);

  const clearSectionFields = useCallback(() => {
    setFormConfig(prev => {
      const newConfig = { ...prev, sections: [...prev.sections] };
      if (newConfig.sections[selectedSectionIndex]) {
        newConfig.sections[selectedSectionIndex] = { ...newConfig.sections[selectedSectionIndex], fields: [] };
      }
      return newConfig;
    });
    setSelectedFieldIndex(null);
    toast({ title: "Section cleared", description: "All fields removed from this section" });
  }, [selectedSectionIndex, setFormConfig]);

  const deleteSection = useCallback((index: number) => {
    if (formConfig.sections.length <= 1) return;
    setFormConfig(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== index),
    }));
    setSelectedSectionIndex(prev => prev >= formConfig.sections.length - 1 ? Math.max(0, prev - 1) : prev);
    setSelectedFieldIndex(null);
    toast({ title: "Section deleted", description: `Section ${index + 1} removed` });
  }, [formConfig.sections.length, setFormConfig]);

  const duplicateField = useCallback((index: number) => {
    setFormConfig(prev => {
      const newConfig = { ...prev };
      const section = { ...newConfig.sections[selectedSectionIndex] };
      if (section && section.fields[index]) {
        const original = section.fields[index];
        const duplicate = { ...original, name: `${original.name}_copy_${Date.now()}`, label: `${original.label || ''} (Copy)` } as FormFieldConfig;
        section.fields = [...section.fields.slice(0, index + 1), duplicate, ...section.fields.slice(index + 1)];
        newConfig.sections = [...newConfig.sections];
        newConfig.sections[selectedSectionIndex] = section;
      }
      return newConfig;
    });
  }, [selectedSectionIndex, setFormConfig]);

  const moveField = useCallback((fromIndex: number, toIndex: number) => {
    setFormConfig(prev => {
      const newConfig = { ...prev };
      const section = { ...newConfig.sections[selectedSectionIndex] };
      if (section) {
        const fields = [...section.fields];
        const [moved] = fields.splice(fromIndex, 1);
        fields.splice(toIndex, 0, moved);
        section.fields = fields;
        newConfig.sections = [...newConfig.sections];
        newConfig.sections[selectedSectionIndex] = section;
      }
      return newConfig;
    });
  }, [selectedSectionIndex, setFormConfig]);

  const moveFieldToSection = useCallback((fieldIndex: number, targetSectionIndex: number) => {
    setFormConfig(prev => {
      const newConfig = { ...prev, sections: prev.sections.map(s => ({ ...s, fields: [...s.fields] })) };
      const [movedField] = newConfig.sections[selectedSectionIndex].fields.splice(fieldIndex, 1);
      newConfig.sections[targetSectionIndex].fields.push(movedField);
      return newConfig;
    });
    setSelectedSectionIndex(targetSectionIndex);
    setSelectedFieldIndex(null);
    toast({ title: "Field moved", description: `Moved to section ${targetSectionIndex + 1}` });
  }, [selectedSectionIndex, setFormConfig]);

  const loadTemplate = useCallback((templateKey: string) => {
    const template = formTemplates[templateKey];
    if (template) {
      resetHistory(template);
      setSelectedFieldIndex(null);
      setSelectedSectionIndex(0);
      toast({ title: "Template loaded", description: `Loaded "${template.title}"` });
    }
  }, [resetHistory]);

  const handleSubmit = (data: Record<string, unknown>) => {
    console.log("Form submitted:", data);
    setSubmittedData(data);
    toast({ title: "Form Submitted", description: "Submitted data is shown below the form" });
  };

  const handleLayoutChange = useCallback((layout: FormLayoutType) => {
    const newConfig = createLayoutConfig(layout);
    resetHistory(newConfig);
    setCurrentLayout(layout);
    setSelectedFieldIndex(null);
    setSelectedSectionIndex(0);
    toast({ title: "Layout changed", description: `Switched to ${layout} layout` });
  }, [resetHistory]);

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto py-6 px-4">
          <PageBreadcrumb items={[{ label: "Form Builder" }]} />

          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">Form Builder</h1>
                  <p className="text-sm text-muted-foreground">Build forms visually, export production-ready code</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Select value="" onValueChange={loadTemplate}>
                  <SelectTrigger className="w-[170px] h-9">
                    <SelectValue placeholder="Load Template..." />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(formTemplates).map(([key, template]) => (
                      <SelectItem key={key} value={key}>{template.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={undo} disabled={!canUndo}><Undo2 className="h-4 w-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Undo</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="h-9 w-9" onClick={redo} disabled={!canRedo}><Redo2 className="h-4 w-4" /></Button>
                  </TooltipTrigger>
                  <TooltipContent>Redo</TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          {/* Layout Picker */}
          <div className="mb-4">
            <LayoutPicker currentLayout={currentLayout} onSelectLayout={handleLayoutChange} />
          </div>

          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-4">
            <TabsList className="h-10">
              <TabsTrigger value="builder" className="gap-2 px-4"><TextCursorInput className="h-4 w-4" />Builder</TabsTrigger>
              <TabsTrigger value="preview" className="gap-2 px-4"><Eye className="h-4 w-4" />Preview</TabsTrigger>
              <TabsTrigger value="code" className="gap-2 px-4"><Code2 className="h-4 w-4" />Export Code</TabsTrigger>
              <TabsTrigger value="guide" className="gap-2 px-4"><BookOpen className="h-4 w-4" />Guide</TabsTrigger>
            </TabsList>

            {/* BUILDER TAB */}
            <TabsContent value="builder" className="mt-0">
              <div className="grid lg:grid-cols-[260px_1fr_280px] gap-4">
                <FieldPalette onAddField={addField} />
                <FormCanvas
                  formConfig={formConfig}
                  currentSection={currentSection}
                  selectedSectionIndex={selectedSectionIndex}
                  selectedFieldIndex={selectedFieldIndex}
                  onSelectSection={setSelectedSectionIndex}
                  onSelectField={setSelectedFieldIndex}
                  onAddSection={addSection}
                  onUpdateSection={updateSection}
                  onMoveField={moveField}
                  onDuplicateField={duplicateField}
                  onRemoveField={removeField}
                  onMoveFieldToSection={moveFieldToSection}
                  onClearSectionFields={clearSectionFields}
                  onDeleteSection={deleteSection}
                />
                <PropertiesPanel
                  selectedField={selectedField}
                  selectedFieldIndex={selectedFieldIndex}
                  allFieldNames={allFieldNames}
                  updateField={updateField}
                />
              </div>

              {/* Form Settings Bar */}
              <Card className="mt-4 border-border">
                <CardContent className="py-3 px-4">
                  <div className="grid md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-1">
                      <Label className="text-xs">Form Title</Label>
                      <Input value={formConfig.title || ""} onChange={(e) => updateFormConfig({ title: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input value={formConfig.description || ""} onChange={(e) => updateFormConfig({ description: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Submit Button</Label>
                      <Input value={formConfig.submitLabel || ""} onChange={(e) => updateFormConfig({ submitLabel: e.target.value })} className="h-8 text-sm" />
                    </div>
                    <div className="flex items-center gap-2 h-8">
                      <Switch id="showReset" checked={formConfig.showReset || false} onCheckedChange={(checked) => updateFormConfig({ showReset: checked })} />
                      <Label htmlFor="showReset" className="text-xs">Show Reset</Label>
                      <Tooltip>
                        <TooltipTrigger asChild><HelpCircle className="h-3 w-3 text-muted-foreground cursor-help" /></TooltipTrigger>
                        <TooltipContent side="top" className="max-w-[200px]"><p className="text-xs">Adds a "Reset" button next to Submit.</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* PREVIEW TAB */}
            <TabsContent value="preview" className="mt-0">
              <PreviewTab
                formConfig={formConfig}
                onSubmit={handleSubmit}
                submittedData={submittedData}
                onClearSubmittedData={() => setSubmittedData(null)}
              />
            </TabsContent>

            {/* CODE EXPORT TAB */}
            <TabsContent value="code" className="mt-0">
              <ExportTab formConfig={formConfig} />
            </TabsContent>

            {/* GUIDE TAB */}
            <TabsContent value="guide" className="mt-0">
              <FormBuilderGuide />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TooltipProvider>
  );
}
