"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({props, fecha, onChange}: {props?: React.HTMLAttributes<HTMLDivElement>, fecha?: string, onChange?: (date: string | undefined) => void}) {
  // Parsear fecha correctamente sin desfase de zona horaria
  const selectedDate = fecha ? parseDateString(fecha) : undefined;

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date ? formatDateToISO(date) : undefined); // Formato YYYY-MM-DD
  };

  // Función para parsear string YYYY-MM-DD sin desfase de zona horaria
  function parseDateString(dateStr: string): Date {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  // Función para formatear Date a ISO sin desfase
  function formatDateToISO(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selectedDate}
          className="data-[empty=true]:text-muted-foreground justify-start text-left font-normal h-10 w-full"
        >
          <CalendarIcon />
          {selectedDate ? format(selectedDate, "PPP") : <span>Seleccionar una fecha</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={selectedDate} onSelect={handleSelect} required />
      </PopoverContent>
    </Popover>
  )
}