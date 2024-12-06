import {
  BarChart3,
  Building,
  FileText,
  Home,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/ui/sidebar/SidebarHeader";
import { SidebarNavItem } from "@/components/ui/sidebar/SidebarNavItem";

const items = [
  {
    title: "Overview",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Portfolio",
    url: "/dashboard/portfolio",
    icon: BarChart3,
  },
  {
    title: "Companies",
    url: "/dashboard/companies",
    icon: Building,
  },
  {
    title: "Team",
    url: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Documents",
    url: "/dashboard/documents",
    icon: FileText,
  },
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent className="flex flex-col h-full">
        <SidebarHeader />
        
        <div className="flex-1 px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground group-data-[collapsible=icon]:hidden">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarNavItem
                    key={item.title}
                    title={item.title}
                    url={item.url}
                    icon={item.icon}
                    isActive={location.pathname === item.url}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="px-3 py-4 mt-auto border-t border-border/5">
          <SidebarMenuButton
            onClick={handleSignOut}
            className="w-full justify-start text-destructive hover:bg-destructive/10 rounded-lg"
          >
            <LogOut className="h-4 w-4" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}