import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const CustomTooltip = ({ active, payload, label, chartType }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 border border-emerald-200 rounded-lg p-3 shadow-lg">
        <p className="font-medium text-emerald-800">{label}</p>
        {chartType === "calories" ? (
          <p className="text-emerald-600">
            {payload[0].value.toFixed(0)} calories
          </p>
        ) : (
          <div className="space-y-1">
            <p className="text-emerald-600">
              Protein: {payload[0].value.toFixed(1)}g
            </p>
            <p className="text-emerald-600">
              Carbs: {payload[1].value.toFixed(1)}g
            </p>
            <p className="text-emerald-600">
              Fat: {payload[2].value.toFixed(1)}g
            </p>
          </div>
        )}
      </div>
    );
  }
  return null;
};

const NoDataDisplay = () => (
  <div className="h-[400px] w-full flex items-center justify-center">
    <p className="text-emerald-600/70 text-center">
      No nutrition data available for the selected date range
    </p>
  </div>
);

const NutritionChart = ({ nutritionData, onDateRangeChange, isLoading }) => {
  const [chartType, setChartType] = useState("calories");
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date()
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    onDateRangeChange(dateRange);
  }, []);

  const handleDateSelect = (range) => {
    const newRange = {
      from: range?.from || new Date(),
      to: range?.to || range?.from || new Date()
    };
    
    setDateRange(newRange);
    onDateRangeChange(newRange);
    
    if (newRange.from && newRange.to) {
      setIsCalendarOpen(false);
    }
  };

  const formatDateRange = () => {
    if (!dateRange.from || !dateRange.to) {
      return "Select dates";
    }

    const fromStr = format(dateRange.from, "MMM dd, yyyy");
    const toStr = format(dateRange.to, "MMM dd, yyyy");

    return fromStr === toStr ? fromStr : `${fromStr} - ${toStr}`;
  };

  const renderChart = () => {
    if (isLoading) {
      return (
        <div className="h-[400px] w-full flex items-center justify-center">
          <div className="animate-pulse text-emerald-600">Loading...</div>
        </div>
      );
    }

    if (!nutritionData?.length) {
      return <NoDataDisplay />;
    }

    return (
      <ResponsiveContainer width="100%" height={400}>
        {chartType === "calories" ? (
          <LineChart data={nutritionData}>
            <XAxis 
              dataKey="date" 
              stroke="#059669"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
              tickMargin={30}
            />
            <YAxis 
              stroke="#059669"
              fontSize={12}
              tickFormatter={(value) => `${value}cal`}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} chartType={chartType} />} />
            <Line 
              type="monotone" 
              dataKey="calories" 
              stroke="#059669"
              strokeWidth={2}
              dot={{ fill: '#059669', r: 4 }}
              activeDot={{ r: 6, fill: '#047857' }}
            />
          </LineChart>
        ) : (
          <BarChart data={nutritionData}>
            <XAxis 
              dataKey="date" 
              stroke="#059669"
              fontSize={12}
              angle={-45}
              textAnchor="end"
              height={60}
              tickMargin={30}
            />
            <YAxis 
              stroke="#059669"
              fontSize={12}
              tickFormatter={(value) => `${value}g`}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} chartType={chartType} />} />
            <Bar dataKey="protein" stackId="a" fill="#059669" />
            <Bar dataKey="carbohydrates" stackId="a" fill="#10b981" />
            <Bar dataKey="fat" stackId="a" fill="#34d399" />
          </BarChart>
        )}
      </ResponsiveContainer>
    );
  };

  return (
    <Card className="mb-4 bg-white/80 backdrop-blur-sm border-emerald-100 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2 border-b border-emerald-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle className="text-lg font-semibold text-emerald-800">
            Nutrition Insights
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-start text-left font-normal bg-white/80 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formatDateRange()}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-white border-emerald-100" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={handleDateSelect}
                  numberOfMonths={2}
                  className="rounded-md bg-white"
                  classNames={{
                    months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                    month: "space-y-4",
                    caption: "flex justify-center pt-1 relative items-center",
                    caption_label: "text-sm font-medium text-emerald-900",
                    nav: "space-x-1 flex items-center",
                    nav_button: "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 hover:bg-emerald-50 text-emerald-800 rounded-md",
                    nav_button_previous: "absolute left-1",
                    nav_button_next: "absolute right-1",
                    table: "w-full border-collapse space-y-1",
                    head_row: "flex",
                    head_cell: "text-emerald-600 rounded-md w-8 sm:w-9 font-normal text-[0.8rem]",
                    row: "flex w-full mt-2",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-emerald-50",
                    day: "h-8 w-8 sm:h-9 sm:w-9 p-0 font-normal aria-selected:opacity-100 hover:bg-emerald-50 rounded-md",
                    day_range_start: "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white rounded-md",
                    day_range_end: "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white rounded-md",
                    day_selected: "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white rounded-md",
                    day_today: "bg-emerald-50 text-emerald-900",
                    day_outside: "text-gray-300 opacity-50",
                    day_disabled: "text-gray-300",
                    day_range_middle: "aria-selected:bg-emerald-50 aria-selected:text-emerald-900",
                    day_hidden: "invisible",
                  }}
                />
              </PopoverContent>
            </Popover>

            <Tabs defaultValue="calories" value={chartType} onValueChange={setChartType}>
              <TabsList className="bg-emerald-50 border border-emerald-100">
                <TabsTrigger 
                  value="calories" 
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 text-emerald-700"
                >
                  Calories
                </TabsTrigger>
                <TabsTrigger 
                  value="macros" 
                  className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-900 text-emerald-700"
                >
                  Macros
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        {renderChart()}
      </CardContent>
    </Card>
  );
};

export default NutritionChart;