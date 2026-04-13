"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { User2, LayoutDashboard, BookUserIcon, ClipboardCheckIcon, BoxIcon, ChartLineIcon, UserIcon, CircleDollarSignIcon, Trash, Settings } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AppSidebar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await signOut({ redirect: true, callbackUrl: '/login' });
    } catch (error) {
      toast.error('Error al cerrar sesión');
      console.error('Logout error:', error);
    }
  };

  return (
    <Sidebar className="p-2">
      <SidebarHeader className="justify-center items-center ">
        <img src={'/digitadist.png'} alt="Digitadist logo" width={200} height={100} />
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
            <SidebarMenuButton onClick={() => router.push('/ofertas')} >
              <CircleDollarSignIcon /> Ofertas
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            {session?.user.role === 'admin' && <SidebarMenuButton onClick={() => router.push('/reportes')} >
              <ChartLineIcon /> Reportes
            </SidebarMenuButton>}
          </SidebarMenuItem>
          <SidebarMenuItem>
            {session?.user.role === 'admin' && <SidebarMenuButton onClick={() => router.push('/usuarios')} >
              <UserIcon /> Usuarios
            </SidebarMenuButton>}
          </SidebarMenuItem>
          <SidebarMenuItem>
            {session?.user.role === 'admin' && <SidebarMenuButton onClick={() => router.push('/configuracion')} >
              <Settings /> Configuración
            </SidebarMenuButton>}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="border-t-2 border-solid pt-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="items-center justify-center">
                  <User2 /> {session?.user.name}
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-40" align="start">
                <DropdownMenuGroup>
                  <DropdownMenuItem className=" hover:text-red-800" onClick={handleLogout}>
                    <Trash className="text-red-500" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar >
  );
}
