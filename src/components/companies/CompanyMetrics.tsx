import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { PortfolioCompany, CompanyMetricsHistory } from "@/integrations/supabase/types/companies";
import { MetricsGrid } from './metrics/MetricsGrid';
import { MetricsChart } from './metrics/MetricsChart';
import { Button } from "@/components/ui/button";
import { useCompanyMetrics } from '@/hooks/useCompanyMetrics';

interface CompanyMetricsProps {
  company: PortfolioCompany;
  isEditing?: boolean;
}

export function CompanyMetrics({ company, isEditing = false }: CompanyMetricsProps) {
  const { metricsHistory, isLoading, updateMetrics, isUpdating } = useCompanyMetrics(company);
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
    updateMetrics(editedMetrics);
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