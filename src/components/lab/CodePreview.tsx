import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Copy, Check, Code2, Eye, FileCode } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface CodePreviewProps {
  title: string;
  code: string;
  children: React.ReactNode;
  className?: string;
}

// Generate full React component code that's ready to copy/paste
function generateFullComponent(title: string, code: string): string {
  const componentName = title.replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "") + "Example";
  
  // Extract imports from the code
  const importLines = code.split("\n").filter(line => line.trim().startsWith("import"));
  const jsxLines = code.split("\n").filter(line => !line.trim().startsWith("import") && !line.trim().startsWith("//"));
  
  const imports = importLines.length > 0 
    ? importLines.join("\n") 
    : `import { Button } from "@/components/ui/button";`;

  const jsx = jsxLines.filter(line => line.trim()).join("\n    ");

  return `// ${title} - Ready to use React component
// Copy this entire file to your project

${imports}

export default function ${componentName}() {
  return (
    <div className="flex flex-wrap gap-3 p-4">
      ${jsx || code}
    </div>
  );
}
`;
}

export default function CodePreview({ title, code, children, className }: CodePreviewProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code" | "component">("preview");

  const fullComponentCode = generateFullComponent(title, code);

  const copyCode = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn("border border-border rounded-lg overflow-hidden bg-card", className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30">
        <span className="text-sm font-medium">{title}</span>
        <div className="flex items-center gap-2">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "code" | "component")}>
            <TabsList className="h-7 p-0.5">
              <TabsTrigger value="preview" className="h-6 px-2 text-xs gap-1">
                <Eye size={12} />
                {t("code.preview")}
              </TabsTrigger>
              <TabsTrigger value="code" className="h-6 px-2 text-xs gap-1">
                <Code2 size={12} />
                Snippet
              </TabsTrigger>
              <TabsTrigger value="component" className="h-6 px-2 text-xs gap-1">
                <FileCode size={12} />
                Component
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* Content */}
      {activeTab === "preview" ? (
        <div className="p-6 bg-background">
          {children}
        </div>
      ) : (
        <div className="relative">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyCode(activeTab === "component" ? fullComponentCode : code)}
                className="absolute top-2 right-2 h-7 w-7 p-0 z-10"
              >
                {copied ? (
                  <Check size={14} className="text-primary" />
                ) : (
                  <Copy size={14} />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {copied ? t("code.copied") : t("code.copyCode")}
            </TooltipContent>
          </Tooltip>
          <ScrollArea className="h-[300px]">
            <pre className="p-4 text-xs font-mono leading-relaxed overflow-x-auto bg-muted/30">
              <code className="text-foreground">
                {activeTab === "component" ? fullComponentCode : code}
              </code>
            </pre>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
