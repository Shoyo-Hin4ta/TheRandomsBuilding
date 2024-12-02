import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import IngredientList from './IngredientList';
import RecipeCard from '../DietaryRecipes/RecipeCard';
// import api from '@/utils/axios';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const IngredientRecipes = () => {
    const [ingredients, setIngredients] = useState([]);
    const [currentIngredient, setCurrentIngredient] = useState('');
    const [editingIndex, setEditingIndex] = useState(null);
    const [recipes, setRecipes] = useState(null);
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    const navigate = useNavigate();

  const handleAddIngredient = (e) => {
    e.preventDefault();
    if (currentIngredient.trim()) {
      if (editingIndex !== null) {
        const updatedIngredients = [...ingredients];
        updatedIngredients[editingIndex] = currentIngredient.trim();
        setIngredients(updatedIngredients);
        setEditingIndex(null);
      } else {
        setIngredients([...ingredients, currentIngredient.trim()]);
      }
      setCurrentIngredient('');
    }
  };

  const handleEdit = (index) => {
    setCurrentIngredient(ingredients[index]);
    setEditingIndex(index);
  };

  const handleRemove = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
    if (editingIndex === index) {
      setEditingIndex(null);
      setCurrentIngredient('');
    }
  };

  const handleGenerateRecipes = async () => {
    setLoading(true);

    try {
        const formData = {
            type: 'ingredients',
            preferences: {
                ingredients
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
          <CardTitle>Ingredient Based Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddIngredient} className="space-y-6">
            <div className="flex gap-2">
              <Input
                type="text"
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                placeholder="Enter an ingredient"
              />
              <Button type="submit">
                {editingIndex !== null ? 'Update' : 'Add'}
              </Button>
            </div>
          </form>

          <IngredientList
            ingredients={ingredients}
            onEdit={handleEdit}
            onRemove={handleRemove}
          />

{ingredients.length > 0 && (
            <Button
              onClick={handleGenerateRecipes}
              className="w-full mt-6"
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
          )}
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

export default IngredientRecipes;