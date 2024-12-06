import { Routes, Route } from "react-router-dom";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import Portfolio from "./dashboard/Portfolio";
import Companies from "./dashboard/Companies";
import CompanyDashboard from "./dashboard/CompanyDashboard";
import Documents from "./dashboard/Documents";
import Team from "./dashboard/Team";
import { Container } from "@/components/Container";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Dashboard() {
  return (
    <SidebarProvider>
      <div className="flex h-screen bg-background">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <Container>
            <Routes>
              <Route path="/" element={<Portfolio />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/companies" element={<Companies />} />
              <Route path="/company/:companyId" element={<CompanyDashboard />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/team" element={<Team />} />
            </Routes>
          </Container>
        </main>
      </div>
    </SidebarProvider>
  );
}