// src/models/meal.model.js
import mongoose from "mongoose";

const nutritionInfoSchema = new mongoose.Schema({
  calories: {
    type: Number,
    required: true
  },
  protein: {
    type: Number,
    required: true
  },
  carbohydrates: {
    type: Number,
    required: true
  },
  fat: {
    type: Number,
    required: true
  },
  macroNutrientFacts: {
    type: String,
    required: true
  }
});

const measurementSchema = new mongoose.Schema({
  isCustom: {
    type: Boolean,
    required: true
  },
  value: {
    type: String,
    required: true
  },
  unit: {
    type: String,
    required: function() {
      return !this.isCustom;
    }
  }
}, { _id: false });

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  measurement: {
    type: measurementSchema,
    required: true
  }
}, { _id: false });

const mealSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true
  },
  entryType: {
    type: String,
    enum: ['complete', 'ingredients', 'image'],
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL'],
    default: 'M'
  },
  description: {
    type: String,
    trim: true
  },
  ingredients: [ingredientSchema],
  nutritionInfo: {
    type: nutritionInfoSchema,
    required: true
  }
}, {
  timestamps: true
});

mealSchema.index({ user: 1, date: 1, mealType: 1 });

export const Meal = mongoose.model('Meal', mealSchema);