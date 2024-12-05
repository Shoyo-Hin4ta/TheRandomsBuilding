import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Meal } from "../models/meal.model.js";
import OpenAI from "openai";

const openai = new OpenAI();

const generateMealReport = async (req, res) => {
    try {
        const { diseases = [], timeFrame } = req.body;
        
        // Calculate date range based on timeFrame
        const endDate = new Date();
        const startDate = new Date();
        
        switch (timeFrame.toLowerCase()) {
            case '1week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case '2weeks':
                startDate.setDate(endDate.getDate() - 14);
                break;
            case '1month':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case '3months':
                startDate.setDate(endDate.getDate() - 90);
                break;
            default:
                throw new ApiError(400, "Invalid time frame specified");
        }

        // Fetch meals within the date range
        const meals = await Meal.find({
            user: req.user._id,
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).sort({ date: 1 });

        if (!meals.length) {
            return res.status(200).json(
                new ApiResponse(200, {
                    timeFrame,
                    mealsAnalyzed: 0,
                    message: "No meal data available for the specified time frame"
                })
            );
        }

        // Aggregate nutritional data
        const nutritionalSummary = meals.reduce((acc, meal) => {
            acc.totalCalories += meal.nutritionInfo.calories;
            acc.totalProtein += meal.nutritionInfo.protein;
            acc.totalCarbs += meal.nutritionInfo.carbohydrates;
            acc.totalFat += meal.nutritionInfo.fat;
            acc.mealCount++;
            return acc;
        }, {
            totalCalories: 0,
            totalProtein: 0,
            totalCarbs: 0,
            totalFat: 0,
            mealCount: 0
        });

        // Calculate daily averages
        const numberOfDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
        const dailyAverages = {
            calories: nutritionalSummary.totalCalories / numberOfDays,
            protein: nutritionalSummary.totalProtein / numberOfDays,
            carbs: nutritionalSummary.totalCarbs / numberOfDays,
            fat: nutritionalSummary.totalFat / numberOfDays
        };

        // Prepare data for AI analysis
        const analysisData = {
            nutritionalSummary,
            dailyAverages,
            diseases,
            timeFrame,
            mealTypes: meals.reduce((acc, meal) => {
                acc[meal.mealType] = (acc[meal.mealType] || 0) + 1;
                return acc;
            }, {})
        };

        // Generate AI analysis using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [
                {
                    role: "system",
                    content: "You are a nutritionist analyzing meal data and providing health insights."
                },
                {
                    role: "user",
                    content: JSON.stringify({
                        task: "Analyze nutritional data and provide insights",
                        data: analysisData,
                        diseases: diseases
                    })
                }
            ],
            response_format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: {
                        summary: {
                            type: "string",
                            description: "Overall summary of the nutritional analysis"
                        },
                        healthConcerns: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            description: "List of health concerns based on the diet and diseases"
                        },
                        recommendations: {
                            type: "array",
                            items: {
                                type: "string"
                            },
                            description: "List of dietary recommendations"
                        },
                        diseaseSpecificAdvice: {
                            type: "object",
                            additionalProperties: {
                                type: "string"
                            },
                            description: "Specific advice for each disease condition"
                        }
                    }
                }
            }
        });

        const aiAnalysis = JSON.parse(completion.choices[0].message.content);

        // Prepare final report
        const report = {
            timeRange: {
                start: startDate,
                end: endDate,
                numberOfDays
            },
            nutritionalSummary: {
                ...nutritionalSummary,
                dailyAverages
            },
            mealPatterns: {
                totalMeals: nutritionalSummary.mealCount,
                mealTypeDistribution: analysisData.mealTypes,
                averageMealsPerDay: nutritionalSummary.mealCount / numberOfDays
            },
            analysis: aiAnalysis
        };

        return res.status(200).json(
            new ApiResponse(
                200,
                report,
                "Meal report generated successfully"
            )
        );

    } catch (error) {
        console.error("Generate Meal Report Error:", error);
        throw new ApiError(error?.statusCode || 500, error?.message || "Failed to generate meal report");
    }
};

export { generateMealReport };