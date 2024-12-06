import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { CompanyOverview } from "@/components/companies/CompanyOverview";
import { CompanyMetrics } from "@/components/companies/CompanyMetrics";
import { CompanyHeader } from "@/components/companies/CompanyHeader";
import { CompanyStats } from "@/components/companies/CompanyStats";
import { Container } from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from "@/lib/utils";
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

  // Sample data for the valuation donut chart
  const valuationData = [
    { name: 'Owned', value: 25 }, // Replace with actual shares_owned percentage
    { name: 'Others', value: 75 }, // Remaining percentage
  ];

  const COLORS = ['hsl(var(--primary))', 'hsl(var(--muted))'];

  return (
    <Container className="space-y-8 py-8">
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

        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{company.industry || "No Industry"}</Badge>
          <Badge variant="outline">Founded: {company.founding_date ? new Date(company.founding_date).getFullYear() : "N/A"}</Badge>
          <Badge variant="outline">Team Size: {company.metadata?.team_size || "N/A"}</Badge>
          <Badge variant="outline">Performance: {company.metadata?.performance || "N/A"}</Badge>
        </div>

        <CompanyOverview 
          company={company} 
          isEditing={isEditing}
          onDescriptionChange={(value) => handleInputChange("metadata.description", value)}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Ownership Structure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={valuationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {valuationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                  <p className="text-2xl font-bold text-primary">25%</p>
                  <p className="text-sm text-muted-foreground">Ownership Stake</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <CompanyMetrics company={company} isEditing={isEditing} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Runway</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{company.metadata?.runway_months || "N/A"} months</div>
              <p className="text-sm text-muted-foreground">Current Runway</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Bank Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{formatCurrency(10000000)}</div>
              <p className="text-sm text-muted-foreground">Current Balance</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}