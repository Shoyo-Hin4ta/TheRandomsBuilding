// src/controllers/meal.controller.js
import { Meal } from "../models/meal.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import uploadOnCDN from "../utils/cloudinary.js";
import OpenAI from 'openai';
import fs from 'fs/promises';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const base64ToFile = async (base64String, filename) => {
  // Remove data:image/jpeg;base64, prefix if present
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');
  
  // Create buffer from base64
  const buffer = Buffer.from(base64Data, 'base64');
  
  // Create temporary file path
  const tempPath = `./temp/${filename}`;
  
  // Ensure temp directory exists
  await fs.mkdir('./temp', { recursive: true }).catch(console.error);
  
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

    console.log('Image size:', imageBuffer.length);
    console.log('Base64 length:', dataUrl.length);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You analyze food images and provide nutritional information in JSON format."
        },
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Analyze this meal image and provide nutritional information. Consider this is a ${size} sized portion where:
              XS = Half of a regular portion
              S = 75% of a regular portion
              M = Regular portion
              L = 150% of regular portion
              XL = Double regular portion`
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
          name: "meal_nutrition_schema",
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
              }
            },
            required: ["calories", "protein", "carbohydrates", "fat", "macroNutrientFacts"],
            additionalProperties: false
          }
        }
      },
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    let parsedContent;

    try {
      parsedContent = JSON.parse(content);
    } catch (error) {
      console.log("Failed to parse GPT response, using zero values");
      parsedContent = {
        calories: 0,
        protein: 0,
        carbohydrates: 0,
        fat: 0,
        macroNutrientFacts: "Meal Analysis failed. Please try uploading the image again or enter meal details manually."
      };
    }

    return parsedContent;

  } catch (error) {
    console.error("GPT Vision Analysis Error:", error);
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      macroNutrientFacts: "Meal Analysis failed. Please try uploading the image again or enter meal details manually."
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
          content: "You analyze meals and provide nutritional information in JSON format."
        },
        {
          role: "user",
          content: `Analyze this meal and provide nutritional information: ${content}. 
          Consider portion size adjustments where:
          XS = 50% of regular portion
          S = 75% of regular portion
          M = 100% (regular portion)
          L = 150% of regular portion
          XL = 200% of regular portion
          Current size: ${size}`
        }
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "meal_nutrition_schema",
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
              }
            },
            required: ["calories", "protein", "carbohydrates", "fat", "macroNutrientFacts"],
            additionalProperties: false
          }
        }
      },
      max_tokens: 1000
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (error) {
    console.error("GPT Text Analysis Error:", error);
    return {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      fat: 0,
      macroNutrientFacts: "Analysis failed. Please try again with more details."
    };
  }
};

// Helper function to validate and parse JSON
const validateAndParseJSON = (content) => {
  try {
    // Remove any potential markdown code blocks or extra text
    let jsonStr = content.trim();
    if (jsonStr.includes('```json')) {
      jsonStr = jsonStr.split('```json')[1].split('```')[0].trim();
    } else if (jsonStr.includes('```')) {
      jsonStr = jsonStr.split('```')[1].split('```')[0].trim();
    }

    // Parse the JSON
    const parsed = JSON.parse(jsonStr);

    // Validate required fields
    const requiredFields = ['calories', 'protein', 'carbohydrates', 'fat', 'macroNutrientFacts'];
    const missingFields = requiredFields.filter(field => !(field in parsed));

    if (missingFields.length > 0) {
      throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
    }

    return parsed;
  } catch (error) {
    console.error('JSON Parsing Error:', error, 'Content:', content);
    throw new Error('Failed to parse nutritional information');
  }
};

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