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

const formSchema = z.object({
  name: z.string().min(1, "Company name is required"),
  industry: z.string().min(1, "Industry is required"),
  foundingDate: z.string().min(1, "Founding date is required"),
  teamSize: z.number().min(1, "Team size must be at least 1").or(z.string().transform(val => (val ? parseInt(val, 10) : 0))),
  performance: z.string().optional(),
  description: z.string().optional(),
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
      teamSize: 0,
      performance: "",
      description: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      const { error } = await supabase.from("portfolio_companies").insert({
        name: values.name,
        industry: values.industry,
        founding_date: values.foundingDate,
        status: "Active",
        metadata: {
          team_size: Number(values.teamSize),
          performance: values.performance || null,
          description: values.description || null,
          metrics: {},
        },
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Company created successfully",
      });
      
      onSuccess();
    } catch (error) {
      console.error("Error creating company:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create company. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
          name="teamSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Size</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="Enter team size" 
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
          name="performance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Performance Status</FormLabel>
              <FormControl>
                <Input 
                  placeholder="e.g., Growing, Stable, etc." 
                  {...field} 
                />
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

        <DialogFooter>
          <Button type="submit">Create Company</Button>
        </DialogFooter>
      </form>
    </Form>
  );
}