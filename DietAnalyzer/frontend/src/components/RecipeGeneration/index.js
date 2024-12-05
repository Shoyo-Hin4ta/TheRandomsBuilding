import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChefHat, BookOpen, Sparkles } from 'lucide-react';

const RecipeGeneration = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-br from-emerald-50 to-teal-50">
      <div className="text-center mb-12 relative">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl"></div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          Smart Recipe Generator
        </h1>
        <p className="text-emerald-700 text-lg">
          Personalized recipes tailored just for you
        </p>
      </div>

      <Card className="w-full max-w-md bg-white/80 backdrop-blur-sm border-emerald-100 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardContent className="space-y-4 p-6">
          <Button
            variant="default"
            className="w-full h-20 text-lg relative overflow-hidden group bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 rounded-xl shadow-md hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300"
            onClick={() => navigate('/recipe-form')}
          >
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            <ChefHat className="w-7 h-7 absolute left-6 group-hover:scale-110 transition-transform duration-300" />
            <Sparkles className="w-5 h-5 absolute right-6 opacity-0 group-hover:opacity-100 transition-all duration-300" />
            <span className="ml-6 font-semibold">Generate Custom Recipes</span>
          </Button>
          
          <Button
            variant="outline"
            className="w-full h-20 text-lg relative overflow-hidden group border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all duration-300"
            onClick={() => navigate('/all-recipes')}
          >
            <BookOpen className="w-7 h-7 absolute left-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />
            <span className="ml-6 font-semibold">View All Generated Recipes</span>
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8 text-emerald-600 text-center max-w-sm">
        <p className="text-sm">
          Discover delicious and healthy recipes customized to your preferences and dietary needs
        </p>
      </div>

      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl -z-10"></div>
      <div className="fixed top-0 right-0 w-96 h-96 bg-teal-100/50 rounded-full blur-3xl -z-10"></div>
    </div>
  );
};

export default RecipeGeneration;