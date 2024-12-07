import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CompanyOverview } from "@/components/companies/CompanyOverview";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { CompanyStats } from "@/components/companies/CompanyStats";
import { Container } from "@/components/Container";
import { MetricsSection } from "@/components/companies/metrics/MetricsSection";
import type { PortfolioCompany } from "@/integrations/supabase/types/companies";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";

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
      <Container className="space-y-8 py-8">
        <Skeleton className="h-12 w-[250px]" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </Container>
    );
  }

  if (!company) {
    return <Container>Company not found</Container>;
  }

  return (
    <Container className="space-y-8 py-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link to="/dashboard/companies">Companies</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{company.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <CompanyHeader
          name={company.name}
          isEditing={isEditing}
          editedName={editedData.name || ""}
          onEdit={handleEdit}
          onSave={handleSave}
          onCancel={handleCancel}
          onNameChange={(value) => handleInputChange("name", value)}
        />

        <CompanyStats
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

        <MetricsSection company={company} isEditing={isEditing} />
      </div>
    </Container>
  );
}