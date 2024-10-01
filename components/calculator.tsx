"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function CalculatorComponent() {
  const [display, setDisplay] = useState("0")
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [shouldResetDisplay, setShouldResetDisplay] = useState(false)

  const handleNumberClick = (num: string) => {
    if (display === "0" || shouldResetDisplay) {
      setDisplay(num)
      setShouldResetDisplay(false)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperationClick = (op: string) => {
    if (previousValue === null) {
      setPreviousValue(parseFloat(display))
    } else if (operation) {
      const result = performCalculation()
      setPreviousValue(result)
      setDisplay(result.toString())
    }
    setOperation(op)
    setShouldResetDisplay(true)
  }

  const handleEqualClick = () => {
    if (previousValue !== null && operation) {
      const result = performCalculation()
      setDisplay(result.toString())
      setPreviousValue(null)
      setOperation(null)
    }
  }

  const performCalculation = (): number => {
    const current = parseFloat(display)
    switch (operation) {
      case "+":
        return previousValue! + current
      case "-":
        return previousValue! - current
      case "*":
        return previousValue! * current
      case "/":
        return previousValue! / current
      default:
        return current
    }
  }

  const handleClear = () => {
    setDisplay("0")
    setPreviousValue(null)
    setOperation(null)
  }

  const buttons = [
    "7", "8", "9", "/",
    "4", "5", "6", "*",
    "1", "2", "3", "-",
    "0", ".", "=", "+"
  ]

  return (
    <Card className="w-[300px]">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          className="text-right text-2xl mb-4"
          value={display}
          readOnly
        />
        <div className="grid grid-cols-4 gap-2">
          {buttons.map((btn) => (
            <Button
              key={btn}
              onClick={() => {
                if (btn === "=") handleEqualClick()
                else if (["+", "-", "*", "/"].includes(btn)) handleOperationClick(btn)
                else handleNumberClick(btn)
              }}
              className={btn === "=" ? "col-span-2" : ""}
            >
              {btn}
            </Button>
          ))}
          <Button
            onClick={handleClear}
            className="col-span-2"
            variant="destructive"
          >
            Clear
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}