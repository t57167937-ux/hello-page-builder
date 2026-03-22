import { useState } from "react";
import { ChevronRight, ChevronDown, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
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
import { sidebarConfig, NavItem, NavSection } from "@/data/dashboardConfig";

interface DashboardSidebarProps {
  isCollapsed?: boolean;
  activeItemId?: string;
  onItemClick?: (itemId: string, href?: string) => void;
}

export function DashboardSidebar({
  isCollapsed = false,
  activeItemId,
  onItemClick,
}: DashboardSidebarProps) {
  return (
    <ScrollArea className="h-full">
      <div className={cn("py-4", isCollapsed ? "px-2" : "px-3")}>
        {sidebarConfig.map((section) => (
          <NavSectionComponent
            key={section.id}
            section={section}
            isCollapsed={isCollapsed}
            activeItemId={activeItemId}
            onItemClick={onItemClick}
          />
        ))}
      </div>
    </ScrollArea>
  );
}

interface NavSectionComponentProps {
  section: NavSection;
  isCollapsed: boolean;
  activeItemId?: string;
  onItemClick?: (itemId: string, href?: string) => void;
}

function NavSectionComponent({
  section,
  isCollapsed,
  activeItemId,
  onItemClick,
}: NavSectionComponentProps) {
  return (
    <div className="mb-6">
      {section.title && !isCollapsed && (
        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {section.title}
        </p>
      )}
      <nav className="space-y-1">
        {section.items.map((item) => (
          <NavItemComponent
            key={item.id}
            item={item}
            level={0}
            isCollapsed={isCollapsed}
            activeItemId={activeItemId}
            onItemClick={onItemClick}
          />
        ))}
      </nav>
    </div>
  );
}

interface NavItemComponentProps {
  item: NavItem;
  level: number;
  isCollapsed: boolean;
  activeItemId?: string;
  onItemClick?: (itemId: string, href?: string) => void;
}

function NavItemComponent({
  item,
  level,
  isCollapsed,
  activeItemId,
  onItemClick,
}: NavItemComponentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive = activeItemId === item.id;
  const Icon = item.icon;

  const paddingLeft = isCollapsed ? 0 : level * 12;

  const handleClick = () => {
    if (hasChildren && item.isCollapsible) {
      setIsOpen(!isOpen);
    } else if (onItemClick) {
      onItemClick(item.id, item.href);
    }
  };

  const buttonContent = (
    <button
      onClick={handleClick}
      disabled={item.isDisabled}
      className={cn(
        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
        isActive
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
        item.isDisabled && "opacity-50 cursor-not-allowed",
        isCollapsed && "justify-center px-2"
      )}
      style={{ paddingLeft: isCollapsed ? undefined : `${12 + paddingLeft}px` }}
    >
      <Icon
        size={18}
        className={cn(
          "shrink-0",
          isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary"
        )}
      />
      {!isCollapsed && (
        <>
          <span className="flex-1 text-left truncate">{item.label}</span>
          {item.badge !== undefined && (
            <Badge
              variant={item.badgeVariant || "secondary"}
              className="h-5 min-w-5 px-1.5 text-[10px]"
            >
              {item.badge}
            </Badge>
          )}
          {hasChildren && item.isCollapsible && (
            <span className="ml-auto">
              {isOpen ? (
                <ChevronDown size={14} className="text-muted-foreground" />
              ) : (
                <ChevronRight size={14} className="text-muted-foreground" />
              )}
            </span>
          )}
        </>
      )}
    </button>
  );

  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span>{item.label}</span>
          {item.badge !== undefined && (
            <Badge variant={item.badgeVariant || "secondary"} className="text-[10px]">
              {item.badge}
            </Badge>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  if (hasChildren && item.isCollapsible) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>{buttonContent}</CollapsibleTrigger>
        <CollapsibleContent className="mt-1">
          {item.children!.map((child) => (
            <NavItemComponent
              key={child.id}
              item={child}
              level={level + 1}
              isCollapsed={isCollapsed}
              activeItemId={activeItemId}
              onItemClick={onItemClick}
            />
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return buttonContent;
}

export default DashboardSidebar;
