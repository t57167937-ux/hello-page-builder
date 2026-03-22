import { useState } from "react";
import { LayoutDashboard, BarChart3, Grid3X3, List, TrendingUp, TrendingDown, DollarSign, Users, ShoppingCart, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import StatsCards from "./StatsCards";
import RecentActivity from "./RecentActivity";
import DataTable from "./DataTable";
import QuickActions from "./QuickActions";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

// Analytics Dashboard Variant
function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <StatsCards />
      
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart Placeholder */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue for the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, i) => {
                const value = [65, 78, 54, 89, 72, 95][i];
                return (
                  <div key={month} className="flex items-center gap-4">
                    <span className="w-12 text-sm text-muted-foreground">{month}</span>
                    <Progress value={value} className="flex-1" />
                    <span className="w-12 text-sm font-medium text-right">${value}k</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Traffic Sources */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "Organic Search", value: 45, color: "bg-primary" },
                { source: "Direct", value: 25, color: "bg-blue-500" },
                { source: "Social Media", value: 18, color: "bg-purple-500" },
                { source: "Referral", value: 12, color: "bg-orange-500" },
              ].map((item) => (
                <div key={item.source} className="flex items-center gap-4">
                  <div className={cn("w-3 h-3 rounded-full", item.color)} />
                  <span className="flex-1 text-sm">{item.source}</span>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <QuickActions />
        <RecentActivity />
        
        {/* Top Products */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best performing items this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: "Pro Plan", sales: 234, revenue: "$12,450" },
                { name: "Basic Plan", sales: 189, revenue: "$5,670" },
                { name: "Enterprise", sales: 45, revenue: "$45,000" },
                { name: "Add-ons", sales: 567, revenue: "$2,835" },
              ].map((product, i) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="w-6 h-6 p-0 justify-center">
                      {i + 1}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-primary">{product.revenue}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Project Dashboard Variant
function ProjectDashboard() {
  const projects = [
    { name: "Website Redesign", progress: 75, status: "In Progress", team: 4, dueDate: "Mar 15" },
    { name: "Mobile App v2.0", progress: 45, status: "In Progress", team: 6, dueDate: "Apr 01" },
    { name: "API Integration", progress: 90, status: "Review", team: 3, dueDate: "Feb 28" },
    { name: "Database Migration", progress: 30, status: "Planning", team: 2, dueDate: "Mar 30" },
  ];

  const teamMembers = [
    { name: "Alice Johnson", role: "Lead Developer", tasks: 12, status: "online" },
    { name: "Bob Smith", role: "Designer", tasks: 8, status: "online" },
    { name: "Carol Williams", role: "Backend Dev", tasks: 15, status: "offline" },
    { name: "David Brown", role: "QA Engineer", tasks: 6, status: "away" },
  ];

  return (
    <div className="space-y-6">
      {/* Project Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Activity className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Active Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Users className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">24</p>
                <p className="text-xs text-muted-foreground">Team Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <ShoppingCart className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Projects */}
        <Card className="lg:col-span-2 border-border">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Projects</CardTitle>
              <Button variant="outline" size="sm">View All</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.name} className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-muted-foreground">Due: {project.dueDate}</p>
                    </div>
                    <Badge variant={
                      project.status === "In Progress" ? "default" :
                      project.status === "Review" ? "secondary" : "outline"
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={project.progress} className="flex-1" />
                    <span className="text-sm font-medium w-12">{project.progress}%</span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users size={14} />
                      {project.team}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Team Members */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background",
                      member.status === "online" ? "bg-green-500" :
                      member.status === "away" ? "bg-yellow-500" : "bg-gray-400"
                    )} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <Badge variant="secondary" className="shrink-0">
                    {member.tasks} tasks
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Minimal Dashboard Variant
function MinimalDashboard() {
  const metrics = [
    { label: "Total Revenue", value: "$124,500", change: "+12.5%", trend: "up" },
    { label: "Active Users", value: "8,234", change: "+8.2%", trend: "up" },
    { label: "Conversion Rate", value: "3.24%", change: "-0.4%", trend: "down" },
    { label: "Avg. Order Value", value: "$89.50", change: "+5.1%", trend: "up" },
  ];

  const recentOrders = [
    { id: "#12345", customer: "John Doe", amount: "$299.00", status: "Completed", date: "2 min ago" },
    { id: "#12344", customer: "Jane Smith", amount: "$149.00", status: "Processing", date: "15 min ago" },
    { id: "#12343", customer: "Bob Johnson", amount: "$599.00", status: "Completed", date: "1 hour ago" },
    { id: "#12342", customer: "Alice Brown", amount: "$79.00", status: "Shipped", date: "2 hours ago" },
    { id: "#12341", customer: "Charlie Wilson", amount: "$449.00", status: "Completed", date: "3 hours ago" },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.label} className="border-border">
            <CardContent className="p-6">
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold">{metric.value}</span>
                <span className={cn(
                  "text-sm font-medium",
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                )}>
                  {metric.change}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card className="border-border">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Orders</CardTitle>
            <Button variant="ghost" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-muted-foreground">{order.id}</span>
                  <span className="font-medium">{order.customer}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-muted-foreground">{order.date}</span>
                  <Badge variant={
                    order.status === "Completed" ? "default" :
                    order.status === "Processing" ? "secondary" : "outline"
                  }>
                    {order.status}
                  </Badge>
                  <span className="font-semibold w-20 text-right">{order.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Main Layout Component
export function DashboardLayout() {
  const [dashboardVariant, setDashboardVariant] = useState<"default" | "analytics" | "project" | "minimal">("default");

  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-6">
      {/* Breadcrumb */}
      <PageBreadcrumb items={[{ label: "Dashboard" }]} />

      {/* Page Title with Variant Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Welcome back! Here's what's happening with your business.
          </p>
        </div>
        
        <Tabs value={dashboardVariant} onValueChange={(v) => setDashboardVariant(v as any)}>
          <ScrollArea className="w-full">
            <TabsList>
              <TabsTrigger value="default" className="gap-1.5">
                <Grid3X3 size={14} />
                <span className="hidden sm:inline">Default</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-1.5">
                <BarChart3 size={14} />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="project" className="gap-1.5">
                <LayoutDashboard size={14} />
                <span className="hidden sm:inline">Project</span>
              </TabsTrigger>
              <TabsTrigger value="minimal" className="gap-1.5">
                <List size={14} />
                <span className="hidden sm:inline">Minimal</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>
        </Tabs>
      </div>

      {/* Dashboard Content */}
      {dashboardVariant === "default" && (
        <>
          <StatsCards />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 min-w-0">
              <DataTable />
            </div>
            <div className="space-y-6 min-w-0">
              <QuickActions />
              <RecentActivity />
            </div>
          </div>
        </>
      )}
      {dashboardVariant === "analytics" && <AnalyticsDashboard />}
      {dashboardVariant === "project" && <ProjectDashboard />}
      {dashboardVariant === "minimal" && <MinimalDashboard />}
    </div>
  );
}

export default DashboardLayout;
