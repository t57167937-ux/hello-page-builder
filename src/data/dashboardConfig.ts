import {
  LayoutDashboard, Users, Settings, BarChart3, FileText, Bell,
  CreditCard, Package, ShoppingCart, Calendar, Mail, MessageSquare,
  Folder, Star, Archive, Trash2, Search, HelpCircle, LogOut,
  ChevronRight, Home, Building2, Briefcase, UserCircle, Shield,
  Database, Cloud, Cpu, Activity, TrendingUp, DollarSign,
  PieChart, Target, Zap, Globe, Lock, Key, Smartphone, Monitor,
  Server, Wifi, HardDrive, AlertTriangle, CheckCircle, Clock,
  LucideIcon
} from "lucide-react";

// Types for dashboard configuration
export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: string | number;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  children?: NavItem[];
  isCollapsible?: boolean;
  isDisabled?: boolean;
}

export interface NavSection {
  id: string;
  title?: string;
  items: NavItem[];
}

export interface HeaderAction {
  id: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: string;
  badge?: string | number;
  variant?: "default" | "ghost" | "outline";
}

export interface UserMenuAction {
  id: string;
  icon: LucideIcon;
  label: string;
  href?: string;
  onClick?: string;
  separator?: boolean;
  variant?: "default" | "destructive";
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: LucideIcon;
}

export interface DashboardUser {
  name: string;
  email: string;
  avatar?: string;
  role: string;
  status: "online" | "offline" | "busy" | "away";
}

export interface StatsCard {
  id: string;
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: LucideIcon;
  description?: string;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
  variant?: "default" | "secondary" | "outline" | "ghost";
  href?: string;
}

