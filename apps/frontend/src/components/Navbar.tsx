 "use client"; 
import {Moon, LogOut ,User ,Settings, Sun} from "lucide-react";
import Link from "next/link";
import {Avatar,AvatarFallback,AvatarImage} from "@/components/ui/avatar";
import { Button} from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {useTheme}  from "next-themes";
import {SidebarTrigger} from "@/components/ui/sidebar";


 
  export const Navbar = () => {
   const { theme,setTheme } = useTheme();
   
   return (
           <nav className="p-1.5 flex item-center justify-between bg-gray-100">
             {/* LEFT */}
             <SidebarTrigger/>
             {/* RIGHT */}
         <div className="flex items-center gap-4">

         <Link href="/" >Dashboard</Link>
         {/* THEME MENU */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
           <Button variant="outline" size="icon">
             <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
             <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
              <span className="sr-only">Toggle theme</span>
           </Button>
        </DropdownMenuTrigger>
       <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

         {/* USER MENU */}
         <DropdownMenu>
         <DropdownMenuTrigger>
         <Avatar>
         <AvatarImage src="https://github.com/shadcn.png" />
         <AvatarFallback>CN</AvatarFallback>
         </Avatar>
         </DropdownMenuTrigger>


         <DropdownMenuContent sideOffset={10}>
         <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem>
        <User className="h-[1,2rem] w-[1,2rem] mr-2"/>
          profile
        </DropdownMenuItem>

        <DropdownMenuItem>
        <Settings className="h-[1,2rem] w-[1,2rem] mr-2"/>
        settings
        </DropdownMenuItem>

        <DropdownMenuItem variant="destructive">
         <LogOut className="h-[1,2rem] w-[1,2rem] mr-2"/>
         LogOut
       </DropdownMenuItem>
       </DropdownMenuContent>
     </DropdownMenu>
     </div>
   </nav>
   
  );
};

export default Navbar
