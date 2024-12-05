import React from 'react';
import { MetricCard } from './MetricCard';
import { CompanyMetricsHistory } from "@/integrations/supabase/types/companies";

interface MetricsGridProps {
  metrics: Partial<CompanyMetricsHistory>;
  isEditing: boolean;
  onMetricChange: (field: keyof CompanyMetricsHistory, value: string) => void;
}

export function MetricsGrid({ metrics, isEditing, onMetricChange }: MetricsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <MetricCard
        title="Valuation"
        value={metrics.post_money_valuation || null}
        isEditing={isEditing}
        isCurrency={true}
        onChange={(value) => onMetricChange('post_money_valuation', value)}
      />
      <MetricCard
        title="Shares Owned"
        value={metrics.shares_owned || null}
        isEditing={isEditing}
        isPercentage={true}
        onChange={(value) => onMetricChange('shares_owned', value)}
      />
      <MetricCard
        title="ARR"
        value={metrics.arr || null}
        isEditing={isEditing}
        isCurrency={true}
        onChange={(value) => onMetricChange('arr', value)}
      />
      <MetricCard
        title="MRR"
        value={metrics.mrr || null}
        isEditing={isEditing}
        isCurrency={true}
        onChange={(value) => onMetricChange('mrr', value)}
      />
      <MetricCard
        title="Burn Rate"
        value={metrics.burn_rate || null}
        isEditing={isEditing}
        isCurrency={true}
        onChange={(value) => onMetricChange('burn_rate', value)}
      />
      <MetricCard
        title="Runway"
        value={metrics.runway_months || null}
        isEditing={isEditing}
        suffix=" months"
        onChange={(value) => onMetricChange('runway_months', value)}
      />
    </div>
  );
}