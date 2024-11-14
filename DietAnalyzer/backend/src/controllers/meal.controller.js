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

const analyzeWithGPT = async (imagePath, size = 'M') => {
  try {
    // Verify the image exists
    await fs.access(imagePath);
    
    // Read the image file
    const imageBuffer = await fs.readFile(imagePath);
    
    // Ensure the content type is correctly set
    const contentType = 'image/jpeg';
    const base64Image = Buffer.from(imageBuffer).toString('base64');
    const dataUrl = `data:${contentType};base64,${base64Image}`;

    console.log('Image size:', imageBuffer.length);
    console.log('Base64 length:', dataUrl.length);

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: `Analyze this meal image and respond ONLY with a JSON object (no additional text) in this format:
              {
                "calories": number,
                "protein": number,
                "carbohydrates": number,
                "fat": number,
                "macroNutrientFacts": "string"
              }
              
              Consider this is a ${size} sized portion where:
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
      max_tokens: 1000,
    });

    const content = response.choices[0].message.content;
    return validateAndParseJSON(content);
  } catch (error) {
    console.error("GPT Vision Analysis Error:", error);
    // Add more detailed error information
    if (error.error?.code === 'invalid_image_format') {
      throw new ApiError(400, "Invalid image format. Please upload a JPEG, PNG, GIF, or WebP image.");
    }
    throw new ApiError(500, "Failed to analyze meal image: " + error.message);
  }
};

const analyzeTextWithGPT = async (content, size = 'M') => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "You are a nutritional analysis AI. Always respond with valid JSON objects containing nutritional information. Never include any additional text or explanations."
        },
        {
          role: "user",
          content: `Respond ONLY with a JSON object (no additional text) in this format:
          {
            "calories": number,
            "protein": number,
            "carbohydrates": number,
            "fat": number,
            "macroNutrientFacts": "string"
          }

          Analyze this meal: ${content}
          
          Consider portion size adjustments:
          XS = 50% of regular portion
          S = 75% of regular portion
          M = 100% (regular portion)
          L = 150% of regular portion
          XL = 200% of regular portion

          Current size: ${size}`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const result = response.choices[0].message.content;
    return validateAndParseJSON(result);
  } catch (error) {
    console.error("GPT Text Analysis Error:", error);
    throw new ApiError(500, "Failed to analyze meal description");
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

export const addMeal = async (req, res) => {
  try {
    const { body } = req;
    let mealData = {};

    console.log("Request file:", req.file); // For debugging
    console.log("Request body:", body);     // For debugging

    // Handle image-based meal entry
    if (req.file) {
      try {
        console.log(req.file);
        const analysis = await analyzeWithGPT(req.file.path, body.size || 'M');

        mealData = {
          date: new Date(body.date),
          mealType: body.mealType,
          entryType: 'image',
          name: body.name,
          size: body.size || 'M',
          nutritionInfo: analysis
        };

        // Clean up the temp file
        await fs.unlink(req.file.path).catch(console.error);
      } catch (error) {
        // Clean up temp file if exists
        if (req.file?.path) {
          await fs.unlink(req.file.path).catch(console.error);
        }
        throw error;
      }
    }
    else if (body.description) {
      const analysis = await analyzeTextWithGPT(body.description, body.size);
      mealData = {
        date: new Date(body.date),
        mealType: body.mealType,
        entryType: 'complete',
        name: body.name,
        size: body.size,
        description: body.description,
        nutritionInfo: analysis
      };
    }
    // Handle ingredients-based meal entry
    else if (body.ingredients) {
      let ingredients;
      try {
        ingredients = JSON.parse(body.ingredients);
      } catch (error) {
        throw new ApiError(400, "Invalid ingredients format");
      }
    
      // Create a detailed description for GPT analysis
      const ingredientDescription = ingredients
        .map(ing => {
          if (ing.measurement.isCustom) {
            return `${ing.name} (${ing.measurement.value})`;
          } else {
            return `${ing.name} (${ing.measurement.value} ${ing.measurement.unit})`;
          }
        })
        .join(', ');
    
      const analysis = await analyzeTextWithGPT(
        `Analyze nutrition for these ingredients: ${ingredientDescription}`,
        body.size || 'M'
      );
    
      mealData = {
        date: new Date(body.date),
        mealType: body.mealType || 'snack',
        entryType: 'ingredients',
        name: `Custom Meal`,
        ingredients: ingredients,
        size: body.size || 'M',
        nutritionInfo: analysis
      };
    }

    const meal = await Meal.create(mealData);

    return res.status(201).json(
      new ApiResponse(201, meal, "Meal logged successfully")
    );

  } catch (error) {
    console.error("Add Meal Error:", error);
    throw new ApiError(error?.statusCode || 500, error?.message || "Failed to log meal");
  }
};

export const getMealsByDate = async (req, res) => {
  try {
    const { date } = req.params;
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    const meals = await Meal.find({
      date: {
        $gte: startDate,
        $lte: endDate
      }
    }).sort({ mealType: 1 });

    return res.status(200).json(
      new ApiResponse(200, meals, "Meals retrieved successfully")
    );

  } catch (error) {
    throw new ApiError(500, "Failed to fetch meals");
  }
};

export const updateMeal = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const meal = await Meal.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!meal) {
      throw new ApiError(404, "Meal not found");
    }

    return res.status(200).json(
      new ApiResponse(200, meal, "Meal updated successfully")
    );

  } catch (error) {
    throw new ApiError(error?.statusCode || 500, error?.message || "Failed to update meal");
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const { id } = req.params;
    
    const meal = await Meal.findByIdAndDelete(id);

    if (!meal) {
      throw new ApiError(404, "Meal not found");
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Meal deleted successfully")
    );

  } catch (error) {
    throw new ApiError(error?.statusCode || 500, error?.message || "Failed to delete meal");
  }
};