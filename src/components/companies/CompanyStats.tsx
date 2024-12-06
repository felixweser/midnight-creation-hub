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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card className="hover-card">
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
                onChange={(e) => onInputChange("founding_date", e.target.value)}
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Industry</CardTitle>
          <Building2 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isEditing ? (
              <Input
                value={editedData.industry || ""}
                onChange={(e) => onInputChange("industry", e.target.value)}
              />
            ) : (
              company.industry || "N/A"
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
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
                onChange={(e) =>
                  onInputChange("metadata.team_size", parseInt(e.target.value))
                }
              />
            ) : (
              company.metadata?.team_size || "N/A"
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Performance</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isEditing ? (
              <Input
                value={editedData.metadata?.performance || ""}
                onChange={(e) =>
                  onInputChange("metadata.performance", e.target.value)
                }
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