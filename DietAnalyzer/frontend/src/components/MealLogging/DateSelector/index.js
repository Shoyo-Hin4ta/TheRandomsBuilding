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
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDay('prev')}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="min-w-[200px] flex items-center justify-center gap-2"
            >
              <CalendarIcon className="h-4 w-4" />
              {format(selectedDate, 'MMM dd, yyyy')}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="center">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => {
                onDateChange(date);
                setCalendarOpen(false);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigateDay('next')}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default DateSelector;