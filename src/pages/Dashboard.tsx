import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Portfolio from "./dashboard/Portfolio";
import Companies from "./dashboard/Companies";
import CompanyDashboard from "./dashboard/CompanyDashboard";
import Team from "./dashboard/Team";
import Documents from "./dashboard/Documents";
import { Container } from "@/components/Container";

function DashboardHome() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">Welcome Back</h1>
          <p className="text-muted-foreground mt-1">Here's an overview of your portfolio</p>
        </div>
        <Button onClick={handleSignOut} variant="outline" className="hover:bg-destructive hover:text-destructive-foreground">
          Sign Out
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              Portfolio Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">$0M</p>
            <p className="text-sm text-muted-foreground">Assets Under Management</p>
          </CardContent>
        </Card>
        
        <Card className="hover-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              Active Companies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">0</p>
            <p className="text-sm text-muted-foreground">Portfolio Companies</p>
          </CardContent>
        </Card>
        
        <Card className="hover-card">
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              Team Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">1</p>
            <p className="text-sm text-muted-foreground">Active Members</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="hover-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground text-sm">No recent activities</p>
          </CardContent>
        </Card>

        <Card className="hover-card">
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex gap-3">
            <Button onClick={() => navigate('/dashboard/companies')} variant="outline" className="flex-1">
              Add Company
            </Button>
            <Button onClick={() => navigate('/dashboard/documents')} variant="outline" className="flex-1">
              Upload Document
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">
          <Container className="py-8">
            <Routes>
              <Route index element={<DashboardHome />} />
              <Route path="portfolio" element={<Portfolio />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/:companyId" element={<CompanyDashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="documents" element={<Documents />} />
            </Routes>
          </Container>
        </main>
      </div>
    </SidebarProvider>
  );
}