import { useState } from "react";
import { Copy, Check, Code2, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ComponentLabConfig, ComponentVariant, getLabConfig } from "@/data/componentLabConfig";

// Dynamic component imports for rendering
import { Button as UIButton } from "@/components/ui/button";
import { Badge as UIBadge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Card as UICard, CardContent as UICardContent, CardHeader as UICardHeader, CardTitle as UICardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Tabs as UITabs, TabsList as UITabsList, TabsTrigger as UITabsTrigger, TabsContent as UITabsContent } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Settings, ArrowRight, Loader2, Star, AlertCircle, CheckCircle2, Info, AlertTriangle, User, Search, Check as CheckIcon } from "lucide-react";

interface ComponentLabRendererProps {
  componentId: string;
}

export function ComponentLabRenderer({ componentId }: ComponentLabRendererProps) {
  const config = getLabConfig(componentId);
  
  if (!config) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Component lab not found for: {componentId}
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h1 className="text-2xl font-bold">{config.name}</h1>
            <Badge variant="secondary">{config.category}</Badge>
          </div>
          <p className="text-muted-foreground">{config.description}</p>
        </div>

        {/* Variants Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {config.variants.map((variant) => (
            <VariantCard key={variant.id} variant={variant} componentId={componentId} />
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}

function VariantCard({ variant, componentId }: { variant: ComponentVariant; componentId: string }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");

  const copyCode = async () => {
    await navigator.clipboard.writeText(variant.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{variant.title}</CardTitle>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "code")}>
            <TabsList className="h-7 p-0.5">
              <TabsTrigger value="preview" className="h-6 px-2 text-xs gap-1">
                <Eye size={12} /> Preview
              </TabsTrigger>
              <TabsTrigger value="code" className="h-6 px-2 text-xs gap-1">
                <Code2 size={12} /> Code
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <p className="text-xs text-muted-foreground">{variant.description}</p>
      </CardHeader>
      <CardContent>
        {activeTab === "preview" ? (
          <div className="p-4 bg-muted/30 rounded-lg min-h-[80px] flex items-center justify-center">
            <RenderVariant componentId={componentId} variant={variant} />
          </div>
        ) : (
          <div className="relative">
            <pre className="p-4 bg-muted/50 rounded-lg text-xs overflow-x-auto">
              <code>{variant.code}</code>
            </pre>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-7 w-7"
              onClick={copyCode}
            >
              {copied ? <CheckIcon size={14} /> : <Copy size={14} />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RenderVariant({ componentId, variant }: { componentId: string; variant: ComponentVariant }) {
  const { props } = variant;

  switch (componentId) {
    case "button":
      if (props.loading) {
        return <UIButton disabled><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading</UIButton>;
      }
      if (props.iconLeft) {
        return <UIButton {...props}><Mail className="mr-2 h-4 w-4" />{props.children}</UIButton>;
      }
      if (props.iconRight) {
        return <UIButton {...props}>{props.children}<ArrowRight className="ml-2 h-4 w-4" /></UIButton>;
      }
      if (props.size === "icon") {
        return <UIButton {...props}><Settings className="h-4 w-4" /></UIButton>;
      }
      return <UIButton {...props}>{props.children}</UIButton>;

    case "badge":
      if (props.hasDot) {
        return <UIBadge {...props} className="gap-1.5"><span className="h-2 w-2 rounded-full bg-green-500" />{props.children}</UIBadge>;
      }
      if (props.hasIcon) {
        return <UIBadge {...props}><Star className="mr-1 h-3 w-3" />{props.children}</UIBadge>;
      }
      return <UIBadge {...props}>{props.children}</UIBadge>;

    case "input":
      if (props.iconLeft) {
        return (
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input className="pl-10" placeholder={props.placeholder} />
          </div>
        );
      }
      if (props.label) {
        return (
          <div className="space-y-2 w-full max-w-xs">
            <Label>{props.label}</Label>
            <Input {...props} />
          </div>
        );
      }
      return <Input {...props} className="max-w-xs" />;

    case "switch":
      if (props.label) {
        return (
          <div className="flex items-center space-x-2">
            <Switch {...props} />
            <Label>{props.label}</Label>
          </div>
        );
      }
      return <Switch {...props} />;

    case "checkbox":
      if (props.label) {
        return (
          <div className="flex items-center space-x-2">
            <Checkbox {...props} />
            <Label>{props.label}</Label>
          </div>
        );
      }
      return <Checkbox {...props} />;

    case "progress":
      return <Progress value={props.value} className="w-full max-w-xs" />;

    case "slider":
      return <Slider defaultValue={props.defaultValue} max={100} className="w-full max-w-xs" disabled={props.disabled} />;

    case "alert":
      return (
        <Alert variant={props.variant} className="max-w-sm">
          {props.type === "success" && <CheckCircle2 className="h-4 w-4" />}
          {props.type === "info" && <Info className="h-4 w-4" />}
          {props.type === "warning" && <AlertTriangle className="h-4 w-4" />}
          {props.variant === "destructive" && <AlertCircle className="h-4 w-4" />}
          <AlertTitle>{props.title}</AlertTitle>
          <AlertDescription>{props.description}</AlertDescription>
        </Alert>
      );

    default:
      return <div className="text-sm text-muted-foreground">Preview not available</div>;
  }
}

export default ComponentLabRenderer;
