"use client"
import { Toaster } from "sonner";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { SessionProvider } from "next-auth/react";
import AppSidebar from "../providers/AppSidebar";
import QueryProvider from "../providers/QueryProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <SessionProvider>
          <QueryProvider>
            <SidebarProvider>
              <AppSidebar />
              <SidebarTrigger className="md:relative md:inline-block absolute top-4 left-4 md:top-auto md:left-auto z-10 m-1" />
              <main className="w-full h-full flex flex-col overflow-auto bg-background transition-colors duration-300">
                <div className="flex-1 px-4 pt-14 pb-4 md:px-8 md:py-6 max-w-[1600px] mx-auto w-full animate-in fade-in duration-500">
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </QueryProvider>
        </SessionProvider>
  );
}
