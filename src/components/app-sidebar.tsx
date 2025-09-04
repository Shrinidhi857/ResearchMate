import { Home, Inbox, Search, LogOut } from "lucide-react";
import { ScrollAreaDemo } from "@/components/Responsehistory";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // from shadcn/ui
import { Button } from "@/components/ui/button";

// Menu items.
const items = [
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      {/* Make content a column flexbox */}
      <SidebarContent className="flex flex-col ">
        {/* Top section */}
        <SidebarGroup>
          <SidebarHeader>Research Mate</SidebarHeader>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon className="mr-2 h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* 👇 Scrollable middle area */}
        <div className="flex-1 overflow-y-auto m-2 ">
          <ScrollAreaDemo />
        </div>
      </SidebarContent>

      {/* Fixed footer */}
      <SidebarFooter>
        <div className="flex items-center gap-2 p-3">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@user" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">John Doe</span>
            <span className="text-xs text-muted-foreground">
              john@example.com
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            aria-label="Logout"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
