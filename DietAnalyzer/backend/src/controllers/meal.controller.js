import { Meal } from "../models/meal.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCDN from "../utils/cloudinary.js";
import OpenAI from 'openai';
import fs from 'fs/promises';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const base64ToFile = async (base64String, filename) => {
  // Remove data:image/jpeg;base64, prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  
  // Create buffer from base64
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Create temporary file path
  // const tempPath = `./temp/${filename}`;
  const tempPath = `./tmp/${filename}`;

  // Ensure temp directory exists
  await fs.mkdir('./tmp', { recursive: true }).catch(console.error);
  
  // Write buffer to file
  await fs.writeFile(tempPath, buffer);
  
  return tempPath;
};

const analyzeWithGPT = async (imagePath, size = 'M') => {
  try {
    const imageBuffer = await fs.readFile(imagePath);
    const contentType = 'image/jpeg';
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:${contentType};base64,${base64Image}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You analyze food images and provide nutritional and ingredient information in JSON format."
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Analyze this meal image and provide nutritional information and ingredient analysis. Consider this is a ${size} sized portion.` 
            },
            {
              type: "image_url",
              image_url: {
                url: dataUrl,
                detail: "low"
              }
            }
          ],
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "meal_analysis_schema",
          schema: {
            type: "object",
            properties: {
              calories: {
                type: "number",
                description: "Total calories in the meal"
              },
              protein: {
                type: "number",
                description: "Protein content in grams"
              },
              carbohydrates: {
                type: "number",
                description: "Carbohydrate content in grams"
              },
              fat: {
                type: "number",
                description: "Fat content in grams"
              },
              macroNutrientFacts: {
                type: "string",
                description: "Description of the meal's macro nutrient composition"
              },
              ingredientAnalysis: {
                type: "object",
                description: "Detailed analysis of meal ingredients",
                properties: {
                  mainIngredients: {
                    type: "array",
                    description: "List of primary ingredients in the meal",
                    items: { 
                      type: "string" 
                    }
                  },
                  nutritionalHighlights: {
                    type: "string",
                    description: "Key nutritional features of the meal"
                  },
                  dietaryConsiderations: {
                    type: "string",
                    description: "Important dietary notes about the meal"
                  },
                  healthBenefits: {
                    type: "string",
                    description: "Potential health benefits of the meal"
                  }
                },
                required: ["mainIngredients", "nutritionalHighlights", "dietaryConsiderations", "healthBenefits"]
              }
            },
            required: ["calories", "protein", "carbohydrates", "fat", "macroNutrientFacts", "ingredientAnalysis"],
            additionalProperties: false
          }
        }
      }
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("GPT Vision Analysis Error:", error);
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      macroNutrientFacts: "Analysis failed",
      ingredientAnalysis: {
        mainIngredients: [],
        nutritionalHighlights: "Analysis failed",
        dietaryConsiderations: "Analysis failed",
        healthBenefits: "Analysis failed"
      }
    };
  }
};

const analyzeTextWithGPT = async (content, size = 'M') => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You analyze meals and provide nutritional and ingredient information in JSON format."
        },
        {
          role: "user",
          content: `Analyze this meal and provide nutritional information and ingredient analysis: ${content}. Consider portion size adjustments where: XS = 50%, S = 75%, M = 100%, L = 150%, XL = 200% of regular portion. Current size: ${size}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "meal_analysis_schema",
          schema: {
            type: "object",
            properties: {
              calories: {
                type: "number",
                description: "Total calories in the meal"
              },
              protein: {
                type: "number",
                description: "Protein content in grams"
              },
              carbohydrates: {
                type: "number",
                description: "Carbohydrate content in grams"
              },
              fat: {
                type: "number",
                description: "Fat content in grams"
              },
              macroNutrientFacts: {
                type: "string",
                description: "Description of the meal's macro nutrient composition"
              },
              ingredientAnalysis: {
                type: "object",
                description: "Detailed analysis of meal ingredients",
                properties: {
                  mainIngredients: {
                    type: "array",
                    items: { type: "string" }
                  },
                  nutritionalHighlights: {
                    type: "string"
                  },
                  dietaryConsiderations: {
                    type: "string"
                  },
                  healthBenefits: {
                    type: "string"
                  }
                },
                required: ["mainIngredients", "nutritionalHighlights", "dietaryConsiderations", "healthBenefits"]
              }
            },
            required: ["calories", "protein", "carbohydrates", "fat", "macroNutrientFacts", "ingredientAnalysis"]
          }
        }
      }
    });

    const parsedResponse = JSON.parse(response.choices[0].message.content);
    
    // Ensure macroNutrientFacts is present, generate if missing
    if (!parsedResponse.macroNutrientFacts) {
      parsedResponse.macroNutrientFacts = `This meal contains ${parsedResponse.protein}g protein, ${parsedResponse.carbohydrates}g carbohydrates, and ${parsedResponse.fat}g fat, totaling ${parsedResponse.calories} calories.`;
    }

    return parsedResponse;
  } catch (error) {
    console.error("GPT Text Analysis Error:", error);
    // Return a valid object with all required fields
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      macroNutrientFacts: "Analysis failed",
      ingredientAnalysis: {
        mainIngredients: [],
        nutritionalHighlights: "Analysis failed",
        dietaryConsiderations: "Analysis failed",
        healthBenefits: "Analysis failed"
      }
    };
  }
};

