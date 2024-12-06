import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { PortfolioCompany } from "@/integrations/supabase/types/companies";
import { useCompanyMetrics } from "@/hooks/useCompanyMetrics";
import { formatCurrency } from "@/lib/utils";

interface CompanyValuationProps {
  company: PortfolioCompany;
  isEditing?: boolean;
}

export function CompanyValuation({ company, isEditing = false }: CompanyValuationProps) {
  const { metricsHistory } = useCompanyMetrics(company);
  const latestMetrics = metricsHistory?.[metricsHistory.length - 1];

  const sharesOwned = latestMetrics?.shares_owned || 0;
  const valuation = latestMetrics?.post_money_valuation || 0;
  
  const data = [
    { name: 'VC Ownership', value: sharesOwned },
    { name: 'Other Shareholders', value: 100 - sharesOwned }
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Company Valuation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-3xl font-bold">
            {formatCurrency(valuation)}
          </div>
          <div className="text-sm text-muted-foreground">
            Post-money Valuation
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}