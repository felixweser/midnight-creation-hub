import {
  BarChart3,
  Building,
  FileText,
  Home,
  Settings,
  Users,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useState } from "react";

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
  const { setOpen } = useSidebar();
  const [isLocked, setIsLocked] = useState(false);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const handleMouseEnter = () => {
    if (!isLocked) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isLocked) {
      setOpen(false);
    }
  };

  const handleTriggerClick = () => {
    setIsLocked(!isLocked);
    setOpen(!isLocked);
  };

  return (
    <Sidebar>
      <SidebarContent 
        className="flex flex-col h-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="flex items-center gap-3 px-6 py-6 border-b border-border/5">
          <SidebarTrigger 
            className={cn(
              "hover:bg-accent rounded-lg transition-colors",
              isLocked && "bg-accent"
            )}
            onClick={handleTriggerClick}
          />
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent">
            Platform
          </h2>
        </div>
        
        <div className="flex-1 px-3 py-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-xs font-medium text-muted-foreground">
              Dashboard
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        className={cn(
                          "transition-colors hover:bg-primary/10 rounded-lg",
                          isActive && "bg-primary/10 text-primary font-medium"
                        )}
                      >
                        <Link to={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
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
            <span>Sign Out</span>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}