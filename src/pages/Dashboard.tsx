import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import Companies from "./dashboard/Companies";
import CompanyDashboard from "./dashboard/CompanyDashboard";
import Team from "./dashboard/Team";
import Documents from "./dashboard/Documents";
import { Container } from "@/components/Container";

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
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background">
        <DashboardSidebar />
        <SidebarInset className="flex-1">
          <Container className="py-8">
            <Routes>
              <Route index element={<Companies />} />
              <Route path="companies" element={<Companies />} />
              <Route path="companies/:companyId" element={<CompanyDashboard />} />
              <Route path="team" element={<Team />} />
              <Route path="documents" element={<Documents />} />
            </Routes>
          </Container>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}