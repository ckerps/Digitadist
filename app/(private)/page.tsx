'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Users,
  ShoppingCart,
  TrendingUp,
  Package,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { DashboardAlerts } from './components/DashboardAlerts';
import { Skeleton } from '@/components/ui/skeleton';

interface KPIs {
  ventasMes: number;
  pedidosActivos: number;
  totalProductos: number;
  totalClientes: number;
}

function KpiSkeleton() {
  return (
    <Card className="border-neutral-200">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-4 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-8 w-24 mb-1" />
        <Skeleton className="h-3 w-20" />
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [kpis, setKpis] = useState<KPIs | null>(null);
  const [kpisLoading, setKpisLoading] = useState(true);

  const sessionLoading = status === 'loading';
  const userName = session?.user?.name || 'Usuario';
  const role = (session?.user as any)?.role || '';

  useEffect(() => {
    fetch('/api/dashboard/kpis')
      .then((r) => r.json())
      .then((data) => setKpis(data))
      .catch(console.log)
      .finally(() => setKpisLoading(false));
  }, []);

  const formatCurrency = (v: number) =>
    new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(v);

  return (
    <div className="w-full space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {sessionLoading ? (
              <span className="flex items-center gap-2">Bienvenido, <Skeleton className="h-9 w-40 inline-block" /></span>
            ) : (
              <>Bienvenido, {userName}</>
            )}
          </h1>
          <p className="text-muted-foreground mt-1">
            Revisá el estado general de tu negocio.
          </p>
        </div>
        <div className="flex gap-2">
          {!sessionLoading && role === 'admin' && (
            <Button onClick={() => router.push('/usuarios')} variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              Usuarios
            </Button>
          )}
          <Button
            onClick={() => router.push('/pedidos/nuevo')}
            className="gap-2 bg-red-600 hover:bg-red-700 text-white"
          >
            <ShoppingCart className="h-4 w-4" />
            Nuevo Pedido
          </Button>
        </div>
      </div>

      <DashboardAlerts />

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpisLoading ? (
          <>
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
            <KpiSkeleton />
          </>
        ) : (
          <>
            <Card className="hover:shadow-md transition-shadow border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Ventas del Mes
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {formatCurrency(kpis?.ventasMes ?? 0)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Pedidos no cancelados
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Pedidos Activos
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-red-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {kpis?.pedidosActivos ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Registrados y en preparación
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Productos Activos
                </CardTitle>
                <Package className="h-4 w-4 text-neutral-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {kpis?.totalProductos ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">En catálogo</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Clientes Activos
                </CardTitle>
                <Users className="h-4 w-4 text-neutral-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">
                  {kpis?.totalClientes ?? 0}
                </div>
                <p className="text-xs text-muted-foreground mt-1">En cartera</p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Accesos Rápidos */}
      <Card className="border-neutral-200">
        <CardHeader>
          <CardTitle>Accesos Rápidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            <Button
              variant="outline"
              className="justify-between font-normal"
              onClick={() => router.push('/productos')}
            >
              <span className="flex items-center gap-2">
                <Package className="h-4 w-4 text-neutral-500" /> Productos
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </Button>
            <Button
              variant="outline"
              className="justify-between font-normal"
              onClick={() => router.push('/clientes')}
            >
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4 text-neutral-500" /> Clientes
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </Button>
            <Button
              variant="outline"
              className="justify-between font-normal"
              onClick={() => router.push('/ofertas')}
            >
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-neutral-500" /> Ofertas
              </span>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
