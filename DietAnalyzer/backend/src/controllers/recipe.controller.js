import OpenAI from 'openai';
import Recipe from '../models/recipe.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const openai = new OpenAI();

const generateRecipesPrompt = (type, preferences) => {
  if (type === 'dietary') {
    return `Generate 3 recipes based on these dietary preferences:
    - Dietary needs: ${preferences.dietaryNeeds.join(', ')}
    - Health conditions: ${preferences.healthCondition}
    - Activity level: ${preferences.activityLevel}
    
    Provide recipes in JSON format with name and detailed directions with measurements.`;
  }
  
  return `Generate 3 recipes using these available ingredients: ${preferences.ingredients.join(', ')}
  If a recipe cannot be made with these ingredients, respond with "Recipe cannot be made" in the directions.
  
  Provide recipes in JSON format with name and detailed directions with measurements.`;
};

export const generateRecipes = async (req, res, next) => {
  try {
    const { type, preferences } = req.body;

    if (!type || !preferences) {
      throw new ApiError(400, "Missing required fields: type and preferences");
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a professional chef who creates detailed recipes with exact measurements."
        },
        {
          role: "user",
          content: generateRecipesPrompt(type, preferences)
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "recipes_schema",
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

    const recipes = JSON.parse(completion.choices[0].message.content).recipes;

    // Save to database
    const recipe = new Recipe({
      recipes,
      generationType: type,
      preferences
    });

    await recipe.save();

    return res
      .status(201)
      .json(
        new ApiResponse(201, recipe, "Recipes generated and saved successfully")
      );

  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json({
          success: false,
          message: error.message,
          errors: error.errors
        });
    }

    // Handle OpenAI API specific errors
    if (error?.error?.type === 'invalid_request_error') {
      return res
        .status(400)
        .json(
          new ApiResponse(
            400,
            null,
            `OpenAI API Error: ${error.error.message}`
          )
        );
    }

    // Generic error handling
    return next(
      new ApiError(
        500,
        "An error occurred while generating recipes",
        error?.message || "Unknown error"
      )
    );
  }
};


export const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find({ user: '655310520a61c845a2906e19' })
      .sort({ createdAt: -1 });
    
    if (!recipes?.length) {
      return res
        .status(200)
        .json(
          new ApiResponse(200, [], "No recipes found")
        );
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, recipes, "Recipes retrieved successfully")
      );

  } catch (error) {
    return next(
      new ApiError(
        500,
        "Error occurred while fetching recipes",
        error?.message || "Unknown error"
      )
    );
  }
};

export const getRecipeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Recipe ID is required");
    }

    const recipe = await Recipe.findById(id);
    
    if (!recipe) {
      throw new ApiError(404, "Recipe not found");
    }

    return res
      .status(200)
      .json(
        new ApiResponse(200, recipe, "Recipe retrieved successfully")
      );

  } catch (error) {
    // Handle mongoose CastError for invalid ObjectId
    if (error.name === 'CastError') {
      return next(new ApiError(400, "Invalid recipe ID format"));
    }

    if (error instanceof ApiError) {
      return next(error);
    }

    return next(
      new ApiError(
        500,
        "Error occurred while fetching recipe",
        error?.message || "Unknown error"
      )
    );
  }
};