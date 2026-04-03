"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  date: DateRange | undefined
  setDate: (date: DateRange | undefined) => void
  placeholder?: string
}

export function DatePickerWithRange({
  className,
  date,
  setDate,
  placeholder = "Seleccionar rango",
}: DatePickerWithRangeProps) {
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal h-10 border-neutral-200 hover:border-red-300 transition-colors",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-red-600" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} -{" "}
                  {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>{placeholder}</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={isMobile ? 1 : 2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
