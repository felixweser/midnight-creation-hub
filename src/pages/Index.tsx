import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AuthPage from "@/components/auth/AuthPage";

export default function Index() {
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "staff") {
          navigate("/onboarding");
        } else {
          navigate("/dashboard");
        }
      }
      
      setIsChecking(false);
    };

    checkSession();
  }, [navigate]);

  if (isChecking) {
    return null;
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
          <AuthPage onBack={() => setShowAuth(false)} />
        )}
      </div>
    </Container>
  );
}