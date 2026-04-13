'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, FileUp, AlertCircle, PlayCircle } from 'lucide-react';
import Papa from 'papaparse';
import { toast } from 'sonner';

export function ImportCsvModal({ onImportComplete }: { onImportComplete: () => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setParsedData(results.data);
      },
      error: (error) => {
        toast.error('Error al leer el archivo CSV');
        console.error(error);
      }
    });
  };

  const procesarImportacion = async () => {
    if (parsedData.length === 0) return;
    setLoading(true);

    try {
        // Here we could iteratively hit our API for each object or create a bulk import endpoint.
        // For simplicity, showing a delayed mock simulating iteration over post endpoints.
        for(const item of parsedData) {
            // Validate mapping
            if(item.codigo) {
                // To DO -> Hit /api/productos
            }
        }
        
        toast.success(`Se simularon/importaron ${parsedData.length} productos.`);
        setIsOpen(false);
        onImportComplete();
    } catch (e) {
        toast.error("Error al importar algunos productos.");
    } finally {
        setLoading(false);
        setParsedData([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          <Upload className="h-4 w-4 mr-2" />
          Importar CSV
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Importar Productos</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col gap-2 items-center justify-center border-2 border-dashed border-neutral-200 p-6 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="w-8 h-8 text-neutral-400" />
            <span className="text-sm font-medium text-neutral-600">
              {parsedData.length > 0 ? `Archivo cargado: ${parsedData.length} filas detectadas.` : 'Haz click para seleccionar un archivo CSV'}
            </span>
            <input 
                type="file" 
                accept=".csv" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileUpload} 
            />
          </div>

          <div className="bg-blue-50 text-blue-800 p-3 rounded text-xs flex gap-2">
             <AlertCircle className="w-4 h-4 shrink-0" />
             El CSV debe contener las columnas: codigo, nombre, categoria_id, presentacion, tam_pack, costo, porcentaje_recargo, stock_actual, stock_minimo.
          </div>

          <div className="flex justify-end pt-4">
            <Button onClick={procesarImportacion} disabled={parsedData.length === 0 || loading}>
                {loading ? 'Procesando...' : 'Comenzar Importación'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
