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
              <Toaster />
              <main className="w-full h-full flex flex-col overflow-auto">
                <div className="flex-1 px-6 py-6 md:px-8 md:py-8 bg-neutral-50">
                  {children}
                </div>
              </main>
            </SidebarProvider>
          </QueryProvider>
        </SessionProvider>
  );
}
