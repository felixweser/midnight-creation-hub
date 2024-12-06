import React from "react";
import { Link } from "react-router-dom";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenuItem,
  SidebarMenuButton,
} from "./components";

interface SidebarNavItemProps {
  title: string;
  url: string;
  icon: LucideIcon;
  isActive: boolean;
}

export function SidebarNavItem({ title, url, icon: Icon, isActive }: SidebarNavItemProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        className={cn(
          "transition-colors hover:bg-primary/10 rounded-lg",
          isActive && "bg-primary/10 text-primary font-medium"
        )}
      >
        <Link to={url}>
          <Icon className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">{title}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}