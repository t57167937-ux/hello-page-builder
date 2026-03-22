import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GenericForm, FormConfig } from "@/components/forms";
import { buildZodSchema } from "@/utils/zodSchemaBuilder";
import { extractFields } from "@/utils/zodSchemaBuilder";
import { SubmittedDataView } from "./SubmittedDataView";
import { Eye, Plus, FileJson, ChevronDown, ChevronUp } from "lucide-react";

interface PreviewTabProps {
  formConfig: FormConfig;
  onSubmit: (data: Record<string, unknown>) => void;
  submittedData: Record<string, unknown> | null;
  onClearSubmittedData: () => void;
}

export function PreviewTab({ formConfig, onSubmit, submittedData, onClearSubmittedData }: PreviewTabProps) {
  const [showJson, setShowJson] = useState(false);
  const hasFields = formConfig.sections.some(s => s.fields.length > 0);

  return (
    <div className="space-y-4">
      <Card className="border-border">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            <CardTitle>Live Preview</CardTitle>
          </div>
          <CardDescription>Interactive preview — fill it out and submit to test validation</CardDescription>
        </CardHeader>
        <CardContent>
          {hasFields ? (
            <>
              <GenericForm key={JSON.stringify(formConfig)} config={formConfig} schema={buildZodSchema(extractFields(formConfig))} onSubmit={onSubmit} />
              <SubmittedDataView data={submittedData} onClear={onClearSubmittedData} />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Plus className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">No fields yet</p>
              <p className="text-sm text-muted-foreground">Add fields in the Builder tab</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* JSON Configuration Panel */}
      <Card className="border-border">
        <CardHeader className="pb-0 pt-3 px-4 cursor-pointer" onClick={() => setShowJson(!showJson)}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileJson className="h-4 w-4 text-primary" />
              <CardTitle className="text-sm">JSON Configuration</CardTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-7 w-7">
              {showJson ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        {showJson && (
          <CardContent className="pt-3 px-4 pb-4">
            <ScrollArea className="max-h-[400px]">
              <pre className="text-xs font-mono p-3 rounded-lg bg-muted/50 border border-border overflow-x-auto leading-relaxed">
                {JSON.stringify(formConfig, null, 2)}
              </pre>
            </ScrollArea>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
