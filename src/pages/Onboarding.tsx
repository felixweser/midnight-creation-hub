import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/Container";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

interface OnboardingForm {
  organizationName: string;
  fundName: string;
  vintageYear: number;
  fundSize: number;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<OnboardingForm>({
    defaultValues: {
      organizationName: "",
      fundName: "",
      vintageYear: new Date().getFullYear(),
      fundSize: 0,
    },
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  const onSubmit = async (data: OnboardingForm) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No user found");
      }

      // Create organization
      const { data: org, error: orgError } = await supabase
        .from("organizations")
        .insert({
          name: data.organizationName,
          type: "VC firm",
        })
        .select()
        .single();

      if (orgError) throw orgError;

      // Create organization user relationship
      await supabase.from("organization_users").insert({
        organization_id: org.organization_id,
        user_id: session.user.id,
        role: "admin",
      });

      // Create fund
      const { data: fund, error: fundError } = await supabase
        .from("funds")
        .insert({
          organization_id: org.organization_id,
          name: data.fundName,
          vintage_year: data.vintageYear,
          fund_size: data.fundSize,
          status: "active",
        })
        .select()
        .single();

      if (fundError) throw fundError;

      // Create fund user relationship
      await supabase.from("fund_users").insert({
        fund_id: fund.fund_id,
        user_id: session.user.id,
        role: "manager",
      });

      // Update user profile role
      await supabase
        .from("profiles")
        .update({ role: "vc" })
        .eq("id", session.user.id);

      toast({
        title: "Success!",
        description: "Your fund has been created successfully.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="min-h-screen py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Welcome to Verdandi</CardTitle>
            <CardDescription>
              Let's get your fund set up. Fill in the details below to create your organization and fund.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your organization name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fundName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fund Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your fund name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vintageYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vintage Year</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fundSize"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fund Size (in USD)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Creating your fund..." : "Create Fund"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}