// // Helper function to validate and parse JSON
// const validateAndParseJSON = (content) => {
//   try {
//     // Remove any potential markdown code blocks or extra text
//     let jsonStr = content.trim();
//     if (jsonStr.includes('```json')) {
//       jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
//     } else if (jsonStr.includes('```')) {
//       jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
//     }

//     // Parse the JSON
//     const parsed = JSON.parse(jsonStr);

//     // Validate required fields
//     const requiredFields = ['calories', 'protein', 'carbohydrates', 'fat', 'macroNutrientFacts'];
//     const missingFields = requiredFields.filter(field => !(field in parsed));

//     if (missingFields.length > 0) {
//       throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
//     }

//     return parsed;
//   } catch (error) {
//     console.error('JSON Parsing Error:', error, 'Content:', content);
//     throw new Error('Failed to parse nutritional information');
//   }
// };

const generateMealName = async (mealType, userId, date, existingMeals = null) => {
  try {
    const normalizedType = mealType || 'Custom';
    const capitalizedType = normalizedType.charAt(0).toUpperCase() + normalizedType.slice(1).toLowerCase();
    
    if (!existingMeals) {
      const today = new Date(date);
      today.setUTCHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      existingMeals = await Meal.find({
        user: userId,
        date: {
          $gte: today,
          $lt: tomorrow
        }
      });
    }
    
    let counter = 1;
    let proposedName;
    
    do {
      proposedName = `${capitalizedType} ${counter}`;
      counter++;
    } while (existingMeals.some(meal => meal.name === proposedName));
    
    return proposedName;
  } catch (error) {
    console.error('Error generating meal name:', error);
    throw new ApiError(500, "Failed to generate meal name");
  }
};

export const addMeal = async (req, res) => {
  try {
    const { body } = req;
    console.log("1. Received request body:", body);

    // Get existing meals for the day
    const today = new Date(body.date);
    today.setUTCHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingMeals = await Meal.find({
      user: req.user._id,
      date: {
        $gte: today,
        $lt: tomorrow
      }
    });

    const mealName = body.name || await generateMealName(
      body.mealType,
      req.user._id,
      body.date,
      existingMeals
    );

    let mealData = {
      user: req.user._id,
      date: new Date(body.date),
      name: mealName,
      mealType: body.mealType,
      size: body.size || 'M'
    };

    // Handle ingredients case
    if (body.ingredients) {
      try {
        const ingredients = JSON.parse(body.ingredients);
        
        const ingredientDescription = ingredients
          .map(ing => {
            const measurement = ing.measurement;
            if (measurement.isCustom) {
              return `${ing.name} (${measurement.value})`;
            }
            return `${ing.name} (${measurement.value} ${measurement.unit})`;
          })
          .join(', ');

        const analysis = await analyzeTextWithGPT(ingredientDescription, body.size || 'M');
        
        mealData = {
          ...mealData,
          entryType: 'ingredients',
          ingredients: ingredients,
          nutritionInfo: analysis
        };
      } catch (error) {
        console.error('Ingredients processing error:', error);
        throw new ApiError(400, "Invalid ingredients format");
      }
    }
    // Handle image case
    else if (body.image) {
      const tempFilePath = await base64ToFile(body.image, `meal-${Date.now()}.jpg`);
      const analysis = await analyzeWithGPT(tempFilePath, body.size || 'M');
      
      mealData = {
        ...mealData,
        entryType: 'image',
        nutritionInfo: analysis
      };

      await fs.unlink(tempFilePath).catch(console.error);
    }
    // Handle description case
    else if (body.description) {
      const analysis = await analyzeTextWithGPT(body.description, body.size || 'M');
      mealData = {
        ...mealData,
        entryType: 'complete',
        description: body.description,
        nutritionInfo: analysis
      };
    }
    else {
      throw new ApiError(400, "Please provide image, description, or ingredients");
    }

    console.log("3. Final mealData before DB save:", mealData);
    const meal = await Meal.create(mealData);

    return res.status(201).json(
      new ApiResponse(201, meal, "Meal logged successfully")
    );

  } catch (error) {
    console.error("Add Meal Error:", error);
    if (error.name === 'ValidationError') {
      console.error("Validation error details:", error.errors);
    }
    throw new ApiError(error?.statusCode || 500, error?.message || "Failed to log meal");
  }
};

