"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { User2, LayoutDashboard, BookUserIcon, ClipboardCheckIcon, BoxIcon, ChartLineIcon, UserIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function AppSidebar() {
  const { open } = useSidebar();
  const router = useRouter();

  return (
    <Sidebar className="p-2">
      <SidebarHeader className="justify-center items-center ">
        <Image src={'/digitadist.png'} alt="Digitadist logo" width={'200'} height={'100'} />
      </SidebarHeader>
      <SidebarContent className="border-t-2 border-solid pt-2">
        <SidebarMenu className="gap-3">
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/')} >
              <LayoutDashboard /> Inicio
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/pedidos')} >
              <ClipboardCheckIcon /> Pedidos
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/clientes')} >
              <BookUserIcon /> Clientes
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/productos')} >
              <BoxIcon /> Productos
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/reportes')} >
              <ChartLineIcon /> Reportes
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={() => router.push('/usuarios')} >
              <UserIcon /> Usuarios
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="border-t-2 border-solid pt-2">
            <SidebarMenuButton className="justify-center" variant={'outline'}>
              <User2 /> Username
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
