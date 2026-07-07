import * as React from "react"
import { format, isValid } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  fromYear?: number
  toYear?: number
  "data-testid"?: string
}

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled,
  fromYear = 1920,
  toYear = new Date().getFullYear(),
  "data-testid": testId,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [month, setMonth] = React.useState<Date>(value || new Date(2000, 0, 1))

  const [monthVal, setMonthVal] = React.useState(value ? (value.getUTCMonth() + 1).toString().padStart(2, '0') : "")
  const [dayVal, setDayVal] = React.useState(value ? value.getUTCDate().toString().padStart(2, '0') : "")
  const [yearVal, setYearVal] = React.useState(value ? value.getUTCFullYear().toString() : "")

  const monthRef = React.useRef<HTMLInputElement>(null)
  const dayRef = React.useRef<HTMLInputElement>(null)
  const yearRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value) {
      setMonthVal((value.getUTCMonth() + 1).toString().padStart(2, '0'))
      setDayVal(value.getUTCDate().toString().padStart(2, '0'))
      setYearVal(value.getUTCFullYear().toString())
      setMonth(value)
    }
  }, [value])

  const tryUpdateDate = (m: string, d: string, y: string) => {
    if (m.length === 2 && d.length === 2 && y.length === 4) {
      const monthNum = parseInt(m, 10)
      const dayNum = parseInt(d, 10)
      const yearNum = parseInt(y, 10)

      if (monthNum >= 1 && monthNum <= 12 && dayNum >= 1 && dayNum <= 31 && yearNum >= fromYear && yearNum <= toYear) {
        const date = new Date(Date.UTC(yearNum, monthNum - 1, dayNum))
        if (isValid(date) && (date.getUTCMonth() === monthNum - 1)) {
          onChange?.(date)
          setMonth(date)
        }
      }
    }
  }

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
    setMonthVal(val)
    tryUpdateDate(val, dayVal, yearVal)
    if (val.length === 2) {
      setTimeout(() => {
        dayRef.current?.focus()
        dayRef.current?.select()
      }, 0)
    }
  }

  const handleDayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 2)
    setDayVal(val)
    tryUpdateDate(monthVal, val, yearVal)
    if (val.length === 2) {
      setTimeout(() => {
        yearRef.current?.focus()
        yearRef.current?.select()
      }, 0)
    }
  }

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 4)
    setYearVal(val)
    tryUpdateDate(monthVal, dayVal, val)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, segment: 'month' | 'day' | 'year') => {
    if (e.key === 'Backspace') {
      if (segment === 'day' && dayVal === '') {
        monthRef.current?.focus()
      } else if (segment === 'year' && yearVal === '') {
        dayRef.current?.focus()
      }
    }
  }

  const handleBlur = () => {
    if (value) {
      setMonthVal((value.getUTCMonth() + 1).toString().padStart(2, '0'))
      setDayVal(value.getUTCDate().toString().padStart(2, '0'))
      setYearVal(value.getUTCFullYear().toString())
    }
  }

  const years = React.useMemo(() => {
    const yearList = []
    for (let year = toYear; year >= fromYear; year--) {
      yearList.push(year)
    }
    return yearList
  }, [fromYear, toYear])

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]

  const handleSelect = (date: Date | undefined) => {
    onChange?.(date)
    if (date) {
      setOpen(false)
    }
  }

  const handleCalendarMonthChange = (monthValue: string) => {
    const newMonth = new Date(month)
    newMonth.setUTCMonth(parseInt(monthValue))
    setMonth(newMonth)
  }

  const handleCalendarYearChange = (yearValue: string) => {
    const newMonth = new Date(month)
    newMonth.setUTCFullYear(parseInt(yearValue))
    setMonth(newMonth)
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="flex items-center flex-1 h-11 px-3 rounded-md border border-gray-5 bg-gray-2 focus-within:border-amber-7 focus-within:bg-gray-3">
        <CalendarIcon className="h-4 w-4 text-amber-9 shrink-0 mr-2" />
        <input
          ref={monthRef}
          type="text"
          inputMode="numeric"
          placeholder="MM"
          value={monthVal}
          onChange={handleMonthChange}
          onKeyDown={(e) => handleKeyDown(e, 'month')}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-7 bg-transparent text-center outline-none placeholder:text-gray-8"
          data-testid={testId ? `${testId}-month` : undefined}
        />
        <span className="text-gray-8 mx-1">/</span>
        <input
          ref={dayRef}
          type="text"
          inputMode="numeric"
          placeholder="DD"
          value={dayVal}
          onChange={handleDayChange}
          onKeyDown={(e) => handleKeyDown(e, 'day')}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-7 bg-transparent text-center outline-none placeholder:text-gray-8"
          data-testid={testId ? `${testId}-day` : undefined}
        />
        <span className="text-gray-8 mx-1">/</span>
        <input
          ref={yearRef}
          type="text"
          inputMode="numeric"
          placeholder="YYYY"
          value={yearVal}
          onChange={handleYearChange}
          onKeyDown={(e) => handleKeyDown(e, 'year')}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-12 bg-transparent text-center outline-none placeholder:text-gray-8"
          data-testid={testId ? `${testId}-year` : undefined}
        />
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled}
            className="h-11 w-11 shrink-0 border-gray-5 bg-gray-2 hover:bg-gray-3 hover:border-amber-7"
            data-testid={testId ? `${testId}-calendar` : undefined}
          >
            <CalendarIcon className="h-4 w-4 text-amber-9" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-gray-2 border-gray-5" align="end">
          <div className="p-3 space-y-3">
            <div className="flex gap-2">
              <Select
                value={month.getUTCMonth().toString()}
                onValueChange={handleCalendarMonthChange}
              >
                <SelectTrigger className="flex-1 h-9 bg-gray-3 border-gray-5">
                  <SelectValue placeholder="Month" />
                </SelectTrigger>
                <SelectContent className="bg-gray-2 border-gray-5 max-h-60">
                  {months.map((monthName, index) => (
                    <SelectItem key={monthName} value={index.toString()}>
                      {monthName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={month.getUTCFullYear().toString()}
                onValueChange={handleCalendarYearChange}
              >
                <SelectTrigger className="w-24 h-9 bg-gray-3 border-gray-5">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent className="bg-gray-2 border-gray-5 max-h-60">
                  {years.map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DayPicker
              mode="single"
              selected={value}
              onSelect={handleSelect}
              month={month}
              onMonthChange={setMonth}
              showOutsideDays={true}
              disableNavigation={true}
              className="p-0"
              classNames={{
                months: "flex flex-col",
                month: "space-y-3",
                caption: "hidden",
                table: "w-full border-collapse",
                head_row: "flex",
                head_cell: "text-gray-10 rounded-md w-9 font-medium text-xs",
                row: "flex w-full mt-1",
                cell: cn(
                  "relative h-9 w-9 text-center text-sm p-0",
                  "focus-within:relative focus-within:z-20"
                ),
                day: cn(
                  buttonVariants({ variant: "ghost" }),
                  "h-9 w-9 p-0 font-normal hover:bg-gray-4 aria-selected:opacity-100"
                ),
                day_range_end: "day-range-end",
                day_selected:
                  "bg-amber-9 text-gray-1 hover:bg-amber-10 hover:text-gray-1 focus:bg-amber-9 focus:text-gray-1",
                day_today: "bg-gray-4 text-foreground",
                day_outside: "text-gray-8 aria-selected:bg-amber-9/50 aria-selected:text-gray-10",
                day_disabled: "text-gray-7 opacity-50",
                day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                day_hidden: "invisible",
              }}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
