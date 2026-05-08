import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface DatePickerProps {
  value?: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className }: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Parse YYYY-MM-DD to Date
  const date = value ? new Date(value) : undefined

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      // Format to YYYY-MM-DD using local timezone
      const formatted = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}`
      onChange(formatted)
    } else {
      onChange("")
    }
    setOpen(false) // Close the popover after selection
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal bg-background transition-all duration-200 hover:bg-accent/50",
            !date && "text-muted-foreground",
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            new Intl.DateTimeFormat("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric"
            }).format(date)
          ) : (
            <span>{placeholder}</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 shadow-xl rounded-xl border border-border/50" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          className="rounded-xl"
        />
      </PopoverContent>
    </Popover>
  )
}
