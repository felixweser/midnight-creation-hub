import { useEffect, useState } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";

export default function Index() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showAuth, setShowAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log("Checking session...");
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          toast({
            title: "Error",
            description: "Failed to check session",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        if (!session) {
          console.log("No active session found");
          setIsLoading(false);
          return;
        }

        console.log("Active session found:", session.user.id);

        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profileError) {
          console.error("Profile fetch error:", profileError);
          toast({
            title: "Error",
            description: "Failed to fetch user profile",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        console.log("User profile:", profile);

        if (profile?.role === "staff") {
          console.log("Navigating to onboarding...");
          navigate("/onboarding");
        } else {
          console.log("Navigating to dashboard...");
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Unexpected error:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.id);
        
        if (event === "SIGNED_IN" && session) {
          try {
            const { data: profile, error: profileError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", session.user.id)
              .single();

            if (profileError) {
              console.error("Profile fetch error on auth change:", profileError);
              toast({
                title: "Error",
                description: "Failed to fetch user profile",
                variant: "destructive",
              });
              return;
            }

            console.log("User profile on auth change:", profile);

            if (profile?.role === "staff") {
              console.log("Navigating to onboarding on auth change...");
              navigate("/onboarding");
            } else {
              console.log("Navigating to dashboard on auth change...");
              navigate("/dashboard");
            }
          } catch (error) {
            console.error("Error during profile check on auth change:", error);
            toast({
              title: "Error",
              description: "An unexpected error occurred",
              variant: "destructive",
            });
          }
        }
      }
    );

    return () => {
      console.log("Cleaning up auth subscription...");
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  if (isLoading) {
    return (
      <Container>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="min-h-screen flex flex-col items-center justify-center">
        {!showAuth ? (
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Welcome to Verdandi
            </h1>
            <p className="text-xl text-muted-foreground">
              The comprehensive platform connecting venture capital firms with their portfolio companies
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => setShowAuth(true)}
                className="text-lg px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setShowAuth(true)}
                className="text-lg px-8"
              >
                Sign In
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <Card>
                <CardHeader>
                  <CardTitle>Fund Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Streamline your fund operations and portfolio management in one place
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio Tracking</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track and analyze your portfolio companies' performance in real-time
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Collaboration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Foster seamless communication between VCs and portfolio companies
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Welcome to Verdandi</CardTitle>
              <CardDescription>
                Sign in to manage your fund and portfolio companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Auth
                supabaseClient={supabase}
                appearance={{
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: 'hsl(var(--primary))',
                        brandAccent: 'hsl(var(--primary))',
                      },
                    },
                  },
                }}
                providers={[]}
              />
              <Button
                variant="ghost"
                className="mt-4 w-full"
                onClick={() => setShowAuth(false)}
              >
                Back to Home
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Container>
  );
}