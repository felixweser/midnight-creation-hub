import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PortfolioCompany } from "@/integrations/supabase/types/companies";

interface CompanyOverviewProps {
  company: PortfolioCompany;
  isEditing: boolean;
  onDescriptionChange?: (value: string) => void;
}

export function CompanyOverview({ company, isEditing, onDescriptionChange }: CompanyOverviewProps) {
  return (
    <Card className="hover-card">
      <CardHeader>
        <CardTitle>Company Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={company.metadata?.description || ""}
            onChange={(e) => onDescriptionChange?.(e.target.value)}
            className="min-h-[150px]"
          />
        ) : (
          <p className="text-muted-foreground leading-relaxed">
            {company.metadata?.description || "No description available."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}