import React from "react";
import { SidebarTrigger } from "./components";
import { cn } from "@/lib/utils";

export function SidebarHeader() {
  return (
    <div className="flex items-center gap-3 px-6 py-6 border-b border-border/5">
      <SidebarTrigger className="hover:bg-accent rounded-lg" />
      <h2 className={cn(
        "text-xl font-bold bg-gradient-to-r from-primary/80 to-primary bg-clip-text text-transparent",
        "group-data-[collapsible=icon]:hidden"
      )}>
        Platform
      </h2>
    </div>
  );
}