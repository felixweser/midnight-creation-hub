import { usePortfolioData } from "@/hooks/usePortfolioData";
import { MetricsOverview } from "@/components/portfolio/MetricsOverview";
import { PortfolioChart } from "@/components/portfolio/PortfolioChart";
import { FundsTable } from "@/components/portfolio/FundsTable";

export default function Portfolio() {
  const { funds, metrics, chartData, isLoading } = usePortfolioData();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Portfolio Performance</h2>
      </div>

      <MetricsOverview metrics={metrics} />
      <PortfolioChart data={chartData} />
      <FundsTable funds={funds} isLoading={isLoading} />
    </div>
  );
}