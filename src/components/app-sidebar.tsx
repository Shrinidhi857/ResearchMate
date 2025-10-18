import { useEffect, useState } from "react";
import {
  Home,
  Inbox,
  Search,
  LogOut,
  Rocket,
  MessageCircle,
} from "lucide-react";
import { DocumentList } from "./DocumentList";
import tiger from "@/assets/tiger.png";
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
import logo from "@/assets/logo.png";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
const API_URL = import.meta.env.VITE_SERVER_API_URL; // Base URL from .env file

interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
}

// Menu items.
const items = [
  { title: "Search", url: "#", icon: Search },
  { title: "Home", url: "/", icon: Home },
  { title: "RAG Chat", url: "/chat", icon: MessageCircle },
  { title: "NLP Analysis", url: "/analysis", icon: Rocket },
];

export function AppSidebar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) return;

        const response = await fetch(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setUser(data);
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <Sidebar>
      {/* Sidebar content */}
      <SidebarContent className="flex flex-col">
        {/* Top section */}
        <SidebarGroup>
          <SidebarHeader className="flex flex-row gap-1  items-center">
            <img src={logo} className="w-6 h-6 rounded-2xl" />
            Research Mate
          </SidebarHeader>
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

        {/* Middle area */}
        <h4 className="m-4 text-sm leading-none font-medium">Documents</h4>

        <div className="flex-1 overflow-y-auto m-2 scrollbar-hide">
          <DocumentList />
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>
        <div className="flex items-center gap-2 p-3">
          <Avatar>
            <AvatarImage src={tiger} alt="@user" />
            <AvatarFallback>
              {user?.first_name ? user.first_name[0].toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user?.first_name || "Unknown"} {user?.last_name || "User"}
            </span>
            <span className="text-xs text-muted-foreground">
              {user?.email || "No email"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto"
            aria-label="Logout"
            onClick={() => {
              localStorage.removeItem("authToken");
              window.location.href = "/login";
            }}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
