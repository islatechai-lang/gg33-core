import * as React from "react"
import { Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface TimePickerProps {
  value?: string
  onChange?: (time: string) => void
  className?: string
  disabled?: boolean
  "data-testid"?: string
}

export function TimePicker({
  value,
  onChange,
  className,
  disabled,
  "data-testid": testId,
}: TimePickerProps) {
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: "", minute: "", period: "AM" }
    
    const [hourPart, minutePart] = timeStr.split(":")
    let hour24 = parseInt(hourPart, 10)
    const minute = minutePart || ""
    
    if (isNaN(hour24)) return { hour: "", minute: "", period: "AM" }
    
    const period = hour24 >= 12 ? "PM" : "AM"
    let hour12 = hour24 % 12
    if (hour12 === 0) hour12 = 12
    
    return {
      hour: hour12.toString().padStart(2, "0"),
      minute: minute.padStart(2, "0"),
      period,
    }
  }

  const initialParsed = parseTime(value || "")
  const [hourVal, setHourVal] = React.useState(initialParsed.hour)
  const [minuteVal, setMinuteVal] = React.useState(initialParsed.minute)
  const [period, setPeriod] = React.useState<"AM" | "PM">(initialParsed.period as "AM" | "PM")

  const hourRef = React.useRef<HTMLInputElement>(null)
  const minuteRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (value) {
      const parsed = parseTime(value)
      setHourVal(parsed.hour)
      setMinuteVal(parsed.minute)
      setPeriod(parsed.period as "AM" | "PM")
    }
  }, [value])

  const updateTime = (h: string, m: string, p: "AM" | "PM") => {
    if (h.length === 2 && m.length === 2) {
      let hour12 = parseInt(h, 10)
      const minute = parseInt(m, 10)
      
      if (hour12 >= 1 && hour12 <= 12 && minute >= 0 && minute <= 59) {
        let hour24 = hour12
        if (p === "AM") {
          if (hour12 === 12) hour24 = 0
        } else {
          if (hour12 !== 12) hour24 = hour12 + 12
        }
        
        const timeStr = `${hour24.toString().padStart(2, "0")}:${m}`
        onChange?.(timeStr)
      }
    }
  }

  const handleHourChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2)
    
    if (val.length === 2) {
      const num = parseInt(val, 10)
      if (num > 12) val = "12"
      if (num === 0) val = "12"
    }
    
    setHourVal(val)
    updateTime(val, minuteVal, period)
    
    if (val.length === 2) {
      setTimeout(() => {
        minuteRef.current?.focus()
        minuteRef.current?.select()
      }, 0)
    }
  }

  const handleMinuteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, "").slice(0, 2)
    
    if (val.length === 2) {
      const num = parseInt(val, 10)
      if (num > 59) val = "59"
    }
    
    setMinuteVal(val)
    updateTime(hourVal, val, period)
  }

  const handlePeriodToggle = () => {
    const newPeriod = period === "AM" ? "PM" : "AM"
    setPeriod(newPeriod)
    updateTime(hourVal, minuteVal, newPeriod)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, segment: "hour" | "minute") => {
    if (e.key === "Backspace") {
      if (segment === "minute" && minuteVal === "") {
        hourRef.current?.focus()
      }
    }
  }

  const handleBlur = () => {
    if (hourVal && hourVal.length === 1) {
      setHourVal(hourVal.padStart(2, "0"))
    }
    if (minuteVal && minuteVal.length === 1) {
      setMinuteVal(minuteVal.padStart(2, "0"))
    }
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <div className="flex items-center flex-1 h-11 px-3 rounded-md border border-gray-5 bg-gray-2 focus-within:border-amber-7 focus-within:bg-gray-3">
        <Clock className="h-4 w-4 text-amber-9 shrink-0 mr-2" />
        <input
          ref={hourRef}
          type="text"
          inputMode="numeric"
          placeholder="HH"
          value={hourVal}
          onChange={handleHourChange}
          onKeyDown={(e) => handleKeyDown(e, "hour")}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-7 bg-transparent text-center outline-none placeholder:text-gray-8"
          data-testid={testId ? `${testId}-hour` : undefined}
        />
        <span className="text-gray-8 mx-1">:</span>
        <input
          ref={minuteRef}
          type="text"
          inputMode="numeric"
          placeholder="MM"
          value={minuteVal}
          onChange={handleMinuteChange}
          onKeyDown={(e) => handleKeyDown(e, "minute")}
          onBlur={handleBlur}
          disabled={disabled}
          className="w-7 bg-transparent text-center outline-none placeholder:text-gray-8"
          data-testid={testId ? `${testId}-minute` : undefined}
        />
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={handlePeriodToggle}
        disabled={disabled}
        className="h-11 w-16 shrink-0 border-gray-5 bg-gray-2 font-medium"
        data-testid={testId ? `${testId}-period` : undefined}
      >
        {period}
      </Button>
    </div>
  )
}
