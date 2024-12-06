import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateCompanyForm } from "@/components/companies/CreateCompanyForm";

export default function Companies() {
  const navigate = useNavigate();
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchCompanies = async () => {
    try {
      setIsLoading(true);
      const { data: companiesData, error } = await supabase
        .from("portfolio_companies")
        .select("*");
      
      if (error) {
        console.error("Error fetching companies:", error);
        return;
      }

      if (companiesData) {
        setCompanies(companiesData);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">Portfolio Companies</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Add Company
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Company</DialogTitle>
            </DialogHeader>
            <CreateCompanyForm 
              onSuccess={() => {
                setDialogOpen(false);
                fetchCompanies();
              }} 
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Companies</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Company Name</TableHead>
                  <TableHead>Industry</TableHead>
                  <TableHead>Founded</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companies.map((company) => (
                  <TableRow key={company.company_id}>
                    <TableCell className="font-medium">{company.name}</TableCell>
                    <TableCell>{company.industry}</TableCell>
                    <TableCell>{company.founding_date ? new Date(company.founding_date).getFullYear() : 'N/A'}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ring-green-600/20 bg-green-50/10 text-green-400">
                        {company.status || 'Active'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => navigate(`/dashboard/company/${company.company_id}`)}
                      >
                        View Details
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}