import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioCompany, CompanyMetricsHistory } from "@/integrations/supabase/types/companies";
import { MetricsGrid } from './metrics/MetricsGrid';
import { MetricsChart } from './metrics/MetricsChart';
import { Button } from "@/components/ui/button";
import { useCompanyMetrics } from '@/hooks/useCompanyMetrics';
import { useToast } from "@/components/ui/use-toast";

interface CompanyMetricsProps {
  company: PortfolioCompany;
  isEditing?: boolean;
}

export function CompanyMetrics({ company, isEditing = false }: CompanyMetricsProps) {
  const { toast } = useToast();
  const { metricsHistory, isLoading, updateMetrics, isUpdating } = useCompanyMetrics(company);
  const latestMetrics = metricsHistory?.[metricsHistory.length - 1];
  const [editedMetrics, setEditedMetrics] = useState<Partial<CompanyMetricsHistory>>(
    latestMetrics || {}
  );

  const handleMetricChange = (field: keyof CompanyMetricsHistory, value: string) => {
    console.log('Updating metric:', field, value);
    setEditedMetrics(prev => ({
      ...prev,
      [field]: value === '' ? null : Number(value),
    }));
  };

  const handleSave = async () => {
    try {
      console.log('Saving metrics:', editedMetrics);
      await updateMetrics(editedMetrics);
      toast({
        title: "Success",
        description: "Metrics updated successfully",
      });
    } catch (error) {
      console.error('Error saving metrics:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update metrics",
      });
    }
  };

  if (isLoading) {
    return <Skeleton className="h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <MetricsGrid
        metrics={latestMetrics || {}}
        editedMetrics={editedMetrics}
        isEditing={isEditing}
        onMetricChange={handleMetricChange}
      />
      
      {isEditing && (
        <div className="flex justify-end">
          <Button 
            onClick={handleSave}
            disabled={isUpdating}
          >
            {isUpdating ? "Saving..." : "Save Metrics"}
          </Button>
        </div>
      )}
      
      {metricsHistory && metricsHistory.length > 0 && (
        <MetricsChart metricsHistory={metricsHistory} />
      )}
    </div>
  );
}