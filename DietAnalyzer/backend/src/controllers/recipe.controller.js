import OpenAI from 'openai';
import Recipe from '../models/recipe.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const openai = new OpenAI();

const generateRecipesPrompt = (preferences) => {
  const { ingredients, dietaryNeeds, healthCondition, activityLevel } = preferences;
  let basePrompt = '';

  // Case 1: Only ingredients
  if (ingredients?.length > 0 && dietaryNeeds?.length === 0) {
      basePrompt = `Generate 3 recipes using ONLY these available ingredients: ${ingredients.join(', ')}

      IMPORTANT: If it's not possible to create complete recipes using only these ingredients, respond with a JSON object containing a single recipe with name: "Not Possible" and directions explaining why these ingredients alone cannot make complete recipes.
      
      Each recipe must use ONLY the listed ingredients. No additional ingredients are allowed.
      Provide recipes in JSON format with name and detailed directions with exact measurements.`;
  }
  
  // Case 2: Only dietary preferences
  else if (dietaryNeeds?.length > 0 && ingredients?.length === 0) {
      basePrompt = `Generate 3 recipes that are suitable for someone with the following requirements:
      - Dietary needs: ${dietaryNeeds.join(', ')}
      ${healthCondition ? `- Health conditions: ${healthCondition}` : ''}
      - Activity level: ${activityLevel}
      
      Provide recipes in JSON format with name and detailed directions with exact measurements.
      Consider nutritional balance and portion sizes appropriate for the specified activity level.`;
  }
  
  // Case 3: Both
  else {
      basePrompt = `Generate 3 recipes that:
      1. Make optimal use of these available ingredients: ${ingredients.join(', ')}
      2. Meet these dietary requirements:
         - Dietary needs: ${dietaryNeeds.join(', ')}
         ${healthCondition ? `- Health conditions: ${healthCondition}` : ''}
         - Activity level: ${activityLevel}
      
      Additional ingredients can be suggested if needed to complete the recipes.
      Provide recipes in JSON format with name and detailed directions with exact measurements.
      Consider nutritional balance and portion sizes appropriate for the specified activity level.`;
  }

  return basePrompt;
};

export const generateRecipes = async (req, res, next) => {
  try {
      const { preferences } = req.body;

      if (!preferences) {
          throw new ApiError(400, "Missing required field: preferences");
      }

      const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          messages: [
              {
                  role: "system",
                  content: "You are a professional chef and nutritionist who creates detailed, healthy recipes with exact measurements, taking into account dietary needs, health conditions, and available ingredients."
              },
              {
                  role: "user",
                  content: generateRecipesPrompt(preferences)
              }
          ],
          response_format: {
              type: "json_schema",
              json_schema: {
                  name: "recipe_schema",
                  schema: {
                      type: "object",
                      properties: {
                          recipes: {
                              type: "array",
                              items: {
                                  type: "object",
                                  properties: {
                                      name: {
                                          type: "string",
                                          description: "Name of the recipe"
                                      },
                                      directions: {
                                          type: "string",
                                          description: "Detailed cooking instructions with measurements"
                                      },
                                      additionalIngredients: {
                                          type: "array",
                                          items: { 
                                              type: "string" 
                                          },
                                          description: "Additional ingredients needed (if using available ingredients)"
                                      }
                                  },
                                  required: ["name", "directions"]
                              }
                          }
                      },
                      required: ["recipes"]
                  }
              }
          }
      });

      let parsedContent;
      try {
          parsedContent = JSON.parse(completion.choices[0].message.content);
          console.log('Parsed OpenAI response:', parsedContent);

          if (!parsedContent.recipes || !Array.isArray(parsedContent.recipes)) {
              throw new Error('Invalid response format from OpenAI');
          }

          // Validate and clean each recipe
          const cleanedRecipes = parsedContent.recipes.map(recipe => ({
              name: String(recipe.name).trim(),
              directions: String(recipe.directions).trim(),
              additionalIngredients: Array.isArray(recipe.additionalIngredients) 
                  ? recipe.additionalIngredients.map(String)
                  : []
          }));

          // Create and save recipe document
          const recipeDoc = new Recipe({
              user: req.user._id,
              recipes: cleanedRecipes,
              preferences
          });

          await recipeDoc.save();

          return res.status(201).json(
              new ApiResponse(201, { recipes: cleanedRecipes }, "Recipes generated successfully")
          );

      } catch (parseError) {
          console.error('OpenAI Response:', completion.choices[0].message.content);
          console.error('Parse Error:', parseError);
          throw new ApiError(500, "Failed to parse recipe data from OpenAI");
      }

  } catch (error) {
      console.error('Full error:', error);

      if (error instanceof ApiError) {
          return res.status(error.statusCode).json({
              success: false,
              message: error.message,
              errors: error.errors
          });
      }

      if (error?.error?.type === 'invalid_request_error') {
          return res.status(400).json(
              new ApiResponse(400, null, `OpenAI API Error: ${error.error.message}`)
          );
      }

      return res.status(500).json(
          new ApiResponse(500, null, "An error occurred while generating recipes", error?.message || "Unknown error")
      );
  }
};

export const getUserRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    if (!recipes?.length) {
      return res.status(200).json(
        new ApiResponse(200, [], "No recipes found")
      );
    }

    return res.status(200).json(
      new ApiResponse(200, recipes, "Recipes retrieved successfully")
    );

  } catch (error) {
    throw new ApiError(
      500, 
      "Error occurred while fetching recipes", 
      error?.message || "Unknown error"
    );
  }
};

export const getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Recipe ID is required");
    }

    // Add user check to ensure they can only access their own recipes
    const recipe = await Recipe.findOne({
      _id: id,
      user: req.user._id
    });

    if (!recipe) {
      throw new ApiError(404, "Recipe not found");
    }

    return res.status(200).json(
      new ApiResponse(200, recipe, "Recipe retrieved successfully")
    );

  } catch (error) {
    if (error.name === 'CastError') {
      throw new ApiError(400, "Invalid recipe ID format");
    }
    throw new ApiError(
      500, 
      "Error occurred while fetching recipe", 
      error?.message || "Unknown error"
    );
  }
};