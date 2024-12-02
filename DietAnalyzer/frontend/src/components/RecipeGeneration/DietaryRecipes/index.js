import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import RecipeCard from './RecipeCard';
// import api from '@/utils/axios';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const DietaryRecipes = () => {

  const [selectedDietary, setSelectedDietary] = useState([]);
  const [healthCondition, setHealthCondition] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [recipes, setRecipes] = useState(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  const dietaryOptions = [
    { id: 'high-protein', label: 'High Protein' },
    { id: 'low-carb', label: 'Low Carb' },
    { id: 'high-carb', label: 'High Carb' },
    { id: 'balanced', label: 'Balanced' },
    { id: 'keto', label: 'Keto' },
  ];

  const activityLevels = [
    { id: 'sedentary', label: 'Sedentary' },
    { id: 'moderate', label: 'Moderately Active' },
    { id: 'active', label: 'Highly Active' },
    { id: 'athlete', label: 'Athlete' },
  ];

  const handleDietaryChange = (optionId) => {
    setSelectedDietary(prev => 
      prev.includes(optionId) 
        ? prev.filter(id => id !== optionId)
        : [...prev, optionId]
    );
  };
  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = {
        type: 'dietary',
        preferences: {
          dietaryNeeds: selectedDietary,
          healthCondition,
          activityLevel,
        }
      };

      const response = await axios.post(`${API_BASE_URL}/recipes/generate`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setRecipes(response.data.recipes);
      toast({
        title: "Success",
        description: "Recipes generated successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: err.response?.data?.message || err.message,
        variant: "destructive",
      });
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Dietary Based Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Select Dietary Needs:</h3>
              <div className="grid grid-cols-2 gap-4">
                {dietaryOptions.map(option => (
                  <div key={option.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.id}
                      checked={selectedDietary.includes(option.id)}
                      onCheckedChange={() => handleDietaryChange(option.id)}
                    />
                    <label htmlFor={option.id}>
                      {option.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Activity Level:</h3>
              <Select
                value={activityLevel}
                onValueChange={setActivityLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Activity Level" />
                </SelectTrigger>
                <SelectContent>
                  {activityLevels.map(level => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Health Conditions:</h3>
              <Textarea
                value={healthCondition}
                onChange={(e) => setHealthCondition(e.target.value)}
                placeholder="Enter any health conditions or concerns..."
                className="min-h-[100px]"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <span className="loading loading-spinner"></span>
                  Generating...
                </div>
              ) : (
                'Generate Recipes'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Button 
            onClick={() => navigate('/recipe-generation')}
          >
            Go to Recipe Generation
          </Button>

      {recipes && <RecipeCard recipes={recipes} />}
    </div>
  );
};

export default DietaryRecipes;