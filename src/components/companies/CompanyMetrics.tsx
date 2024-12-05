import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PortfolioCompany, CompanyMetricsHistory } from "@/integrations/supabase/types/companies";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import React, { useState } from 'react'; // Added React and useState import

interface CompanyMetricsProps {
  company: PortfolioCompany;
  isEditing?: boolean;
}

export function CompanyMetrics({ company, isEditing = false }: CompanyMetricsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  const updateMetricsMutation = useMutation({
    mutationFn: async (newMetrics: Partial<CompanyMetricsHistory>) => {
      const metricsToUpdate = {
        ...newMetrics,
        company_id: company.company_id,
        metric_date: new Date().toISOString().split('T')[0],
      };

      const { error } = await supabase
        .from("company_metrics_history")
        .insert(metricsToUpdate);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company-metrics", company.company_id] });
      toast({
        title: "Success",
        description: "Company metrics updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating metrics:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update company metrics",
      });
    },
  });

  const latestMetrics = metricsHistory?.[metricsHistory.length - 1];
  const [editedMetrics, setEditedMetrics] = useState<Partial<CompanyMetricsHistory>>(
    latestMetrics || {}
  );

  const handleMetricChange = (field: keyof CompanyMetricsHistory, value: string) => {
    setEditedMetrics(prev => ({
      ...prev,
      [field]: value === '' ? null : Number(value),
    }));
  };

  const handleSave = () => {
    updateMetricsMutation.mutate(editedMetrics);
  };

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
              {isEditing ? (
                <Input
                  type="number"
                  value={editedMetrics.post_money_valuation || ''}
                  onChange={(e) => handleMetricChange('post_money_valuation', e.target.value)}
                  placeholder="Enter valuation"
                />
              ) : (
                latestMetrics?.post_money_valuation
                  ? formatCurrency(latestMetrics.post_money_valuation)
                  : "N/A"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Shares Owned</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={editedMetrics.shares_owned || ''}
                  onChange={(e) => handleMetricChange('shares_owned', e.target.value)}
                  placeholder="Enter shares owned %"
                />
              ) : (
                latestMetrics?.shares_owned
                  ? `${latestMetrics.shares_owned.toLocaleString()}%`
                  : "N/A"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">ARR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={editedMetrics.arr || ''}
                  onChange={(e) => handleMetricChange('arr', e.target.value)}
                  placeholder="Enter ARR"
                />
              ) : (
                latestMetrics?.arr ? formatCurrency(latestMetrics.arr) : "N/A"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">MRR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={editedMetrics.mrr || ''}
                  onChange={(e) => handleMetricChange('mrr', e.target.value)}
                  placeholder="Enter MRR"
                />
              ) : (
                latestMetrics?.mrr ? formatCurrency(latestMetrics.mrr) : "N/A"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Burn Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={editedMetrics.burn_rate || ''}
                  onChange={(e) => handleMetricChange('burn_rate', e.target.value)}
                  placeholder="Enter burn rate"
                />
              ) : (
                latestMetrics?.burn_rate
                  ? formatCurrency(latestMetrics.burn_rate)
                  : "N/A"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Runway</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={editedMetrics.runway_months || ''}
                  onChange={(e) => handleMetricChange('runway_months', e.target.value)}
                  placeholder="Enter runway months"
                />
              ) : (
                latestMetrics?.runway_months
                  ? `${latestMetrics.runway_months} months`
                  : "N/A"
              )}
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