import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyMetricsHistory, PortfolioCompany } from "@/integrations/supabase/types/companies";
import { useToast } from "@/components/ui/use-toast";

export function useCompanyMetrics(company: PortfolioCompany) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: metricsHistory, isLoading: metricsLoading, refetch } = useQuery({
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

  // Add query for latest investment valuation
  const { data: latestInvestment, isLoading: investmentLoading } = useQuery({
    queryKey: ["company-investment", company.company_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("investments")
        .select("*")
        .eq("company_id", company.company_id)
        .order("investment_date", { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 is the "no rows returned" error
      return data;
    },
  });

  const updateMetricsMutation = useMutation({
    mutationFn: async (newMetrics: Partial<CompanyMetricsHistory>) => {
      const { id, ...metricsToUpdate } = newMetrics;
      
      const metricsData = {
        ...metricsToUpdate,
        company_id: company.company_id,
        metric_date: new Date().toISOString().split('T')[0],
        // Use the latest investment valuation if available
        post_money_valuation: metricsToUpdate.post_money_valuation || latestInvestment?.valuation,
      };

      console.log('Inserting metrics:', metricsData);
      
      const { error } = await supabase
        .from("company_metrics_history")
        .insert(metricsData);

      if (error) {
        console.error('Error inserting metrics:', error);
        throw error;
      }
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

  return {
    metricsHistory,
    latestInvestment,
    isLoading: metricsLoading || investmentLoading,
    updateMetrics: updateMetricsMutation.mutate,
    isUpdating: updateMetricsMutation.isPending,
    refetch
  };
}