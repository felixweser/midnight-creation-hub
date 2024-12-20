import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface ChartDataPoint {
  month: string;
  value: number;
}

interface PortfolioChartProps {
  data: ChartDataPoint[];
}

export function PortfolioChart({ data }: PortfolioChartProps) {
  return (
    <Card className="mt-8">
      <CardHeader className="pb-4">
        <CardTitle>Portfolio Value Over Time</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[350px] px-4 pb-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis width={80} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}