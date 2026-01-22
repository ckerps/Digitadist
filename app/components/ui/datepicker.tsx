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
  const selectedDate = fecha ? new Date(fecha) : undefined;

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date ? date.toISOString().split('T')[0] : undefined); // Formato YYYY-MM-DD
  };

  return (
    <Popover {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!selectedDate}
          className="data-[empty=true]:text-muted-foreground w-70 justify-start text-left font-normal"
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