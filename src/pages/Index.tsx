import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PanelRightClose, PanelRightOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import VariableEditor from "@/components/lab/VariableEditor";
import ComponentPreview from "@/components/lab/ComponentPreview";
import ExportPanel from "@/components/lab/ExportPanel";
import LanguageSelector from "@/components/lab/LanguageSelector";
import { cn } from "@/lib/utils";

export default function Index() {
  const [editorOpen, setEditorOpen] = useState(true);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="flex items-center justify-between h-14 px-4 border-b border-border bg-card/80 backdrop-blur-sm shrink-0">
        <div>
          <h1 className="text-sm font-semibold">All Components</h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            Edit CSS variables and see changes in real-time
          </p>
        </div>

        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ExportPanel />
          <Button
            variant="ghost"
            size="sm"
            className="hidden md:flex gap-2"
            onClick={() => setEditorOpen(!editorOpen)}
          >
            {editorOpen ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
            <span className="hidden lg:inline">{editorOpen ? "Hide" : "Show"} Editor</span>
          </Button>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Preview */}
        <div className="flex-1 overflow-hidden bg-muted/20">
          <ComponentPreview componentId="all" />
        </div>

        {/* Variable Editor - Desktop */}
        <div
          className={cn(
            "hidden md:block w-80 min-w-[320px] shrink-0 transition-all duration-300",
            editorOpen ? "translate-x-0" : "translate-x-full w-0 min-w-0"
          )}
        >
          {editorOpen && <VariableEditor />}
        </div>
      </div>

      {/* Mobile Editor Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
            size="icon"
          >
            <PanelRightOpen size={20} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[320px] p-0">
          <SheetTitle className="sr-only">Theme Editor</SheetTitle>
          <VariableEditor />
        </SheetContent>
      </Sheet>
    </div>
  );
}
