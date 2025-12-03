import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import {ThemeProvider} from "@/components/providers/ThemeProviders";

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
        >
         <ThemeProvider 
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
         {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
