import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioCompany } from "@/integrations/supabase/types/companies";

export function CompanyMetrics({ company }: { company: PortfolioCompany }) {
  return (
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
  );
}