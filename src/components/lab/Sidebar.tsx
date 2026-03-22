import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search, X, Sun, Moon, LayoutDashboard, Star, Trash2,
  Layers, Square, MousePointer2, CheckSquare, Command, TextCursorInput,
  List, AlertCircle, FormInput, ToggleLeft, SlidersHorizontal, CreditCard,
  PanelTop, MessageSquare, Table2, Languages, Sparkles, CircleDot,
  ChevronDown, ChevronRight, Info, Loader2, ListFilter, ExternalLink, MessageCircle, Maximize2,
  AlertTriangle, Navigation, GalleryHorizontal, CombineIcon, PanelLeftClose, Menu, PanelLeft,
  ScrollText, ToggleRight, Minus, PanelRightOpen, FileJson
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Demo layouts that route to separate pages
const DEMO_LAYOUTS = [
  { id: "dashboard", name: "Dashboard", icon: <LayoutDashboard size={16} />, route: "/dashboard" },
  { id: "form-builder", name: "Form Builder", icon: <FileJson size={16} />, route: "/form-builder" },
];

// Component items for the lab preview
const MENU_ITEMS = [
  { id: "all", name: "All Components", icon: <Sparkles size={16} /> },
  { id: "accordion", name: "Accordion", icon: <List size={16} /> },
  { id: "alert", name: "Alert", icon: <AlertCircle size={16} /> },
  { id: "alert-dialog", name: "Alert Dialog", icon: <AlertTriangle size={16} /> },
  { id: "badge", name: "Badge", icon: <Square size={16} /> },
  { id: "breadcrumb", name: "Breadcrumb", icon: <Navigation size={16} /> },
  { id: "button", name: "Button", icon: <MousePointer2 size={16} /> },
  { id: "card", name: "Card", icon: <CreditCard size={16} /> },
  { id: "carousel", name: "Carousel", icon: <GalleryHorizontal size={16} /> },
  { id: "checkbox", name: "Checkbox", icon: <CheckSquare size={16} /> },
  { id: "collapsible", name: "Collapsible", icon: <PanelLeftClose size={16} /> },
  { id: "combobox", name: "Combobox", icon: <ListFilter size={16} /> },
  { id: "command", name: "Command", icon: <Command size={16} /> },
  { id: "composite-input", name: "Composite Input", icon: <CombineIcon size={16} /> },
  { id: "dialog", name: "Dialog", icon: <Layers size={16} /> },
  { id: "dropdown", name: "Dropdown Menu", icon: <ChevronDown size={16} /> },
  { id: "form", name: "Form", icon: <FormInput size={16} /> },
  { id: "input", name: "Input", icon: <TextCursorInput size={16} /> },
  { id: "menubar", name: "Menubar", icon: <Menu size={16} /> },
  { id: "navigation-menu", name: "Navigation Menu", icon: <PanelLeft size={16} /> },
  { id: "popover", name: "Popover", icon: <Maximize2 size={16} /> },
  { id: "progress", name: "Progress", icon: <Loader2 size={16} /> },
  { id: "radio", name: "Radio Group", icon: <CircleDot size={16} /> },
  { id: "scroll-area", name: "Scroll Area", icon: <ScrollText size={16} /> },
  { id: "select", name: "Select", icon: <MessageCircle size={16} /> },
  { id: "separator", name: "Separator", icon: <Minus size={16} /> },
  { id: "sheet", name: "Sheet", icon: <PanelRightOpen size={16} /> },
  { id: "slider", name: "Slider", icon: <SlidersHorizontal size={16} /> },
  { id: "switch", name: "Switch", icon: <ToggleLeft size={16} /> },
  { id: "tabs", name: "Tabs", icon: <PanelTop size={16} /> },
  { id: "toggle", name: "Toggle", icon: <ToggleRight size={16} /> },
  { id: "tooltip", name: "Tooltip", icon: <Info size={16} /> },
];

const COMING_SOON = [
  { id: "table", name: "Data Table", icon: <Table2 size={16} /> },
  { id: "i18n", name: "Internationalization", icon: <Languages size={16} /> },
];

