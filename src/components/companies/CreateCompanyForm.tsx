import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
import { CompanyDetailsFields } from "./CompanyDetailsFields";
import { InvestmentDetailsFields } from "./InvestmentDetailsFields";
import { companyFormSchema, CompanyFormValues } from "./types";

export function CreateCompanyForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const form = useForm<CompanyFormValues>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      name: "",
      industry: "",
      foundingDate: "",
      description: "",
      hqLocation: "",
      investmentDate: "",
      investmentStage: "",
      roundName: "",
      amountInvested: 0,
      ownershipPercentage: 0,
      valuation: 0,
    },
  });

  const onSubmit = async (values: CompanyFormValues) => {
    try {
      // First, create the company
      const { data: companyData, error: companyError } = await supabase
        .from("portfolio_companies")
        .insert({
          name: values.name,
          industry: values.industry,
          founding_date: values.foundingDate,
          hq_location: values.hqLocation,
          investment_stage: values.investmentStage,
          initial_investment_date: values.investmentDate,
          total_raised: values.amountInvested,
          status: "Active",
          metadata: {
            description: values.description || null,
          },
        })
        .select()
        .single();

      if (companyError) throw companyError;

      // Then, create the investment record
      const { error: investmentError } = await supabase
        .from("investments")
        .insert({
          company_id: companyData.company_id,
          investment_date: values.investmentDate,
          round_name: values.roundName,
          amount_invested: values.amountInvested,
          ownership_percentage: values.ownershipPercentage,
          valuation: values.valuation,
          investment_type: "Initial",
          status: "Active",
        });

      if (investmentError) throw investmentError;

      toast({
        title: "Success",
        description: "Investment created successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error creating investment:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create investment. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <CompanyDetailsFields form={form} />
        <InvestmentDetailsFields form={form} />
        <DialogFooter>
          <Button type="submit">Create Investment</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}