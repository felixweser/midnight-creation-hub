import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { CalendarDays, Users, Building2, Activity } from "lucide-react";
import { PortfolioCompany } from "@/integrations/supabase/types/companies";

interface CompanyTagsProps {
  company: PortfolioCompany;
  isEditing: boolean;
  editedData: Partial<PortfolioCompany>;
  onInputChange: (field: string, value: any) => void;
}

export function CompanyTags({
  company,
  isEditing,
  editedData,
  onInputChange,
}: CompanyTagsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {isEditing ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Founded</label>
            <Input
              type="date"
              value={editedData.founding_date || ""}
              onChange={(e) => onInputChange("founding_date", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Industry</label>
            <Input
              value={editedData.industry || ""}
              onChange={(e) => onInputChange("industry", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Team Size</label>
            <Input
              type="number"
              value={editedData.metadata?.team_size || ""}
              onChange={(e) =>
                onInputChange("metadata.team_size", parseInt(e.target.value))
              }
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Performance</label>
            <Input
              value={editedData.metadata?.performance || ""}
              onChange={(e) =>
                onInputChange("metadata.performance", e.target.value)
              }
            />
          </div>
        </div>
      ) : (
        <>
          {company.founding_date && (
            <Badge variant="secondary" className="h-8">
              <CalendarDays className="w-4 h-4 mr-2" />
              Founded {new Date(company.founding_date).getFullYear()}
            </Badge>
          )}
          {company.industry && (
            <Badge variant="secondary" className="h-8">
              <Building2 className="w-4 h-4 mr-2" />
              {company.industry}
            </Badge>
          )}
          {company.metadata?.team_size && (
            <Badge variant="secondary" className="h-8">
              <Users className="w-4 h-4 mr-2" />
              {company.metadata.team_size} employees
            </Badge>
          )}
          {company.metadata?.performance && (
            <Badge variant="secondary" className="h-8">
              <Activity className="w-4 h-4 mr-2" />
              {company.metadata.performance}
            </Badge>
          )}
        </>
      )}
    </div>
  );
}