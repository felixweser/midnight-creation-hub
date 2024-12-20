import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from "@/lib/utils";
import { CompanyMetrics } from "@/components/companies/CompanyMetrics";
import type { PortfolioCompany } from "@/integrations/supabase/types/companies";
import { useCompanyMetrics } from '@/hooks/useCompanyMetrics';

interface MetricsSectionProps {
  company: PortfolioCompany;
  isEditing: boolean;
}

export function MetricsSection({ company, isEditing }: MetricsSectionProps) {
  const { metricsHistory, isLoading, refetch } = useCompanyMetrics(company);
  const latestMetrics = metricsHistory?.[metricsHistory.length - 1];
  
  const sharesOwnedPercentage = latestMetrics?.shares_owned || 0;
  const valuationAmount = latestMetrics?.post_money_valuation || 0;
  
  const valuationData = [
    { name: 'Owned', value: sharesOwnedPercentage },
    { name: 'Others', value: 100 - sharesOwnedPercentage },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];
  
  const stakeValue = (valuationAmount * sharesOwnedPercentage) / 100;

  // Add effect to refetch data when component mounts
  React.useEffect(() => {
    refetch();
  }, [refetch]);

  if (isLoading) {
    return <div>Loading metrics...</div>;
  }

  return (
    <div className="space-y-6">
      <CompanyMetrics company={company} isEditing={isEditing} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Runway</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{latestMetrics?.runway_months || "N/A"} months</div>
            <p className="text-sm text-muted-foreground">Current Runway</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(latestMetrics?.burn_rate || 0)}</div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ownership Structure</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-col items-center">
              <div className="h-[180px] w-full flex items-center justify-center mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={valuationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {valuationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center space-y-1.5">
                <p className="text-2xl font-bold text-primary">{sharesOwnedPercentage}%</p>
                <p className="text-sm text-muted-foreground">Ownership Stake</p>
                <p className="text-sm font-medium">{formatCurrency(stakeValue)}</p>
                <p className="text-xs text-muted-foreground">of {formatCurrency(valuationAmount)} valuation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}