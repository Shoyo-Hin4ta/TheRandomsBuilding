import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '@/store/slice/userSlice';
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import NutritionChart from './NutritionChart';
import { Alert, AlertDescription } from '@/components/ui/alert';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const Analysis = () => {
  const [nutritionData, setNutritionData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const currentUser = useSelector(selectCurrentUser);
  const { toast } = useToast();

  const fetchNutritionData = async (dateRange) => {
    if (!dateRange?.from || !dateRange?.to) {
      console.log('Invalid date range:', dateRange);
      return;
    }
  
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/meals/nutrition`,
        { 
          params: {
            startDate: dateRange.from.toISOString(),
            endDate: dateRange.to.toISOString()
          },
          withCredentials: true 
        }
      );
      setNutritionData(response.data.data);
    } catch (error) {
      console.error('Error fetching nutrition data:', error);
      setError(error.response?.data?.message || "Failed to fetch nutrition data");
      toast({
        title: "Error",
        description: "Failed to fetch nutrition data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="m-4 bg-red-50 border-red-200 text-red-700">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="w-full max-w-4xl mx-auto p-4 pb-24">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Nutrition Analysis
        </h1>

        <div className="grid gap-4">
          <NutritionChart 
            nutritionData={nutritionData}
            onDateRangeChange={fetchNutritionData}
            isLoading={isLoading}
          />

        </div>
      </div>
    </div>
  );
};

export default Analysis;