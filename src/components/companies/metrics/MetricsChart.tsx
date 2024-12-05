import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { CompanyMetricsHistory } from "@/integrations/supabase/types/companies";

interface MetricsChartProps {
  metricsHistory: CompanyMetricsHistory[];
}

export function MetricsChart({ metricsHistory }: MetricsChartProps) {
  return (
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
  );
}