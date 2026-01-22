import { Calendar, Home, Search, Settings, LayoutTemplate } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarSeparator,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { WorkspaceGroup } from "./sidebar/WorkspaceGroup";

// Updated navigation items to match Trello's structure
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Boards",
    url: "/boards",
    icon: LayoutTemplate,
  },
  // {
  //   title: "Templates",
  //   url: "/templates",
  //   icon: Calendar,
  // },
  // {
  //   title: "Search",
  //   url: "/search",
  //   icon: Search,
  // },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon">
      {/* Header with Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="flex items-center gap-2">
              <Link href="/">
                <Image
                  src="/Group%2010.png"
                  alt="logo"
                  width={26}
                  height={26}
                />
                <span className="font-semibold">Project Management</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Workspaces Section */}
        <WorkspaceGroup />
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

