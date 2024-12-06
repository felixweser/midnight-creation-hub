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
import { Button } from "@/components/ui/button";

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
    <div className="w-64 h-screen bg-background border-r">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Dashboard</h2>
        </div>
        
        <div className="flex-1 px-3 py-4">
          <div className="space-y-1">
            {items.map((item) => (
              <Button
                key={item.title}
                variant={location.pathname === item.url ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.url)}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>

        <div className="px-3 py-4 mt-auto border-t">
          <Button
            onClick={handleSignOut}
            variant="ghost"
            className="w-full justify-start text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}