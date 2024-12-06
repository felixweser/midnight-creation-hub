import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PortfolioCompany } from "@/integrations/supabase/types/companies";
import { useCompanyMetrics } from "@/hooks/useCompanyMetrics";
import { formatCurrency } from "@/lib/utils";

interface CompanyAnalyticsProps {
  company: PortfolioCompany;
}

export function CompanyAnalytics({ company }: CompanyAnalyticsProps) {
  const { metricsHistory } = useCompanyMetrics(company);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metricsHistory}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="metric_date"
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="arr"
                name="ARR"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="mrr"
                name="MRR"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="burn_rate"
                name="Burn Rate"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}