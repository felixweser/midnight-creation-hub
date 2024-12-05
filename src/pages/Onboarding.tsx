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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FundAdminForm {
  organizationName: string;
  fundName: string;
  vintageYear: number;
  fundSize: number;
}

interface EmployeeForm {
  selectedFund: string;
}

export default function Onboarding() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"admin" | "employee" | null>(null);
  const [availableFunds, setAvailableFunds] = useState<Array<{ fund_id: string; name: string }>>([]);

  const adminForm = useForm<FundAdminForm>({
    defaultValues: {
      organizationName: "",
      fundName: "",
      vintageYear: new Date().getFullYear(),
      fundSize: 0,
    },
  });

  const employeeForm = useForm<EmployeeForm>({
    defaultValues: {
      selectedFund: "",
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

  useEffect(() => {
    const fetchFunds = async () => {
      const { data: funds, error } = await supabase
        .from("funds")
        .select("fund_id, name")
        .eq("status", "active");

      if (error) {
        toast({
          title: "Error",
          description: "Failed to fetch available funds",
          variant: "destructive",
        });
        return;
      }

      setAvailableFunds(funds || []);
    };

    if (role === "employee") {
      fetchFunds();
    }
  }, [role, toast]);

  const onSubmitAdmin = async (data: FundAdminForm) => {
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

  const onSubmitEmployee = async (data: EmployeeForm) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        throw new Error("No user found");
      }

      // Get fund details
      const { data: fund, error: fundError } = await supabase
        .from("funds")
        .select("*, organizations(*)")
        .eq("fund_id", data.selectedFund)
        .single();

      if (fundError) throw fundError;

      // Create organization user relationship
      await supabase.from("organization_users").insert({
        organization_id: fund.organization_id,
        user_id: session.user.id,
        role: "member",
      });

      // Create fund user relationship
      await supabase.from("fund_users").insert({
        fund_id: fund.fund_id,
        user_id: session.user.id,
        role: "analyst",
      });

      // Update user profile role
      await supabase
        .from("profiles")
        .update({ role: "vc" })
        .eq("id", session.user.id);

      toast({
        title: "Success!",
        description: "You have successfully joined the fund.",
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

  if (!role) {
    return (
      <Container>
        <div className="min-h-screen py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Welcome to Verdandi</CardTitle>
              <CardDescription>
                Please select your role to continue with the onboarding process.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                className="w-full mb-2"
                onClick={() => setRole("admin")}
              >
                I'm setting up a new fund
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => setRole("employee")}
              >
                I'm joining an existing fund
              </Button>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  if (role === "employee") {
    return (
      <Container>
        <div className="min-h-screen py-12">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Join Your Fund</CardTitle>
              <CardDescription>
                Select the fund you're joining to complete your registration.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...employeeForm}>
                <form onSubmit={employeeForm.handleSubmit(onSubmitEmployee)} className="space-y-6">
                  <FormField
                    control={employeeForm.control}
                    name="selectedFund"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Select Your Fund</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a fund" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableFunds.map((fund) => (
                              <SelectItem key={fund.fund_id} value={fund.fund_id}>
                                {fund.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Joining fund..." : "Join Fund"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Set Up Your Fund</CardTitle>
            <CardDescription>
              Fill in the details below to create your organization and fund.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...adminForm}>
              <form onSubmit={adminForm.handleSubmit(onSubmitAdmin)} className="space-y-6">
                <FormField
                  control={adminForm.control}
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
                  control={adminForm.control}
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
                  control={adminForm.control}
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
                  control={adminForm.control}
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