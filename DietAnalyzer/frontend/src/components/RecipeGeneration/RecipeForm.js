import React, { useCallback, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import RecipeCard from './RecipeCard';
import IngredientList from './IngredientList';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const RecipeForm = ({ defaultMode = 'neither' }) => {
  const [useIngredients, setUseIngredients] = useState(false);
  const [usePreferences, setUsePreferences] = useState(false);
  const [selectedDietary, setSelectedDietary] = useState([]);
  const [healthCondition, setHealthCondition] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [allRecipes, setAllRecipes] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [lastGeneratedIngredients, setLastGeneratedIngredients] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();
  const accessToken = useSelector(state => state.user.accessToken);

  const dietaryOptions = [
    { id: 'high-protein', label: 'High Protein' },
    { id: 'low-carb', label: 'Low Carb' },
    { id: 'high-carb', label: 'High Carb' },
    { id: 'balanced', label: 'Balanced' },
    { id: 'keto', label: 'Keto' },
  ];

  const handleIngredientRemove = useCallback((index) => {
    setIngredients(prevIngredients => 
      prevIngredients.filter((_, i) => i !== index)
    );
    
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentIngredient('');
    }
  }, [editingIndex]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(e);
  };

  const handleIngredientEdit = (index) => {
    setCurrentIngredient(ingredients[index]);
    setEditingIndex(index);
  };

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

  const resetForm = () => {
    setCurrentIngredient('');
    setEditingIndex(null);
  };


  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (currentIngredient.trim()) {
      const newIngredient = currentIngredient.trim();
      
      // Check for duplicates
      if (ingredients.includes(newIngredient)) {
        toast({
          title: "Warning",
          description: "This ingredient has already been added",
          variant: "warning",
        });
        return;
      }

      if (editingIndex !== null) {
        const updatedIngredients = [...ingredients];
        updatedIngredients[editingIndex] = newIngredient;
        setIngredients(updatedIngredients);
        setEditingIndex(null);
      } else {
        setIngredients(prev => [...prev, newIngredient]);
      }
      setCurrentIngredient('');
    }
  };

  const validateForm = () => {
    if (!useIngredients && !usePreferences) {
      toast({
        title: "Error",
        description: "Please select either Available Ingredients or Preferences",
        variant: "destructive",
      });
      return false;
    }

    if (useIngredients && ingredients.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one ingredient",
        variant: "destructive",
      });
      return false;
    }

    if (useIngredients && ingredients.length < 3) {
      toast({
        title: "Warning",
        description: "You might need more ingredients for a complete recipe",
        variant: "warning",
      });
    }

    if (usePreferences) {
      if (selectedDietary.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one dietary preference",
          variant: "destructive",
        });
        return false;
      }

      if (!activityLevel) {
        toast({
          title: "Error",
          description: "Please select an activity level",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
  
    // Check if anything has changed that would warrant new recipes
    const shouldGenerateNewRecipes = () => {
      // If this is the first recipe generation
      if (allRecipes.length === 0) {
        return true;
      }
  
      const lastRecipeSet = allRecipes[allRecipes.length - 1];
      const lastPreferences = lastRecipeSet.preferences;
  
      // Compare current state with last generation
      const preferencesChanged = 
        JSON.stringify({
          dietaryNeeds: usePreferences ? selectedDietary : [],
          healthCondition: healthCondition.trim(),
          activityLevel: usePreferences ? activityLevel : '',
          ingredients: useIngredients ? ingredients : []
        }) !== JSON.stringify(lastPreferences);
  
      return preferencesChanged;
    };
  
    if (!shouldGenerateNewRecipes()) {
      toast({
        title: "No Changes",
        description: "Please modify your ingredients or preferences before generating new recipes",
        variant: "warning",
      });
      return;
    }
  
    setLoading(true);
    
    try {
      const preferences = {
        dietaryNeeds: usePreferences ? selectedDietary : [],
        healthCondition: healthCondition.trim(),
        activityLevel: usePreferences ? activityLevel : '',
        ingredients: useIngredients ? ingredients : []
      };
  
      const formData = { preferences };
      
      const response = await axios.post(`${API_BASE_URL}/recipes/generate`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      
      if (response.data.data.recipes) {
        const newRecipes = {
          timestamp: new Date().toISOString(),
          recipes: response.data.data.recipes,
          preferences: preferences,
          ingredientsUsed: [...ingredients]
        };
        
        setAllRecipes(prev => [...prev, newRecipes]);
        resetForm();
        
        toast({
          title: "Success",
          description: "Recipes generated successfully",
        });
      } else {
        throw new Error("No recipes returned from server");
      }
    } catch (err) {
      console.error('Error details:', err.response?.data || err);
      toast({
        title: "Error",
        description: err.response?.data?.message || "Failed to generate recipes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Card className="bg-white/90 backdrop-blur-sm border-emerald-100 shadow-xl">
        <CardHeader className="border-b border-emerald-100">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Recipe Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 pt-6">
          {/* Mode Selection */}
          <div className="space-y-4 bg-emerald-50/50 p-4 rounded-xl">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="useIngredients"
                checked={useIngredients}
                onCheckedChange={setUseIngredients}
                className="border-emerald-400 text-emerald-600 data-[state=checked]:bg-emerald-600"
              />
              <label htmlFor="useIngredients" className="text-sm font-medium text-emerald-800">
                Use Available Ingredients
              </label>
            </div>
            
            <div className="flex items-center space-x-3">
              <Checkbox
                id="usePreferences"
                checked={usePreferences}
                onCheckedChange={setUsePreferences}
                className="border-emerald-400 text-emerald-600 data-[state=checked]:bg-emerald-600"
              />
              <label htmlFor="usePreferences" className="text-sm font-medium text-emerald-800">
                Use Dietary Preferences
              </label>
            </div>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-8">
            {/* Ingredients Section */}
            {useIngredients && (
              <div className="space-y-4" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-semibold text-emerald-800">Available Ingredients</h3>
                <div className="flex gap-3">
                  <Input
                    type="text"
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    placeholder="Enter an ingredient"
                    className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <Button 
                    type="button"
                    onClick={handleAddIngredient}
                    className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-200"
                  >
                    {editingIndex !== null ? 'Update' : 'Add'}
                  </Button>
                </div>
                <IngredientList
                  ingredients={ingredients}
                  onEdit={handleIngredientEdit}
                  onRemove={handleIngredientRemove}
                />
              </div>
            )}

            {/* Preferences Section */}
            {usePreferences && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-800">Dietary Preferences</h3>
                  <div className="grid grid-cols-2 gap-4 bg-emerald-50/50 p-4 rounded-xl">
                    {dietaryOptions.map(option => (
                      <div key={option.id} className="flex items-center space-x-3">
                        <Checkbox
                          id={option.id}
                          checked={selectedDietary.includes(option.id)}
                          onCheckedChange={() => handleDietaryChange(option.id)}
                          className="border-emerald-400 text-emerald-600 data-[state=checked]:bg-emerald-600"
                        />
                        <label htmlFor={option.id} className="text-emerald-800">{option.label}</label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-emerald-800">Activity Level</h3>
                  <Select value={activityLevel} onValueChange={setActivityLevel}>
                    <SelectTrigger className="border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500">
                      <SelectValue placeholder="Select Activity Level" />
                    </SelectTrigger>
                    <SelectContent className="border-emerald-100">
                      {activityLevels.map(level => (
                        <SelectItem 
                          key={level.id} 
                          value={level.id}
                          className="focus:bg-emerald-50 focus:text-emerald-900"
                        >
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Health Conditions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-emerald-800">Health Conditions</h3>
              <Textarea
                value={healthCondition}
                onChange={(e) => setHealthCondition(e.target.value)}
                placeholder="Enter any health conditions or concerns..."
                className="min-h-[100px] border-emerald-200 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <Button 
              type="submit" 
              className={`w-full py-6 text-lg font-semibold rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 
                ${loading || (!useIngredients && !usePreferences) 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'}`}
              disabled={loading || (!useIngredients && !usePreferences)}
            >
              {loading ? 'Generating...' : 'Generate Recipes'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Recipe Sets Display */}
      {allRecipes.slice().reverse().map((recipeSet, index) => (
        <div key={recipeSet.timestamp} className="mt-8">
          <Card className="bg-white/90 backdrop-blur-sm border-emerald-100 shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="border-b border-emerald-100">
              <CardTitle className="text-xl font-semibold text-emerald-800">
                Recipe Set {allRecipes.length - index}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <RecipeCard 
                recipes={recipeSet.recipes} 
                preferences={recipeSet.preferences}
              />
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default RecipeForm;
