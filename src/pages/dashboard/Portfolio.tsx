import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { ArrowUpRight } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MetricsOverview } from "@/components/portfolio/MetricsOverview";

export default function Portfolio() {
  const [funds, setFunds] = useState<any[]>([]);
  const [metrics, setMetrics] = useState({
    totalAUM: 0,
    aumChange: 0,
    averageIRR: 0,
    irrChange: 0,
    averageTVPI: 0,
    tvpiChange: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch funds
        const { data: fundsData, error: fundsError } = await supabase
          .from("funds")
          .select("*");
        
        if (fundsError) {
          console.error("Error fetching funds:", fundsError);
          return;
        }

        // Fetch metrics history for calculations
        const { data: metricsData, error: metricsError } = await supabase
          .from("company_metrics_history")
          .select("*")
          .order('metric_date', { ascending: true });

        if (metricsError) {
          console.error("Error fetching metrics:", metricsError);
          return;
        }

        if (fundsData) {
          setFunds(fundsData);
        }

        if (metricsData && metricsData.length > 0) {
          // Group metrics by date to calculate totals
          const metricsByDate = metricsData.reduce((acc, metric) => {
            const date = metric.metric_date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(metric);
            return acc;
          }, {} as Record<string, typeof metricsData>);

          // Sort dates to get current and previous period
          const dates = Object.keys(metricsByDate).sort();
          const currentDate = dates[dates.length - 1];
          const previousDate = dates[dates.length - 2] || currentDate;

          // Calculate current period metrics
          const currentMetrics = metricsByDate[currentDate];
          const currentAUM = currentMetrics.reduce((sum, m) => sum + (m.post_money_valuation || 0), 0);
          
          // Calculate previous period metrics
          const previousMetrics = metricsByDate[previousDate];
          const previousAUM = previousMetrics.reduce((sum, m) => sum + (m.post_money_valuation || 0), 0);

          // Calculate percentage changes
          const aumChange = previousAUM ? ((currentAUM - previousAUM) / previousAUM) * 100 : 0;

          setMetrics({
            totalAUM: currentAUM,
            aumChange,
            averageIRR: 0, // These would need proper calculation based on investment data
            irrChange: 0,  // These would need proper calculation based on investment data
            averageTVPI: 0, // These would need proper calculation based on investment data
            tvpiChange: 0   // These would need proper calculation based on investment data
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Portfolio Performance</h2>
      </div>

      <MetricsOverview metrics={metrics} />

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Portfolio Value Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
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

      <Card>
        <CardHeader>
          <CardTitle>Active Funds</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund Name</TableHead>
                  <TableHead>Vintage Year</TableHead>
                  <TableHead>Fund Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {funds.map((fund) => (
                  <TableRow key={fund.fund_id}>
                    <TableCell className="font-medium">{fund.name}</TableCell>
                    <TableCell>{fund.vintage_year}</TableCell>
                    <TableCell>${fund.fund_size?.toLocaleString()}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ring-green-600/20 bg-green-50/10 text-green-400">
                        {fund.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <a
                        href={`/dashboard/funds/${fund.fund_id}`}
                        className="inline-flex items-center text-primary hover:text-primary/80"
                      >
                        View Details
                        <ArrowUpRight className="ml-1 h-4 w-4" />
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
