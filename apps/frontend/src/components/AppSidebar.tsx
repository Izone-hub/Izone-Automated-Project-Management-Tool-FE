import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { Sidebar,
         SidebarHeader,
         SidebarSeparator,
         SidebarContent, 
         SidebarGroup,
         SidebarGroupContent, 
         SidebarGroupLabel, 
         SidebarMenu, 
         SidebarMenuButton,
         SidebarMenuItem,
        SidebarTrigger, } from "@/components/ui/sidebar";

import Link from "next/link";
import Image from "next/image";      


const items = [
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
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]
export const AppSidebar=() => {
    return(
       <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-2">
             <Image 
             src="/Group%2010.png" 
             alt="logo" 
             width={26}
             height={26}/>
             <span className="opacity-0">Logo</span>
             </Link>
            </SidebarMenuButton>  
          </SidebarMenu>
          </SidebarHeader>

        <SidebarSeparator/>

         <SidebarContent>
           <SidebarGroup>
            <SidebarGroupLabel>Application</SidebarGroupLabel>
             <SidebarGroupContent>
              <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
     
    </Sidebar>
    )
}
export default AppSidebar