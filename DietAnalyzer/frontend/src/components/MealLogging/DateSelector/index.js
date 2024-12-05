import React, { useState } from 'react';
import { format, addDays, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DateSelector = ({ selectedDate, onDateChange }) => {
  const [calendarOpen, setCalendarOpen] = useState(false);

  const navigateDay = (direction) => {
    const newDate = direction === 'prev' 
      ? subDays(selectedDate, 1)
      : addDays(selectedDate, 1);
    onDateChange(newDate);
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-emerald-100 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2 p-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDay('prev')}
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[200px] flex items-center justify-center gap-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 text-emerald-700 font-medium transition-all duration-200"
            >
              <CalendarIcon className="h-4 w-4 text-emerald-600" />
              {format(selectedDate, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-auto p-0 bg-white/95 backdrop-blur-sm border-emerald-100 shadow-xl rounded-xl" 
            align="center"
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                setCalendarOpen(false);
              }}
              initialFocus
              className="rounded-lg"
              classNames={{
                day_selected: "bg-emerald-600 text-white hover:bg-emerald-700",
                day_today: "bg-emerald-100 text-emerald-900",
                day: "hover:bg-emerald-50 hover:text-emerald-900",
                head_cell: "text-emerald-600 font-medium",
                nav_button: "hover:bg-emerald-50 text-emerald-600 hover:text-emerald-700",
                nav_button_previous: "hover:bg-emerald-50",
                nav_button_next: "hover:bg-emerald-50"
              }}
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDay('next')}
          className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;