import { TrendingUp, TrendingDown, Minus, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { statsCardsConfig, StatsCard } from "@/data/dashboardConfig";

interface StatsCardsProps {
  cards?: StatsCard[];
  className?: string;
}

export function StatsCards({ cards = statsCardsConfig, className }: StatsCardsProps) {
  return (
    <div className={cn("grid gap-4 sm:grid-cols-2 lg:grid-cols-4", className)}>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-muted">
                <Icon size={16} className="text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              {card.change && (
                <div className="flex items-center gap-1 mt-1">
                  <ChangeIndicator type={card.changeType} />
                  <span
                    className={cn(
                      "text-xs font-medium",
                      card.changeType === "positive" && "text-green-600 dark:text-green-400",
                      card.changeType === "negative" && "text-red-600 dark:text-red-400",
                      card.changeType === "neutral" && "text-muted-foreground"
                    )}
                  >
                    {card.change}
                  </span>
                  {card.description && (
                    <span className="text-xs text-muted-foreground">
                      {card.description}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

function ChangeIndicator({ type }: { type?: "positive" | "negative" | "neutral" }) {
  switch (type) {
    case "positive":
      return <TrendingUp size={14} className="text-green-600 dark:text-green-400" />;
    case "negative":
      return <TrendingDown size={14} className="text-red-600 dark:text-red-400" />;
    default:
      return <Minus size={14} className="text-muted-foreground" />;
  }
}

export default StatsCards;
