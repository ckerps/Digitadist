'use client';

import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';

export function ExportCsvButton() {
  const handleExport = async () => {
    try {
      const res = await fetch('/api/productos?itemsPerPage=1000&currentPage=1');
      if (!res.ok) throw new Error("Fallo la obtención de productos");

      const data = await res.json();
      const productos = data.productos;

      if (!productos || productos.length === 0) {
        toast.error("No hay productos para exportar");
        return;
      }

      const csv = Papa.unparse(productos.map((p: any) => ({
        codigo: p.codigo,
        nombre: p.nombre,
        categoria: p.categoria?.nombre || '',
        presentacion: p.presentacion,
        tam_pack: p.tam_pack,
        costo: p.costo,
        porcentaje_recargo: p.porcentaje_recargo,
        precio_venta: (parseFloat(p.costo) * (1 + p.porcentaje_recargo / 100)).toFixed(2),
        stock_actual: p.stock_actual,
        stock_minimo: p.stock_minimo || 0,
        activo: p.activo ? 'Si' : 'No'
      })));

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.setAttribute('download', 'catalogo_productos.csv');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      toast.success("Catálogo exportado exitosamente");
    } catch (e) {
      toast.error("Error al exportar a CSV");
      console.log(e);
    }
  };

  return (
    <Button variant="outline" className="w-full md:w-auto" onClick={handleExport}>
      <Download className="h-4 w-4 mr-2" />
      Exportar CSV
    </Button>
  );
}
