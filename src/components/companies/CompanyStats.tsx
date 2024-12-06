import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, Users, Building2, Activity } from "lucide-react";
import { PortfolioCompany } from "@/integrations/supabase/types/companies";

interface CompanyStatsProps {
  company: PortfolioCompany;
  isEditing: boolean;
  editedData: Partial<PortfolioCompany>;
  onInputChange: (field: string, value: any) => void;
}

export function CompanyStats({
  company,
  isEditing,
  editedData,
  onInputChange,
}: CompanyStatsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <Card className="hover-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-xs font-medium text-muted-foreground">Founded</CardTitle>
          <CalendarDays className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="text-sm font-semibold">
            {isEditing ? (
              <Input
                type="date"
                value={editedData.founding_date || ""}
                onChange={(e) => onInputChange("founding_date", e.target.value)}
                className="h-7 text-sm"
              />
            ) : (
              company.founding_date
                ? new Date(company.founding_date).getFullYear()
                : "N/A"
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-xs font-medium text-muted-foreground">Industry</CardTitle>
          <Building2 className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="text-sm font-semibold">
            {isEditing ? (
              <Input
                value={editedData.industry || ""}
                onChange={(e) => onInputChange("industry", e.target.value)}
                className="h-7 text-sm"
              />
            ) : (
              company.industry || "N/A"
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-xs font-medium text-muted-foreground">Team Size</CardTitle>
          <Users className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="text-sm font-semibold">
            {isEditing ? (
              <Input
                type="number"
                value={editedData.metadata?.team_size || ""}
                onChange={(e) =>
                  onInputChange("metadata.team_size", parseInt(e.target.value))
                }
                className="h-7 text-sm"
              />
            ) : (
              company.metadata?.team_size || "N/A"
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-xs font-medium text-muted-foreground">Performance</CardTitle>
          <Activity className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="text-sm font-semibold">
            {isEditing ? (
              <Input
                value={editedData.metadata?.performance || ""}
                onChange={(e) =>
                  onInputChange("metadata.performance", e.target.value)
                }
                className="h-7 text-sm"
              />
            ) : (
              company.metadata?.performance || "N/A"
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}