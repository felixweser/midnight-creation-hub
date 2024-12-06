import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface PortfolioMetrics {
  totalAUM: number;
  aumChange: number;
  averageIRR: number;
  irrChange: number;
  averageTVPI: number;
  tvpiChange: number;
}

interface ChartDataPoint {
  month: string;
  value: number;
}

export function usePortfolioData() {
  const [funds, setFunds] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<PortfolioMetrics>({
    totalAUM: 0,
    aumChange: 0,
    averageIRR: 0,
    irrChange: 0,
    averageTVPI: 0,
    tvpiChange: 0
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch funds
        const { data: fundsData, error: fundsError } = await supabase
          .from("funds")
          .select("*");
        
        if (fundsError) {
          console.error("Error fetching funds:", fundsError);
          return;
        }

        // Fetch metrics history for calculations
        const { data: metricsData, error: metricsError } = await supabase
          .from("company_metrics_history")
          .select(`
            *,
            portfolio_companies (
              name
            )
          `)
          .order('metric_date', { ascending: true });

        if (metricsError) {
          console.error("Error fetching metrics:", metricsError);
          return;
        }

        if (fundsData) {
          setFunds(fundsData);
        }

        if (metricsData && metricsData.length > 0) {
          // Group metrics by date to calculate totals
          const metricsByDate = metricsData.reduce((acc, metric) => {
            const date = metric.metric_date;
            if (!acc[date]) {
              acc[date] = [];
            }
            acc[date].push(metric);
            return acc;
          }, {} as Record<string, typeof metricsData>);

          // Sort dates to get current and previous period
          const dates = Object.keys(metricsByDate).sort();
          const currentDate = dates[dates.length - 1];
          const previousDate = dates[dates.length - 2] || currentDate;

          // Calculate current period metrics
          const currentMetrics = metricsByDate[currentDate];
          const currentAUM = currentMetrics.reduce((sum, m) => {
            const valuation = m.post_money_valuation || 0;
            const ownershipPercentage = (m.shares_owned || 0) / 100;
            return sum + (valuation * ownershipPercentage);
          }, 0);
          
          // Calculate previous period metrics
          const previousMetrics = metricsByDate[previousDate];
          const previousAUM = previousMetrics.reduce((sum, m) => {
            const valuation = m.post_money_valuation || 0;
            const ownershipPercentage = (m.shares_owned || 0) / 100;
            return sum + (valuation * ownershipPercentage);
          }, 0);

          // Calculate percentage changes
          const aumChange = previousAUM ? ((currentAUM - previousAUM) / previousAUM) * 100 : 0;

          setMetrics({
            totalAUM: currentAUM,
            aumChange,
            averageIRR: 0,
            irrChange: 0,
            averageTVPI: 0,
            tvpiChange: 0
          });

          // Prepare chart data
          const chartData = Object.entries(metricsByDate).map(([date, metrics]) => ({
            month: new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
            value: metrics.reduce((sum, m) => {
              const valuation = m.post_money_valuation || 0;
              const ownershipPercentage = (m.shares_owned || 0) / 100;
              return sum + (valuation * ownershipPercentage);
            }, 0)
          }));

          setChartData(chartData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { funds, metrics, chartData, isLoading };
}