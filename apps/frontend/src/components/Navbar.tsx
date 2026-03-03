
"use client";
import { Moon, LogOut, User, Settings, Sun } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DynamicBreadcrumb } from "@/components/DynamicBreadcrumb";
import { ModeToggle } from "./ui/theme-toggle";

interface NavbarProps {
  className?: string;
}

export const Navbar = ({ className }: NavbarProps) => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // ✅ Updated logout function
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      localStorage.removeItem("auth_token"); // optional if you store token in localStorage
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className={`sticky top-0 z-40 p-1.5 flex items-center justify-between bg-gray-100 border-b shadow-sm ${className}`}>
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <DynamicBreadcrumb />
      </div>

      <div className="flex items-center gap-4">
        {/* Removed static Dashboard link as it's now in breadcrumbs/sidebar */}
        {/* <Link href="/">Dashboard</Link> */}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ModeToggle />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
              <User className="h-[1.2rem] w-[1.2rem] mr-2" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Settings className="h-[1.2rem] w-[1.2rem] mr-2" />
              Settings
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={handleLogout} // ✅ Calls real logout API
            >
              <LogOut className="h-[1.2rem] w-[1.2rem] mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default Navbar;
