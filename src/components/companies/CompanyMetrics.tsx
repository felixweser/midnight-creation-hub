import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioCompany, CompanyMetricsHistory } from "@/integrations/supabase/types/companies";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";

export function CompanyMetrics({ company }: { company: PortfolioCompany }) {
  const { data: metricsHistory, isLoading } = useQuery({
    queryKey: ["company-metrics", company.company_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_metrics_history")
        .select("*")
        .eq("company_id", company.company_id)
        .order("metric_date", { ascending: true });

      if (error) throw error;
      return data as CompanyMetricsHistory[];
    },
  });

  const latestMetrics = metricsHistory?.[metricsHistory.length - 1];

  if (isLoading) {
    return <Skeleton className="h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Valuation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics?.post_money_valuation
                ? formatCurrency(latestMetrics.post_money_valuation)
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Shares Owned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics?.shares_owned
                ? `${latestMetrics.shares_owned.toLocaleString()}%`
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">ARR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics?.arr ? formatCurrency(latestMetrics.arr) : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics?.mrr ? formatCurrency(latestMetrics.mrr) : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics?.burn_rate
                ? formatCurrency(latestMetrics.burn_rate)
                : "N/A"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Runway</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestMetrics?.runway_months
                ? `${latestMetrics.runway_months} months`
                : "N/A"}
            </div>
          </CardContent>
        </Card>
      </div>

      {metricsHistory && metricsHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Metrics Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metricsHistory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="metric_date"
                    tickFormatter={(date) =>
                      new Date(date).toLocaleDateString()
                    }
                  />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="arr"
                    name="ARR"
                    stroke="#8884d8"
                  />
                  <Line
                    type="monotone"
                    dataKey="mrr"
                    name="MRR"
                    stroke="#82ca9d"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}