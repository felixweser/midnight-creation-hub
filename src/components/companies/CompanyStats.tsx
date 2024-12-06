import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CalendarDays, Users, Building2, Activity, MapPin, TrendingUp, Calendar, PiggyBank } from "lucide-react";
import { PortfolioCompany } from "@/integrations/supabase/types/companies";
import { formatCurrency } from "@/lib/utils";

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
          <CardTitle className="text-xs font-medium text-muted-foreground">Location</CardTitle>
          <MapPin className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="text-sm font-semibold">
            {isEditing ? (
              <Input
                value={editedData.hq_location || ""}
                onChange={(e) => onInputChange("hq_location", e.target.value)}
                className="h-7 text-sm"
              />
            ) : (
              company.hq_location || "N/A"
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-xs font-medium text-muted-foreground">Stage</CardTitle>
          <TrendingUp className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="text-sm font-semibold">
            {isEditing ? (
              <Input
                value={editedData.investment_stage || ""}
                onChange={(e) => onInputChange("investment_stage", e.target.value)}
                className="h-7 text-sm"
              />
            ) : (
              company.investment_stage || "N/A"
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="hover-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1 px-3 pt-3">
          <CardTitle className="text-xs font-medium text-muted-foreground">Total Raised</CardTitle>
          <PiggyBank className="h-3 w-3 text-muted-foreground" />
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-0">
          <div className="text-sm font-semibold">
            {isEditing ? (
              <Input
                type="number"
                value={editedData.total_raised || ""}
                onChange={(e) => onInputChange("total_raised", parseFloat(e.target.value))}
                className="h-7 text-sm"
              />
            ) : (
              formatCurrency(company.total_raised || 0)
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}