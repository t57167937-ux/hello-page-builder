import { useState, useCallback, useEffect, useMemo, useRef } from "react";
import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { FormConfig, FormSubmitHandler, getDefaultValues } from "./types";
import { BackendErrorResponse, applyBackendErrors } from "@/hooks/useBackendErrors";
import { GenericFormField } from "./GenericFormField";
import { ChevronLeft, ChevronRight, AlertCircle, Check, AlertTriangle, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { extractFields, buildZodSchema } from "@/utils/zodSchemaBuilder";

interface GenericFormProps {
  config: FormConfig;
  onSubmit: FormSubmitHandler;
  className?: string;
  /** Zod schema for validation — built externally (runtime or compile-time). */
  schema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  /** Override default values (merged on top of config defaults). */
  initialValues?: Record<string, unknown>;
}

export function GenericForm({ config, onSubmit, className, schema, initialValues }: GenericFormProps) {
  const configDefaults = getDefaultValues(config);
  const defaultValues = initialValues ? { ...configDefaults, ...initialValues } : configDefaults;

  // Detect if the form has any conditional fields — if so, we use a dynamic resolver
  const hasConditionalFields = useMemo(
    () => extractFields(config).some((f) => !!f.condition),
    [config]
  );

  const [currentStep, setCurrentStep] = useState(0);
  const [activeTab, setActiveTab] = useState(config.sections[0]?.id || "");
  const [globalError, setGlobalError] = useState<string | null>(null);

  const form = useForm({
    resolver: hasConditionalFields
      ? async (values, context, options) => {
          // Rebuild schema on every validation call with live form values,
          // so fields hidden by a condition are never enforced as required.
          const dynamicSchema = buildZodSchema(
            extractFields(config),
            values as Record<string, unknown>
          );
          return zodResolver(dynamicSchema)(values, context, options);
        }
      : zodResolver(schema),
    defaultValues,
    mode: hasConditionalFields ? "onSubmit" : "onSubmit",
  });

  const handleSubmit = form.handleSubmit(
    async (data) => {
      setGlobalError(null);
      try {
        await onSubmit(data);
      } catch (error: any) {
        // Handle backend validation errors
        const backendResponse: BackendErrorResponse | undefined =
          error?.response?.data || // axios error
          (error?.success === false ? error : undefined); // direct throw

        if (backendResponse?.errors && backendResponse.errors.length > 0) {
          const firstErrorSection = applyBackendErrors(form, config, backendResponse.errors);

          // Navigate to the section with the first error
          if (firstErrorSection !== -1) {
            const layout = config.layout || "single";
            if (layout === "multi-tab") {
              setActiveTab(config.sections[firstErrorSection].id);
            } else if (layout === "wizard") {
              setCurrentStep(firstErrorSection);
            }
          }

          if (backendResponse.message) {
            setGlobalError(backendResponse.message);
          }
        } else {
          // Generic error — show as global message
          const msg = backendResponse?.message || error?.message || "An unexpected error occurred";
          setGlobalError(msg);
        }
      }
    },
    (errors) => {
      // Validation failed — log for debugging
      console.warn("[GenericForm] Validation errors:", errors);
    }
  );

  // Clear global error when user starts editing
  useEffect(() => {
    const subscription = form.watch(() => {
      if (globalError) setGlobalError(null);
    });
    return () => subscription.unsubscribe();
  }, [form, globalError]);

  const layout = config.layout || "single";
  const totalSteps = config.sections.length;

  const renderSectionFields = (sectionIndex: number) => {
    const section = config.sections[sectionIndex];
    if (!section) return null;
    return (
      <div
        className={cn(
          "grid gap-4",
          section.columns === 2 && "md:grid-cols-2",
          section.columns === 3 && "md:grid-cols-3",
          section.columns === 4 && "md:grid-cols-4"
        )}
      >
        {section.fields.map((field) => (
          <GenericFormField key={field.name} config={field} />
        ))}
      </div>
    );
  };

  const getSectionErrorCount = (sectionIndex: number) => {
    const section = config.sections[sectionIndex];
    if (!section) return 0;
    return section.fields.filter(f => form.formState.errors[f.name]).length;
  };

  const isSectionComplete = (sectionIndex: number) => {
    const section = config.sections[sectionIndex];
    if (!section) return false;
    const requiredFields = section.fields.filter(f => f.required);
    if (requiredFields.length === 0) return true;
    return requiredFields.every(f => {
      const value = form.getValues(f.name);
      if (value === undefined || value === null || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return !form.formState.errors[f.name];
    });
  };

  const getOverallProgress = () => {
    const allRequiredFields = config.sections.flatMap(s => s.fields.filter(f => f.required));
    if (allRequiredFields.length === 0) return 100;
    const filledCount = allRequiredFields.filter(f => {
      const value = form.getValues(f.name);
      if (value === undefined || value === null || value === '') return false;
      if (Array.isArray(value) && value.length === 0) return false;
      return true;
    }).length;
    return Math.round((filledCount / allRequiredFields.length) * 100);
  };

  const validateSection = async (sectionIndex: number) => {
    const section = config.sections[sectionIndex];
    if (!section) return true;
    const fieldNames = section.fields.map(f => f.name);
    return await form.trigger(fieldNames);
  };

  const renderGlobalError = () => {
    if (!globalError) return null;
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Server Error</AlertTitle>
        <AlertDescription className="flex items-center justify-between">
          <span>{globalError}</span>
          <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => setGlobalError(null)}>
            <X className="h-3 w-3" />
          </Button>
        </AlertDescription>
      </Alert>
    );
  };

  // ─── SINGLE LAYOUT ───
  if (layout === "single") {
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
          {renderGlobalError()}
          {config.title && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{config.title}</h2>
              {config.description && <p className="text-muted-foreground">{config.description}</p>}
            </div>
          )}
          {config.sections.map((section, sectionIndex) => (
            <Card key={section.id}>
              {(section.title || section.description) && (
                <CardHeader>
                  {section.title && <CardTitle>{section.title}</CardTitle>}
                  {section.description && <CardDescription>{section.description}</CardDescription>}
                </CardHeader>
              )}
              <CardContent className={!section.title && !section.description ? "pt-6" : ""}>
                {renderSectionFields(sectionIndex)}
              </CardContent>
              {sectionIndex < config.sections.length - 1 && <Separator />}
            </Card>
          ))}
          <div className="flex gap-4">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : config.submitLabel || "Submit"}
            </Button>
            {config.showReset && (
              <Button type="button" variant="outline" onClick={() => form.reset()}>
                {config.resetLabel || "Reset"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    );
  }

  // ─── COMPACT LAYOUT ───
  if (layout === "compact") {
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit} className={cn("space-y-4", className)}>
          {renderGlobalError()}
          {config.sections.map((section, sectionIndex) => (
            <div key={section.id}>{renderSectionFields(sectionIndex)}</div>
          ))}
          <div className="flex gap-4">
            <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Submitting..." : config.submitLabel || "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    );
  }

  // ─── MULTI-TAB LAYOUT ───
  if (layout === "multi-tab") {
    const currentIndex = config.sections.findIndex(s => s.id === activeTab);
    const isFirst = currentIndex <= 0;
    const isLast = currentIndex >= config.sections.length - 1;

    const handleTabChange = async (newTab: string) => {
      const newIndex = config.sections.findIndex(s => s.id === newTab);
      const curIndex = config.sections.findIndex(s => s.id === activeTab);
      if (newIndex > curIndex) {
        for (let i = curIndex; i < newIndex; i++) {
          const valid = await validateSection(i);
          if (!valid) return;
        }
      }
      setActiveTab(newTab);
    };

    return (
      <Form {...form}>
        <form onSubmit={handleSubmit} className={cn("space-y-0", className)}>
          {renderGlobalError()}
          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="bg-muted/30 border border-border rounded-t-lg px-2 pt-2">
              <TabsList className="h-auto bg-transparent p-0 gap-0 w-full justify-start flex-wrap">
                {config.sections.map((section, idx) => {
                  const errorCount = getSectionErrorCount(idx);
                  const completed = isSectionComplete(idx);
                  const isActive = section.id === activeTab;
                  return (
                    <TabsTrigger
                      key={section.id}
                      value={section.id}
                      className="rounded-b-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-sm font-medium gap-2"
                    >
                      {completed && !isActive && (
                        <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center shrink-0">
                          <Check className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                      )}
                      {section.title || section.id}
                      {errorCount > 0 && (
                        <Badge variant="destructive" className="h-5 px-1.5 text-[10px] gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errorCount}
                        </Badge>
                      )}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="border border-t-0 border-border rounded-b-lg">
              {config.sections.map((section, sectionIndex) => (
                <TabsContent key={section.id} value={section.id} className="mt-0 p-6">
                  {(section.title || section.description) && (
                    <div className="mb-6">
                      {section.title && <h3 className="text-lg font-semibold">{section.title}</h3>}
                      {section.description && <p className="text-sm text-muted-foreground mt-1">{section.description}</p>}
                    </div>
                  )}
                  {renderSectionFields(sectionIndex)}
                </TabsContent>
              ))}
              <Separator />
              <div className="flex items-center justify-between p-4">
                <Button type="button" variant="secondary" onClick={() => form.reset()}>Cancel</Button>
                <div className="flex items-center gap-2">
                  <Button type="button" variant="ghost" disabled={isFirst}
                    onClick={() => { if (currentIndex > 0) setActiveTab(config.sections[currentIndex - 1].id); }}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />Previous
                  </Button>
                  {isLast ? (
                    <Button type="submit" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Submitting..." : config.submitLabel || "Submit"}
                    </Button>
                  ) : (
                    <Button type="button" onClick={async () => {
                      const valid = await validateSection(currentIndex);
                      if (valid && currentIndex < config.sections.length - 1) {
                        setActiveTab(config.sections[currentIndex + 1].id);
                      }
                    }}>
                      Next<ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Tabs>
        </form>
      </Form>
    );
  }

  // ─── WIZARD LAYOUT ───
  if (layout === "wizard") {
    const currentSection = config.sections[currentStep];
    const progress = getOverallProgress();
    return (
      <Form {...form}>
        <form onSubmit={handleSubmit} className={cn("space-y-6", className)}>
          {renderGlobalError()}
          {config.title && (
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">{config.title}</h2>
              {config.description && <p className="text-muted-foreground">{config.description}</p>}
            </div>
          )}

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Step {currentStep + 1} of {totalSteps}</span>
              <span>{progress}% complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Step indicators */}
          <div className="flex items-center justify-between">
            {config.sections.map((section, idx) => {
              const errorCount = getSectionErrorCount(idx);
              const completed = isSectionComplete(idx);
              return (
                <div key={section.id} className="flex items-center gap-2 flex-1">
                  <div className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all shrink-0 relative",
                    completed && idx < currentStep ? "bg-primary border-primary text-primary-foreground"
                      : idx === currentStep ? "border-primary text-primary bg-background"
                      : idx < currentStep ? "bg-primary border-primary text-primary-foreground"
                      : "border-muted text-muted-foreground"
                  )}>
                    {completed && idx < currentStep ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      idx + 1
                    )}
                    {errorCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-4 w-4 p-0 text-[9px] flex items-center justify-center">
                        {errorCount}
                      </Badge>
                    )}
                  </div>
                  <span className={cn("text-xs font-medium hidden sm:block truncate",
                    idx <= currentStep ? "text-foreground" : "text-muted-foreground"
                  )}>
                    {section.title || `Step ${idx + 1}`}
                  </span>
                  {idx < config.sections.length - 1 && (
                    <div className={cn("flex-1 h-0.5 mx-2", idx < currentStep ? "bg-primary" : "bg-muted")} />
                  )}
                </div>
              );
            })}
          </div>

          <Card>
            {(currentSection?.title || currentSection?.description) && (
              <CardHeader>
                {currentSection.title && <CardTitle>{currentSection.title}</CardTitle>}
                {currentSection.description && <CardDescription>{currentSection.description}</CardDescription>}
              </CardHeader>
            )}
            <CardContent className={!currentSection?.title && !currentSection?.description ? "pt-6" : ""}>
              {renderSectionFields(currentStep)}
            </CardContent>
          </Card>
          <div className="flex items-center justify-between">
            <Button type="button" variant="outline" disabled={currentStep === 0}
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            >
              <ChevronLeft className="h-4 w-4 mr-1" />Previous
            </Button>
            {currentStep < totalSteps - 1 ? (
              <Button type="button" onClick={async () => {
                const valid = await validateSection(currentStep);
                if (valid) setCurrentStep(Math.min(totalSteps - 1, currentStep + 1));
              }}>
                Next<ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            ) : (
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Submitting..." : config.submitLabel || "Submit"}
              </Button>
            )}
          </div>
        </form>
      </Form>
    );
  }

  return null;
}
