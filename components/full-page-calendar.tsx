'use client'

import { useState } from 'react'
import { addDays, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type CalendarItem = {
  id: string
  date: Date
  title: string
  amount: number
  category: 'work' | 'personal' | 'family' | 'other'
}

const categoryColors = {
  work: 'bg-blue-200',
  personal: 'bg-green-200',
  family: 'bg-yellow-200',
  other: 'bg-purple-200',
}

export function FullPageCalendarComponent() {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [items, setItems] = useState<CalendarItem[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(monthStart)
  const startDate = addDays(monthStart, -1)
  const endDate = addDays(monthEnd, 7 - monthEnd.getDay())

  const days = eachDayOfInterval({ start: startDate, end: endDate })

  const addItem = (newItem: CalendarItem) => {
    setItems([...items, newItem])
    setIsModalOpen(false)
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setIsModalOpen(true)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{format(currentMonth, 'MMMM yyyy')}</h2>
        <div>
          <Button onClick={() => setCurrentMonth(addDays(currentMonth, -30))} className="mr-2">Previous</Button>
          <Button onClick={() => setCurrentMonth(addDays(currentMonth, 30))}>Next</Button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center font-bold p-2">{day}</div>
        ))}
        {days.map((day, dayIdx) => (
          <div
            key={day.toString()}
            className={`min-h-[100px] border p-2 ${
              isSameMonth(day, currentMonth) ? 'bg-white' : 'bg-gray-100'
            }`}
            onClick={() => handleDayClick(day)}
          >
            <div className="font-semibold">{format(day, 'd')}</div>
            {items
              .filter((item) => isSameDay(item.date, day))
              .map((item) => (
                <div
                  key={item.id}
                  className={`${categoryColors[item.category]} p-1 mb-1 rounded text-sm`}
                >
                  <div>{item.title}</div>
                  <div>{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(item.amount)}</div>
                </div>
              ))}
          </div>
        ))}
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Item for {selectedDate && format(selectedDate, 'MMMM d, yyyy')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            addItem({
              id: Math.random().toString(36).substr(2, 9),
              date: selectedDate!,
              title: formData.get('title') as string,
              amount: parseFloat(formData.get('amount') as string),
              category: formData.get('category') as 'work' | 'personal' | 'family' | 'other',
            })
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" name="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input id="amount" name="amount" type="number" step="0.01" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select name="category">
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="work">Work</SelectItem>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="family">Family</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit">Add Item</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}