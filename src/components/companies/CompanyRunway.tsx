import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PortfolioCompany } from "@/integrations/supabase/types/companies";
import { useCompanyMetrics } from "@/hooks/useCompanyMetrics";
import { formatCurrency } from "@/lib/utils";

interface CompanyRunwayProps {
  company: PortfolioCompany;
  isEditing?: boolean;
}

export function CompanyRunway({ company, isEditing = false }: CompanyRunwayProps) {
  const { metricsHistory } = useCompanyMetrics(company);
  const latestMetrics = metricsHistory?.[metricsHistory.length - 1];

  const runwayMonths = latestMetrics?.runway_months || 0;
  const burnRate = latestMetrics?.burn_rate || 0;
  const progress = Math.min((runwayMonths / 24) * 100, 100); // Using 24 months as benchmark

  return (
    <Card>
      <CardHeader>
        <CardTitle>Runway & Cash Position</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Monthly Burn Rate
            </div>
            <div className="text-2xl font-bold text-destructive">
              {formatCurrency(burnRate)}
            </div>
          </div>
          <div>
            <div className="text-sm font-medium text-muted-foreground mb-2">
              Runway
            </div>
            <div className="text-2xl font-bold">
              {runwayMonths} months
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Runway Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="text-xs text-muted-foreground">
            Based on current burn rate and available cash
          </div>
        </div>
      </CardContent>
    </Card>
  );
}