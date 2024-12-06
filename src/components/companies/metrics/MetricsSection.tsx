import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from "@/lib/utils";
import { CompanyMetrics } from "@/components/companies/CompanyMetrics";
import type { PortfolioCompany } from "@/integrations/supabase/types/companies";

interface MetricsSectionProps {
  company: PortfolioCompany;
  isEditing: boolean;
}

export function MetricsSection({ company, isEditing }: MetricsSectionProps) {
  // Calculate ownership data based on shares_owned from metrics
  const sharesOwnedPercentage = company.metadata?.metrics?.shares_owned || 0;
  const valuationAmount = company.metadata?.metrics?.post_money_valuation || 0;
  
  const valuationData = [
    { name: 'Owned', value: sharesOwnedPercentage },
    { name: 'Others', value: 100 - sharesOwnedPercentage },
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];
  
  // Calculate the value of owned stake
  const stakeValue = (valuationAmount * sharesOwnedPercentage) / 100;

  return (
    <div className="space-y-6">
      <CompanyMetrics company={company} isEditing={isEditing} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Runway</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{company.metadata?.runway_months || "N/A"} months</div>
            <p className="text-sm text-muted-foreground">Current Runway</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bank Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{formatCurrency(10000000)}</div>
            <p className="text-sm text-muted-foreground">Current Balance</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ownership Structure</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
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
              <div className="text-center mt-4">
                <p className="text-2xl font-bold text-primary">{sharesOwnedPercentage}%</p>
                <p className="text-sm text-muted-foreground">Ownership Stake</p>
                <p className="text-sm font-medium mt-1">{formatCurrency(stakeValue)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}