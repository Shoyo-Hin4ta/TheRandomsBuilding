import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const AllRecipes = () => {
  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>All Generated Recipes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your previously generated recipes will appear here. This feature will be implemented soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AllRecipes;