export const getMealsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    
    if (!date) {
      throw new ApiError(400, "Date parameter is required");
    }

    // Create date objects for start and end of the day in UTC
    const startDate = new Date(date);
    startDate.setUTCHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setUTCHours(23, 59, 59, 999);

    console.log('Querying meals between:', startDate, 'and', endDate); // Debug log

    const meals = await Meal.find({
      user: req.user._id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ mealType: 1 });

    console.log('Found meals:', meals); // Debug log

    return res.status(200).json(
      new ApiResponse(200, meals, "Meals retrieved successfully")
    );

  } catch (error) {
    console.error("Get Meals Error:", error);
    throw new ApiError(
      error?.statusCode || 500, 
      error?.message || "Failed to fetch meals"
    );
  }
};

export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      throw new ApiError(400, "Meal ID is required");
    }

    // Check if meal exists and belongs to user
    const existingMeal = await Meal.findOne({
      _id: id,
      user: req.user._id
    });

    if (!existingMeal) {
      throw new ApiError(404, "Meal not found or unauthorized");
    }

    // Include user ID in updates to prevent it from being overwritten
    const updatedMeal = await Meal.findByIdAndUpdate(
      id,
      { ...updates, user: req.user._id }, // Ensure user field is preserved
      { 
        new: true, 
        runValidators: true 
      }
    );

    return res.status(200).json(
      new ApiResponse(200, updatedMeal, "Meal updated successfully")
    );

  } catch (error) {
    console.error("Update Meal Error:", error);
    throw new ApiError(
      error?.statusCode || 500, 
      error?.message || "Failed to update meal"
    );
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      throw new ApiError(400, "Meal ID is required");
    }
    
    // Find and delete in one operation, ensuring user ownership
    const deletedMeal = await Meal.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    if (!deletedMeal) {
      throw new ApiError(404, "Meal not found or unauthorized");
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Meal deleted successfully")
    );

  } catch (error) {
    console.error("Delete Meal Error:", error);
    throw new ApiError(
      error?.statusCode || 500, 
      error?.message || "Failed to delete meal"
    );
  }
};

export const getNutritionData = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Convert strings to Date objects
    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      user: req.user._id,
      date: {
        $gte: start,
        $lte: end
      }
    }).sort({ date: 1 });

    // Get all dates between start and end
    const dates = [];
    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Group meals by date and calculate daily totals
    const dailyTotals = meals.reduce((acc, meal) => {
      const dateKey = new Date(meal.date).toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: new Date(meal.date).toLocaleDateString('en-US', { 
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          calories: 0,
          protein: 0,
          carbohydrates: 0,
          fat: 0,
          mealCount: 0
        };
      }
      
      acc[dateKey].calories += meal.nutritionInfo?.calories || 0;
      acc[dateKey].protein += meal.nutritionInfo?.protein || 0;
      acc[dateKey].carbohydrates += meal.nutritionInfo?.carbohydrates || 0;
      acc[dateKey].fat += meal.nutritionInfo?.fat || 0;
      acc[dateKey].mealCount += 1;
      
      return acc;
    }, {});

    // Fill in all dates with data or zeros
    const nutritionData = dates.map(date => {
      const dateKey = date.toISOString().split('T')[0];
      return dailyTotals[dateKey] || {
        date: date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        }),
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        mealCount: 0
      };
    });

    return res.status(200).json(
      new ApiResponse(
        200,
        nutritionData,
        "Nutrition data retrieved successfully"
      )
    );

  } catch (error) {
    console.error("Get Nutrition Data Error:", error);
    throw new ApiError(
      error?.statusCode || 500,
      error?.message || "Failed to fetch nutrition data"
    );
  }
};