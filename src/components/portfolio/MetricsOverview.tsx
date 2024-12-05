import { MetricCard } from "./MetricCard";

interface MetricsOverviewProps {
  metrics: {
    totalAUM: number;
    aumChange: number;
    averageIRR: number;
    irrChange: number;
    averageTVPI: number;
    tvpiChange: number;
  };
}

export function MetricsOverview({ metrics }: MetricsOverviewProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <MetricCard
        title="Total AUM"
        value={metrics.totalAUM}
        percentageChange={metrics.aumChange}
        isCurrency={true}
      />
      <MetricCard
        title="IRR"
        value={metrics.averageIRR}
        percentageChange={metrics.irrChange}
        suffix="%"
      />
      <MetricCard
        title="TVPI"
        value={metrics.averageTVPI}
        percentageChange={metrics.tvpiChange}
        suffix="x"
      />
    </div>
  );
}