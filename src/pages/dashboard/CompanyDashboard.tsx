import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Users, Building2, Activity, Edit2, Check, X } from "lucide-react";
import type { PortfolioCompany } from "@/integrations/supabase/types/companies";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

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
    setEditedData(company || {});
    setIsEditing(true);
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
          ...prev[parent as keyof PortfolioCompany],
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!company) {
    return <div>Company not found</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {isEditing ? (
            <Input
              value={editedData.name || ""}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="text-3xl font-bold h-12"
            />
          ) : (
            company.name
          )}
        </h1>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} variant="default" size="sm">
                <Check className="h-4 w-4 mr-1" /> Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="h-4 w-4 mr-1" /> Cancel
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit} variant="outline" size="sm">
              <Edit2 className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Founded</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  type="date"
                  value={editedData.founding_date || ""}
                  onChange={(e) => handleInputChange("founding_date", e.target.value)}
                />
              ) : (
                company.founding_date
                  ? new Date(company.founding_date).getFullYear()
                  : "N/A"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Industry</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  value={editedData.industry || ""}
                  onChange={(e) => handleInputChange("industry", e.target.value)}
                />
              ) : (
                company.industry || "N/A"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  type="number"
                  value={editedData.metadata?.team_size || ""}
                  onChange={(e) => handleInputChange("metadata.team_size", parseInt(e.target.value))}
                />
              ) : (
                company.metadata?.team_size || "N/A"
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Performance</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isEditing ? (
                <Input
                  value={editedData.metadata?.performance || ""}
                  onChange={(e) => handleInputChange("metadata.performance", e.target.value)}
                />
              ) : (
                company.metadata?.performance || "N/A"
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Company Overview</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={editedData.metadata?.description || ""}
                onChange={(e) => handleInputChange("metadata.description", e.target.value)}
                className="min-h-[150px]"
              />
            ) : (
              <p className="text-muted-foreground">
                {company.metadata?.description || "No description available."}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(company.metadata?.metrics || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{key}</span>
                  <span className="text-sm text-muted-foreground">{value}</span>
                </div>
              ))}
              {(!company.metadata?.metrics || Object.keys(company.metadata?.metrics).length === 0) && (
                <p className="text-muted-foreground">No metrics available.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}