// Sidebar configuration with nested children (3 levels deep)
export const sidebarConfig: NavSection[] = [
  {
    id: "main",
    title: "Main",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        icon: LayoutDashboard,
        href: "/dashboard",
        badge: "New",
        badgeVariant: "default",
      },
      {
        id: "analytics",
        label: "Analytics",
        icon: BarChart3,
        isCollapsible: true,
        children: [
          {
            id: "analytics-overview",
            label: "Overview",
            icon: PieChart,
            href: "/analytics/overview",
          },
          {
            id: "analytics-reports",
            label: "Reports",
            icon: FileText,
            isCollapsible: true,
            children: [
              {
                id: "reports-sales",
                label: "Sales Report",
                icon: DollarSign,
                href: "/analytics/reports/sales",
              },
              {
                id: "reports-traffic",
                label: "Traffic Report",
                icon: TrendingUp,
                href: "/analytics/reports/traffic",
              },
              {
                id: "reports-conversion",
                label: "Conversion",
                icon: Target,
                href: "/analytics/reports/conversion",
              },
            ],
          },
          {
            id: "analytics-realtime",
            label: "Real-time",
            icon: Activity,
            href: "/analytics/realtime",
            badge: "Live",
            badgeVariant: "destructive",
          },
        ],
      },
    ],
  },
  {
    id: "commerce",
    title: "Commerce",
    items: [
      {
        id: "products",
        label: "Products",
        icon: Package,
        isCollapsible: true,
        children: [
          {
            id: "products-all",
            label: "All Products",
            icon: Package,
            href: "/products",
            badge: 248,
          },
          {
            id: "products-categories",
            label: "Categories",
            icon: Folder,
            isCollapsible: true,
            children: [
              {
                id: "cat-electronics",
                label: "Electronics",
                icon: Smartphone,
                href: "/products/categories/electronics",
              },
              {
                id: "cat-clothing",
                label: "Clothing",
                icon: Package,
                href: "/products/categories/clothing",
              },
              {
                id: "cat-accessories",
                label: "Accessories",
                icon: Star,
                href: "/products/categories/accessories",
              },
            ],
          },
          {
            id: "products-inventory",
            label: "Inventory",
            icon: Archive,
            href: "/products/inventory",
          },
        ],
      },
      {
        id: "orders",
        label: "Orders",
        icon: ShoppingCart,
        href: "/orders",
        badge: 12,
        badgeVariant: "secondary",
      },
      {
        id: "customers",
        label: "Customers",
        icon: Users,
        isCollapsible: true,
        children: [
          {
            id: "customers-all",
            label: "All Customers",
            icon: Users,
            href: "/customers",
          },
          {
            id: "customers-segments",
            label: "Segments",
            icon: Target,
            isCollapsible: true,
            children: [
              {
                id: "segment-vip",
                label: "VIP Customers",
                icon: Star,
                href: "/customers/segments/vip",
              },
              {
                id: "segment-new",
                label: "New Customers",
                icon: UserCircle,
                href: "/customers/segments/new",
              },
              {
                id: "segment-inactive",
                label: "Inactive",
                icon: Clock,
                href: "/customers/segments/inactive",
              },
            ],
          },
        ],
      },
      {
        id: "payments",
        label: "Payments",
        icon: CreditCard,
        href: "/payments",
      },
    ],
  },
  {
    id: "workspace",
    title: "Workspace",
    items: [
      {
        id: "calendar",
        label: "Calendar",
        icon: Calendar,
        href: "/calendar",
      },
      {
        id: "messages",
        label: "Messages",
        icon: Mail,
        href: "/messages",
        badge: 5,
        badgeVariant: "destructive",
      },
      {
        id: "documents",
        label: "Documents",
        icon: FileText,
        isCollapsible: true,
        children: [
          {
            id: "docs-recent",
            label: "Recent",
            icon: Clock,
            href: "/documents/recent",
          },
          {
            id: "docs-starred",
            label: "Starred",
            icon: Star,
            href: "/documents/starred",
          },
          {
            id: "docs-trash",
            label: "Trash",
            icon: Trash2,
            href: "/documents/trash",
          },
        ],
      },
    ],
  },
  {
    id: "system",
    title: "System",
    items: [
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        isCollapsible: true,
        children: [
          {
            id: "settings-general",
            label: "General",
            icon: Settings,
            href: "/settings/general",
          },
          {
            id: "settings-security",
            label: "Security",
            icon: Shield,
            isCollapsible: true,
            children: [
              {
                id: "security-auth",
                label: "Authentication",
                icon: Key,
                href: "/settings/security/auth",
              },
              {
                id: "security-permissions",
                label: "Permissions",
                icon: Lock,
                href: "/settings/security/permissions",
              },
              {
                id: "security-logs",
                label: "Audit Logs",
                icon: FileText,
                href: "/settings/security/logs",
              },
            ],
          },
          {
            id: "settings-integrations",
            label: "Integrations",
            icon: Zap,
            isCollapsible: true,
            children: [
              {
                id: "int-api",
                label: "API Keys",
                icon: Key,
                href: "/settings/integrations/api",
              },
              {
                id: "int-webhooks",
                label: "Webhooks",
                icon: Globe,
                href: "/settings/integrations/webhooks",
              },
              {
                id: "int-apps",
                label: "Connected Apps",
                icon: Smartphone,
                href: "/settings/integrations/apps",
              },
            ],
          },
        ],
      },
      {
        id: "infrastructure",
        label: "Infrastructure",
        icon: Server,
        isCollapsible: true,
        children: [
          {
            id: "infra-servers",
            label: "Servers",
            icon: Server,
            href: "/infrastructure/servers",
          },
          {
            id: "infra-database",
            label: "Database",
            icon: Database,
            href: "/infrastructure/database",
          },
          {
            id: "infra-storage",
            label: "Storage",
            icon: HardDrive,
            href: "/infrastructure/storage",
          },
          {
            id: "infra-network",
            label: "Network",
            icon: Wifi,
            href: "/infrastructure/network",
          },
        ],
      },
    ],
  },
];

