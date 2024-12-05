import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: number;
  percentageChange: number;
  isCurrency?: boolean;
  suffix?: string;
}

export function MetricCard({ 
  title, 
  value, 
  percentageChange, 
  isCurrency = false,
  suffix = ''
}: MetricCardProps) {
  const isPositive = percentageChange >= 0;
  const Icon = isPositive ? TrendingUp : TrendingDown;
  
  const formattedValue = isCurrency 
    ? formatCurrency(value)
    : `${value}${suffix}`;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-2xl font-semibold">{formattedValue}</p>
          <div className={`flex items-center ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            <Icon className="h-4 w-4 mr-1" />
            <span>{percentageChange > 0 ? '+' : ''}{percentageChange.toFixed(1)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}