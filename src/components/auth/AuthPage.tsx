import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function AuthPage({ onBack }: { onBack: () => void }) {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
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
              console.error("Profile fetch error:", profileError);
              toast({
                title: "Error",
                description: "Failed to fetch user profile",
                variant: "destructive",
              });
              return;
            }

            if (profile?.role === "staff") {
              navigate("/onboarding");
            } else {
              navigate("/dashboard");
            }
          } catch (error) {
            console.error("Error during profile check:", error);
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
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
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
          onClick={onBack}
        >
          Back to Home
        </Button>
      </CardContent>
    </Card>
  );
}