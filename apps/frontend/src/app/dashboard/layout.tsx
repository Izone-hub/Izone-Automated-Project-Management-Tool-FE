import { AppSidebar } from "@/components/AppSidebar";
import { Navbar } from "@/components/Navbar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Navbar className="bg-white shadow-md" />
        <div className="flex-1 px-4 py-6">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
// import { AppSidebar } from "@/components/AppSidebar";
// import { Navbar } from "@/components/Navbar";
// import { SidebarProvider } from "@/components/ui/sidebar";

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   return (
//     <SidebarProvider>
//       <AppSidebar className="bg-white" />

//       <main className="flex-1 flex flex-col w-full">
//         <Navbar className="bg-white shadow-md" />

//         <div className="flex-1 px-4 py-6">
//           {children}
//         </div>
//       </main>
//     </SidebarProvider>
//   );
// }
