import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  // Company Details
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  foundingDate: z.string().min(1, "Founding date is required"),
  description: z.string().optional(),
  hqLocation: z.string().min(1, "HQ location is required"),
  
  // Investment Details
  investmentDate: z.string().min(1, "Investment date is required"),
  investmentStage: z.string().min(1, "Investment stage is required"),
  roundName: z.string().min(1, "Round name is required"),
  amountInvested: z.number().min(1, "Amount invested must be greater than 0").or(z.string().transform(val => (val ? parseFloat(val) : 0))),
  ownershipPercentage: z.number().min(0, "Ownership percentage must be positive").max(100, "Ownership percentage cannot exceed 100").or(z.string().transform(val => (val ? parseFloat(val) : 0))),
  valuation: z.number().min(1, "Valuation must be greater than 0").or(z.string().transform(val => (val ? parseFloat(val) : 0))),
});

type FormValues = z.infer<typeof formSchema>;

export function CreateCompanyForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (values: FormValues) => {
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
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Company Details</h3>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter company name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="industry"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Industry</FormLabel>
                <FormControl>
                  <Input placeholder="Enter industry" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="foundingDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Founding Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hqLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Headquarters Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Enter company description" 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Investment Details</h3>
          <FormField
            control={form.control}
            name="investmentDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Investment Date</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="investmentStage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Investment Stage</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select investment stage" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Seed">Seed</SelectItem>
                    <SelectItem value="Series A">Series A</SelectItem>
                    <SelectItem value="Series B">Series B</SelectItem>
                    <SelectItem value="Series C">Series C</SelectItem>
                    <SelectItem value="Late Stage">Late Stage</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="roundName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Round Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Seed Round, Series A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="amountInvested"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount Invested ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter amount" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="ownershipPercentage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ownership Percentage (%)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter percentage" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="valuation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valuation ($)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="Enter valuation" 
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <DialogFooter>
          <Button type="submit">Create Investment</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}