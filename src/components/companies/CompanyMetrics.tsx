import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { PortfolioCompany, CompanyMetricsHistory } from "@/integrations/supabase/types/companies";
import { MetricsGrid } from './metrics/MetricsGrid';
import { MetricsChart } from './metrics/MetricsChart';

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
      <MetricsGrid
        metrics={isEditing ? editedMetrics : (latestMetrics || {})}
        isEditing={isEditing}
        onMetricChange={handleMetricChange}
      />
      
      {metricsHistory && metricsHistory.length > 0 && (
        <MetricsChart metricsHistory={metricsHistory} />
      )}
    </div>
  );
}