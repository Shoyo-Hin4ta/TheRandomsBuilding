import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from '@/hooks/use-toast';
import axios from 'axios';
import RecipeCard from '../RecipeCard';
import { UtensilsCrossed } from 'lucide-react';
import { useSelector } from 'react-redux';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;


const AllRecipes = () => {


  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const accessToken = useSelector(state => state.user.accessToken);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/recipes/all`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        setRecipes(response.data.data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch recipes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [toast]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="bg-white/80 backdrop-blur-sm border-emerald-100">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-emerald-800 font-medium">Loading your recipes...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!recipes?.length) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <Card className="bg-white/80 backdrop-blur-sm border-emerald-100">
          <CardHeader className="text-center pb-6 border-b border-emerald-100">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Your Recipe Collection
            </CardTitle>
          </CardHeader>
          <CardContent className="p-12">
            <div className="flex flex-col items-center justify-center space-y-4">
              <UtensilsCrossed className="h-16 w-16 text-emerald-200" />
              <p className="text-emerald-800 text-lg font-medium">
                No recipes found
              </p>
              <p className="text-emerald-600 text-center max-w-md">
                Generate some delicious recipes to start building your collection!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <Card className="bg-white/80 backdrop-blur-sm border-emerald-100">
        <CardHeader className="border-b border-emerald-100">
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Your Recipe Collection
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-8">
            {recipes.map((recipe, index) => (
              <div 
                key={recipe._id} 
                className={`${
                  index !== 0 ? 'border-t border-emerald-100 pt-8' : ''
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                    Generated on {new Date(recipe.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <RecipeCard recipes={recipe.recipes} />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllRecipes;