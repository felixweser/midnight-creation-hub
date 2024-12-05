import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Portfolio from "./dashboard/Portfolio";
import Companies from "./dashboard/Companies";
import Team from "./dashboard/Team";
import Documents from "./dashboard/Documents";

function DashboardHome() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">$0M</p>
            <p className="text-sm text-muted-foreground">Assets Under Management</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Active Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">0</p>
            <p className="text-sm text-muted-foreground">Portfolio Companies</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold">1</p>
            <p className="text-sm text-muted-foreground">Active Members</p>
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
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        <main className="flex-1 p-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="companies" element={<Companies />} />
            <Route path="team" element={<Team />} />
            <Route path="documents" element={<Documents />} />
          </Routes>
        </main>
      </div>
    </SidebarProvider>
  );
}