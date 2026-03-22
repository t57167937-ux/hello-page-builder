import { useState } from "react";
import {
  Menu, Search, Bell, MessageSquare, HelpCircle, ChevronDown,
  User, Settings, CreditCard, LogOut, X, PanelLeftClose, PanelLeftOpen,
  Sun, Moon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { headerConfig, currentUser, notificationsConfig } from "@/data/dashboardConfig";
import { useTheme } from "@/contexts/ThemeContext";
import DashboardSidebar from "./DashboardSidebar";

interface DashboardHeaderProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onSearch?: (query: string) => void;
}

export function DashboardHeader({
  isSidebarCollapsed,
  onToggleSidebar,
  onSearch,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const unreadCount = notificationsConfig.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-card/95 backdrop-blur-sm px-4 lg:px-6">
      {/* Mobile Menu Toggle */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0">
            <Menu size={20} />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-16 items-center border-b border-border px-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary rounded-lg">
                <headerConfig.logo.icon size={18} className="text-primary-foreground" />
              </div>
              <span className="font-bold">{headerConfig.logo.text}</span>
            </div>
          </div>
          <DashboardSidebar onItemClick={() => setMobileMenuOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleSidebar}
        className="hidden lg:flex shrink-0"
      >
        {isSidebarCollapsed ? (
          <PanelLeftOpen size={20} />
        ) : (
          <PanelLeftClose size={20} />
        )}
        <span className="sr-only">Toggle sidebar</span>
      </Button>

      {/* Logo (Mobile) */}
      <div className="flex items-center gap-2 lg:hidden">
        <div className="p-1.5 bg-primary rounded-lg">
          <headerConfig.logo.icon size={16} className="text-primary-foreground" />
        </div>
        <span className="font-bold text-sm">{headerConfig.logo.text}</span>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={headerConfig.search.placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-12 bg-muted/50 border-transparent focus-visible:bg-background focus-visible:border-border"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none hidden sm:inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 text-[10px] font-medium text-muted-foreground">
            {headerConfig.search.shortcut}
          </kbd>
        </div>
      </form>

      {/* Mobile Search Button */}
      <Button variant="ghost" size="icon" className="md:hidden ml-auto">
        <Search size={20} />
      </Button>

      <div className="flex items-center gap-1 md:gap-2 ml-auto md:ml-0">
        {/* Notifications */}
        <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell size={20} />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px]"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h4 className="font-semibold">Notifications</h4>
              <Button variant="ghost" size="sm" className="text-xs h-7">
                Mark all read
              </Button>
            </div>
            <ScrollArea className="h-80">
              <div className="divide-y divide-border">
                {notificationsConfig.map((notification) => {
                  const NotifIcon = notification.icon;
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex gap-3 p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                        !notification.read && "bg-primary/5"
                      )}
                    >
                      <div className="p-2 rounded-full bg-muted shrink-0">
                        <NotifIcon size={16} className="text-muted-foreground" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-sm", !notification.read && "font-medium")}>
                          {notification.title}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {notification.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {notification.time}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
            <div className="p-2 border-t border-border">
              <Button variant="ghost" size="sm" className="w-full text-xs">
                View all notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Messages */}
        <Button variant="ghost" size="icon" className="relative hidden sm:flex">
          <MessageSquare size={20} />
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 min-w-5 px-1 text-[10px]"
          >
            5
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="hidden sm:flex"
        >
          {theme === "dark" ? (
            <Sun size={20} className="text-amber-500" />
          ) : (
            <Moon size={20} />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Help */}
        <Button variant="ghost" size="icon" className="hidden md:flex">
          <HelpCircle size={20} />
        </Button>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 md:px-3"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {currentUser.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-sm font-medium">{currentUser.name}</span>
                <span className="text-[10px] text-muted-foreground">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown size={16} className="hidden md:block text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{currentUser.name}</p>
                <p className="text-xs text-muted-foreground">{currentUser.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {headerConfig.userMenu.items.map((item) => {
              const ItemIcon = item.icon;
              if (item.separator) {
                return (
                  <div key={item.id}>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className={cn(
                        item.variant === "destructive" && "text-destructive focus:text-destructive"
                      )}
                    >
                      <ItemIcon size={16} className="mr-2" />
                      {item.label}
                    </DropdownMenuItem>
                  </div>
                );
              }
              return (
                <DropdownMenuItem
                  key={item.id}
                  className={cn(
                    item.variant === "destructive" && "text-destructive focus:text-destructive"
                  )}
                >
                  <ItemIcon size={16} className="mr-2" />
                  {item.label}
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default DashboardHeader;
