import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CompanyOverview } from "@/components/companies/CompanyOverview";
import { CompanyMetrics } from "@/components/companies/CompanyMetrics";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { CompanyTags } from "@/components/companies/CompanyTags";
import { CompanyValuation } from "@/components/companies/CompanyValuation";
import { CompanyAnalytics } from "@/components/companies/CompanyAnalytics";
import { CompanyRunway } from "@/components/companies/CompanyRunway";
import type { PortfolioCompany } from "@/integrations/supabase/types/companies";

export default function CompanyDashboard() {
  const { companyId } = useParams();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedData, setEditedData] = useState<Partial<PortfolioCompany>>({});

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", companyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("portfolio_companies")
        .select("*")
        .eq("company_id", companyId)
        .single();

      if (error) throw error;
      return data as PortfolioCompany;
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (updateData: Partial<PortfolioCompany>) => {
      const { error } = await supabase
        .from("portfolio_companies")
        .update(updateData)
        .eq("company_id", companyId);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["company", companyId] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Company information updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating company:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update company information",
      });
    },
  });

  const handleEdit = () => {
    if (company) {
      setEditedData({
        name: company.name,
        industry: company.industry,
        founding_date: company.founding_date,
        metadata: { ...company.metadata }
      });
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    updateMutation.mutate(editedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedData({});
  };

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setEditedData(prev => ({
        ...prev,
        [parent]: {
          ...((prev as any)?.[parent] || {}),
          [child]: value
        }
      }));
    } else {
      setEditedData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-12 w-[250px]" />
        <Skeleton className="h-24" />
        <Skeleton className="h-[300px]" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="space-y-8">
      <CompanyHeader
        name={company.name}
        isEditing={isEditing}
        editedName={editedData.name || ""}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
        onNameChange={(value) => handleInputChange("name", value)}
      />

      <CompanyTags
        company={company}
        isEditing={isEditing}
        editedData={editedData}
        onInputChange={handleInputChange}
      />

      <CompanyOverview 
        company={company} 
        isEditing={isEditing}
        onDescriptionChange={(value) => handleInputChange("metadata.description", value)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CompanyValuation company={company} isEditing={isEditing} />
        <CompanyAnalytics company={company} />
      </div>

      <CompanyRunway company={company} isEditing={isEditing} />
    </div>
  );
}