// Header configuration
export const headerConfig = {
  logo: {
    text: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  search: {
    placeholder: "Search anything...",
    shortcut: "⌘K",
  },
  actions: [
    {
      id: "notifications",
      icon: Bell,
      label: "Notifications",
      badge: 3,
      variant: "ghost",
    },
    {
      id: "messages",
      icon: MessageSquare,
      label: "Messages",
      badge: 5,
      variant: "ghost",
    },
    {
      id: "help",
      icon: HelpCircle,
      label: "Help",
      variant: "ghost",
    },
  ] as HeaderAction[],
  userMenu: {
    items: [
      {
        id: "profile",
        icon: UserCircle,
        label: "Profile",
        href: "/profile",
      },
      {
        id: "settings",
        icon: Settings,
        label: "Settings",
        href: "/settings",
      },
      {
        id: "billing",
        icon: CreditCard,
        label: "Billing",
        href: "/billing",
        separator: true,
      },
      {
        id: "logout",
        icon: LogOut,
        label: "Log out",
        onClick: "logout",
        variant: "destructive",
      },
    ] as UserMenuAction[],
  },
};

// Dashboard stats cards configuration
export const statsCardsConfig: StatsCard[] = [
  {
    id: "revenue",
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive",
    icon: DollarSign,
    description: "from last month",
  },
  {
    id: "subscriptions",
    title: "Subscriptions",
    value: "+2,350",
    change: "+180.1%",
    changeType: "positive",
    icon: Users,
    description: "from last month",
  },
  {
    id: "sales",
    title: "Sales",
    value: "+12,234",
    change: "+19%",
    changeType: "positive",
    icon: CreditCard,
    description: "from last month",
  },
  {
    id: "active-now",
    title: "Active Now",
    value: "+573",
    change: "+201",
    changeType: "positive",
    icon: Activity,
    description: "since last hour",
  },
];

// Quick actions configuration
export const quickActionsConfig: QuickAction[] = [
  { id: "new-product", label: "New Product", icon: Package, variant: "default" },
  { id: "new-order", label: "New Order", icon: ShoppingCart, variant: "secondary" },
  { id: "new-customer", label: "Add Customer", icon: Users, variant: "outline" },
  { id: "new-report", label: "Generate Report", icon: FileText, variant: "ghost" },
];

// Sample user data
export const currentUser: DashboardUser = {
  name: "John Doe",
  email: "john@example.com",
  avatar: undefined,
  role: "Administrator",
  status: "online",
};

// Recent activity configuration
export const recentActivityConfig = [
  {
    id: "1",
    type: "order",
    title: "New order #1234",
    description: "Customer placed an order for $299.00",
    time: "2 minutes ago",
    icon: ShoppingCart,
    status: "success",
  },
  {
    id: "2",
    type: "user",
    title: "New customer registered",
    description: "Jane Smith created an account",
    time: "15 minutes ago",
    icon: UserCircle,
    status: "info",
  },
  {
    id: "3",
    type: "payment",
    title: "Payment received",
    description: "Payment of $1,250.00 processed",
    time: "1 hour ago",
    icon: CreditCard,
    status: "success",
  },
  {
    id: "4",
    type: "alert",
    title: "Low stock warning",
    description: "Product SKU-123 is running low",
    time: "2 hours ago",
    icon: AlertTriangle,
    status: "warning",
  },
  {
    id: "5",
    type: "system",
    title: "System update completed",
    description: "All services are running normally",
    time: "3 hours ago",
    icon: CheckCircle,
    status: "success",
  },
];

// Table configuration for dashboard
export const tableColumnsConfig = [
  { id: "name", label: "Name", sortable: true },
  { id: "email", label: "Email", sortable: true },
  { id: "status", label: "Status", sortable: true },
  { id: "role", label: "Role", sortable: false },
  { id: "joined", label: "Joined", sortable: true },
  { id: "actions", label: "", sortable: false },
];

export const tableDataConfig = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", status: "Active", role: "Admin", joined: "2024-01-15" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", status: "Active", role: "User", joined: "2024-02-20" },
  { id: "3", name: "Carol Williams", email: "carol@example.com", status: "Inactive", role: "User", joined: "2024-01-10" },
  { id: "4", name: "David Brown", email: "david@example.com", status: "Pending", role: "Viewer", joined: "2024-03-05" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", status: "Active", role: "Editor", joined: "2024-02-28" },
];

// Notifications dropdown config
export const notificationsConfig = [
  {
    id: "1",
    title: "New message from John",
    description: "Hey, can you review the latest design?",
    time: "2 min ago",
    read: false,
    icon: MessageSquare,
  },
  {
    id: "2",
    title: "Order #1234 shipped",
    description: "Your order has been dispatched",
    time: "1 hour ago",
    read: false,
    icon: Package,
  },
  {
    id: "3",
    title: "Payment received",
    description: "You received $500 from client",
    time: "2 hours ago",
    read: true,
    icon: CreditCard,
  },
];
