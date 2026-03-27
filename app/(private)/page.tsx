'use client';

import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  ArrowRight,
  Activity
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const userName = session?.user?.name || 'Usuario';
  const role = (session?.user as any)?.role || '';

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            Bienvenido, {userName}
          </h1>
          <p className="text-muted-foreground mt-1">
            Revisa el estado general de tu negocio y accesos rápidos.
          </p>
        </div>
        <div className="flex gap-2">
          {role === 'admin' && (
            <Button onClick={() => router.push('/usuarios')} variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Gestión de Usuarios
            </Button>
          )}
          <Button onClick={() => router.push('/pedidos/nuevo')} className="gap-2 bg-red-600 hover:bg-red-700 text-white">
            <ShoppingCart className="h-4 w-4" />
            Nuevo Pedido
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ventas Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Actualizado hoy
            </p>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-shadow border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pedidos Activos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              Pendientes de entrega
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Productos en Stock</CardTitle>
            <Package className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              En catálogo
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow border-neutral-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Clientes Registrados</CardTitle>
            <Users className="h-4 w-4 text-neutral-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">--</div>
            <p className="text-xs text-muted-foreground mt-1">
              En cartera
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 lg:col-span-4 border-neutral-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-red-600" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex h-[250px] items-center justify-center rounded-md border border-dashed border-neutral-200 bg-neutral-50 text-neutral-500">
              Cargando estadísticas...
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 lg:col-span-3 border-neutral-200">
          <CardHeader>
            <CardTitle>Accesos Rápidos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Button variant="outline" className="justify-between w-full font-normal" onClick={() => router.push('/productos')}>
                <span className="flex items-center gap-2"><Package className="h-4 w-4 text-neutral-500" /> Catálogo de Productos</span>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </Button>
              <Button variant="outline" className="justify-between w-full font-normal" onClick={() => router.push('/clientes')}>
                <span className="flex items-center gap-2"><Users className="h-4 w-4 text-neutral-500" /> Cartera de Clientes</span>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </Button>
              <Button variant="outline" className="justify-between w-full font-normal" onClick={() => router.push('/ofertas')}>
                <span className="flex items-center gap-2"><TrendingUp className="h-4 w-4 text-neutral-500" /> Gestión de Ofertas</span>
                <ArrowRight className="h-4 w-4 text-neutral-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
