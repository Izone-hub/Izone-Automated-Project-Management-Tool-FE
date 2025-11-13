import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import {AppSidebar} from "@/components/AppSidebar";
import {Navbar} from "@/components/Navbar";
import {ThemeProvider} from "@/components/providers/ThemeProviders";
import {SidebarProvider} from "@/components/ui/sidebar";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Izone Project Management",
  description: "Automated Project Management Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}>

         <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
         
         <SidebarProvider>
        <AppSidebar className="bg-white"/>  
        <main className="flex-1 flex flex-col w-full">
         <Navbar className="bg-white shadow-md" /> 
         <div className="flex-1 px-4 py-6"> {children} </div>
         <div>
         </div> 
        </main>
         </SidebarProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