interface SidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
  isMobile?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, isMobile, onClose }: SidebarProps) {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ui-lab-favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("ui-lab-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const clearFavorites = () => {
    setFavorites([]);
  };

  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const favoriteItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => favorites.includes(item.id));
  }, [favorites]);

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onClose?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-6 px-2">
        <div className="p-2 bg-primary rounded-xl text-primary-foreground shadow-lg glow-primary">
          <LayoutDashboard size={20} />
        </div>
        <div>
          <h1 className="text-xl font-black tracking-tight">Afno UI</h1>
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Theme Editor</p>
        </div>
      </div>

      {/* Search */}
      <div className="px-2 mb-4 relative group">
        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={14} />
        <Input
          placeholder="Search components..."
          className="pl-9 h-9 text-sm rounded-lg bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            <X size={12} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 custom-scrollbar">
        <nav className="space-y-4 pr-3">
          {/* Demo Layouts Section - Collapsible */}
          {!searchQuery && (
            <CollapsibleSection title="Demo Layouts" defaultOpen>
              {DEMO_LAYOUTS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.route);
                    onClose?.();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group text-muted-foreground hover:text-foreground hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-muted-foreground group-hover:text-primary">
                      {item.icon}
                    </span>
                    <span>{item.name}</span>
                  </div>
                  <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                </button>
              ))}
            </CollapsibleSection>
          )}

          {/* Favorites */}
          {favoriteItems.length > 0 && !searchQuery && (
            <CollapsibleSection 
              title="Favorites" 
              defaultOpen
              action={
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      onClick={clearFavorites}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={10} />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="text-xs">Clear all</TooltipContent>
                </Tooltip>
              }
            >
              {favoriteItems.map((item) => (
                <NavButton
                  key={`fav-${item.id}`}
                  item={item}
                  isActive={activeTab === item.id}
                  isFavorite
                  onSelect={handleSelect}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </CollapsibleSection>
          )}

          {/* All Components - Collapsible */}
          <CollapsibleSection title="Components" defaultOpen>
            {filteredItems.map((item) => (
              <NavButton
                key={item.id}
                item={item}
                isActive={activeTab === item.id}
                isFavorite={favorites.includes(item.id)}
                onSelect={handleSelect}
                onToggleFavorite={toggleFavorite}
              />
            ))}
          </CollapsibleSection>

          {/* Coming Soon */}
          {!searchQuery && (
            <CollapsibleSection title="Coming Soon" defaultOpen={false}>
              {COMING_SOON.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground/50 cursor-not-allowed"
                >
                  <span className="opacity-50">{item.icon}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </CollapsibleSection>
          )}
        </nav>
      </ScrollArea>

      {/* Theme Toggle */}
      <div className="pt-4 mt-4 border-t border-border">
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-full flex items-center justify-between p-3 rounded-lg border border-border bg-muted/30 hover:bg-muted/50 hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center gap-3">
            {theme === "dark" ? (
              <Sun size={16} className="text-amber-500" />
            ) : (
              <Moon size={16} className="text-primary" />
            )}
            <span className="text-xs font-medium">
              {theme === "dark" ? "Light Mode" : "Dark Mode"}
            </span>
          </div>
        </button>
      </div>
    </div>
  );
}

// Collapsible Section Component
function CollapsibleSection({ 
  title, 
  children, 
  defaultOpen = true,
  action 
}: { 
  title: string; 
  children: React.ReactNode; 
  defaultOpen?: boolean;
  action?: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex items-center justify-between px-2 mb-2">
        <CollapsibleTrigger className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
          {isOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
          {title}
        </CollapsibleTrigger>
        {action}
      </div>
      <CollapsibleContent className="space-y-1">
        {children}
      </CollapsibleContent>
    </Collapsible>
  );
}

interface NavButtonProps {
  item: { id: string; name: string; icon: React.ReactNode };
  isActive: boolean;
  isFavorite: boolean;
  onSelect: (id: string) => void;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
}

function NavButton({ item, isActive, isFavorite, onSelect, onToggleFavorite }: NavButtonProps) {
  return (
    <button
      onClick={() => onSelect(item.id)}
      className={cn(
        "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group relative",
        isActive
          ? "bg-primary text-primary-foreground shadow-md glow-primary"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-3">
        <span className={cn(isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary")}>
          {item.icon}
        </span>
        <span>{item.name}</span>
      </div>
      {item.id !== "all" && (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              onClick={(e) => onToggleFavorite(item.id, e)}
              className={cn(
                "p-1 rounded transition-all",
                isFavorite
                  ? "text-amber-500 opacity-100"
                  : "opacity-0 group-hover:opacity-100 hover:text-amber-500",
                isActive && "text-primary-foreground hover:text-amber-300"
              )}
            >
              <Star size={12} fill={isFavorite ? "currentColor" : "none"} />
            </div>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {isFavorite ? "Remove from favorites" : "Add to favorites"}
          </TooltipContent>
        </Tooltip>
      )}
    </button>
  );
}
