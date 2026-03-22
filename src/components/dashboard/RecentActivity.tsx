import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { recentActivityConfig } from "@/data/dashboardConfig";

interface RecentActivityProps {
  className?: string;
}

export function RecentActivity({ className }: RecentActivityProps) {
  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
          <Badge variant="secondary" className="text-[10px]">
            {recentActivityConfig.length} new
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-6 pb-4">
          <div className="space-y-4">
            {recentActivityConfig.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div
                  key={activity.id}
                  className="flex gap-3 relative"
                >
                  {/* Timeline line */}
                  {index < recentActivityConfig.length - 1 && (
                    <div className="absolute left-[17px] top-10 w-px h-[calc(100%+4px)] bg-border" />
                  )}
                  
                  {/* Icon */}
                  <div
                    className={cn(
                      "p-2 rounded-full shrink-0 relative z-10",
                      activity.status === "success" && "bg-green-100 dark:bg-green-900/30",
                      activity.status === "warning" && "bg-yellow-100 dark:bg-yellow-900/30",
                      activity.status === "info" && "bg-blue-100 dark:bg-blue-900/30",
                      !activity.status && "bg-muted"
                    )}
                  >
                    <Icon
                      size={14}
                      className={cn(
                        activity.status === "success" && "text-green-600 dark:text-green-400",
                        activity.status === "warning" && "text-yellow-600 dark:text-yellow-400",
                        activity.status === "info" && "text-blue-600 dark:text-blue-400",
                        !activity.status && "text-muted-foreground"
                      )}
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default RecentActivity;
