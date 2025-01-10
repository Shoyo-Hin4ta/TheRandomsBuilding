import OpenAI from 'openai';
import Recipe from '../models/recipe.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const openai = new OpenAI();

const generateRecipesPrompt = (preferences) => {
  const { ingredients, dietaryNeeds, healthCondition, activityLevel } = preferences;
  let basePrompt = '';

  // Case 1: Only ingredients
  if (ingredients?.length > 0 && !dietaryNeeds?.length) {
      basePrompt = `Generate exactly 3 unique recipes using these available ingredients: ${ingredients.join(', ')}

      IMPORTANT: You must generate exactly 3 recipes. If it's not possible to create 3 complete recipes using only these ingredients, suggest additional ingredients to make it possible.
      
      Each recipe must be different from the others and should include:
      - Exact measurements for all ingredients
      - Clear step-by-step instructions
      - Complete nutritional information
      - Any additional ingredients needed with amounts and reason why they're needed
      
      Focus on creating practical, balanced meals.`;
  }
  
  // Case 2: Only dietary preferences
  else if (dietaryNeeds?.length > 0 && !ingredients?.length) {
      basePrompt = `Generate exactly 3 unique recipes that are suitable for someone with the following requirements:
      - Dietary needs: ${dietaryNeeds.join(', ')}
      ${healthCondition ? `- Health conditions: ${healthCondition}` : ''}
      - Activity level: ${activityLevel}
      
      IMPORTANT: You must generate exactly 3 different recipes.
      Each recipe must include:
      - Exact measurements for all ingredients
      - Clear step-by-step instructions
      - Complete nutritional information appropriate for the specified activity level
      - Any additional ingredients needed with amounts and reason why they're needed`;
  }
  
  // Case 3: Both
  else {
      basePrompt = `Generate exactly 3 unique recipes that:
      1. Make optimal use of these available ingredients: ${ingredients.join(', ')}
      2. Meet these dietary requirements:
         - Dietary needs: ${dietaryNeeds.join(', ')}
         ${healthCondition ? `- Health conditions: ${healthCondition}` : ''}
         - Activity level: ${activityLevel}
      
      IMPORTANT: You must generate exactly 3 different recipes.
      Each recipe must include:
      - Exact measurements for all ingredients
      - Clear step-by-step instructions
      - Complete nutritional information appropriate for the activity level
      - Any additional ingredients needed with amounts and reason why they're needed
      
      Ensure that any additional ingredients complement the available ingredients while meeting the dietary requirements.`;
  }

  return basePrompt;
};

const validateAndCleanRecipes = (recipes) => {
  if (!Array.isArray(recipes) || recipes.length !== 3) {
    throw new ApiError(500, "Invalid number of recipes generated. Expected exactly 3.");
  }

  return recipes.map(recipe => ({
    name: String(recipe.name).trim(),
    directions: String(recipe.directions)
      .replace(/\\n/g, '\n')
      .trim(),
    additionalIngredients: recipe.additionalIngredients
      ?.filter(ingredient => ingredient && ingredient.name && ingredient.amount)
      ?.map(ingredient => 
        `${ingredient.name} (${ingredient.amount})${ingredient.reason ? ` - ${ingredient.reason}` : ''}`
      ) || [],
    nutritionalInfo: {
      calories: Number(recipe.nutritionalInfo.calories),
      protein: String(recipe.nutritionalInfo.protein || ''),
      carbs: String(recipe.nutritionalInfo.carbs || ''),
      fat: String(recipe.nutritionalInfo.fat || ''),
      servingSize: String(recipe.nutritionalInfo.servingSize)
    }
  }));
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
          content: "You are a professional chef and nutritionist who creates detailed, healthy recipes with exact measurements, taking into account dietary needs, health conditions, and available ingredients. You must always generate exactly 3 unique recipes."
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
                      description: "Detailed cooking instructions with exact measurements"
                    },
                    additionalIngredients: {
                      type: "array",
                      items: { 
                        type: "object",
                        properties: {
                          name: {
                            type: "string",
                            description: "Name of the additional ingredient"
                          },
                          amount: {
                            type: "string",
                            description: "Required amount with unit"
                          },
                          reason: {
                            type: "string",
                            description: "Why this ingredient is needed"
                          }
                        },
                        required: ["name", "amount"]
                      },
                      description: "Additional ingredients needed with amounts"
                    },
                    nutritionalInfo: {
                      type: "object",
                      properties: {
                        calories: { type: "number" },
                        protein: { type: "string" },
                        carbs: { type: "string" },
                        fat: { type: "string" },
                        servingSize: { type: "string" }
                      },
                      required: ["calories", "servingSize"]
                    }
                  },
                  required: ["name", "directions", "additionalIngredients", "nutritionalInfo"],
                  additionalProperties: false
                },
                minItems: 3,
                maxItems: 3
              }
            },
            required: ["recipes"],
            additionalProperties: false
          }
        }
      }
    });

    try {
      const parsedContent = JSON.parse(completion.choices[0].message.content);
      console.log('Parsed OpenAI response:', parsedContent);

      if (!parsedContent.recipes || !Array.isArray(parsedContent.recipes)) {
        throw new Error('Invalid response format from OpenAI');
      }

      const cleanedRecipes = validateAndCleanRecipes(parsedContent.recipes);

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
      new ApiResponse(500, null, "An error occurred while generating recipes")
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