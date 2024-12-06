import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CompanyMetricsHistory, PortfolioCompany } from "@/integrations/supabase/types/companies";
import { useToast } from "@/components/ui/use-toast";

export function useCompanyMetrics(company: PortfolioCompany) {
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

  return {
    metricsHistory,
    isLoading,
    updateMetrics: updateMetricsMutation.mutate,
    isUpdating: updateMetricsMutation.isPending
  };
}