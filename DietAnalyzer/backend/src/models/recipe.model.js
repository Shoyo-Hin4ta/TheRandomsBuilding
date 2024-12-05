import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    recipes: [{
        name: {
            type: String,
            required: true,
            trim: true
        },
        directions: {
            type: String,
            required: true,
            trim: true
        },
        additionalIngredients: {
            type: [String],
            default: []
        }
    }],
    preferences: {
        dietaryNeeds: {
            type: [String],
            default: []
        },
        healthCondition: {
            type: String,
            default: ''
        },
        activityLevel: {
            type: String,
            default: ''
        },
        ingredients: {
            type: [String],
            default: []
        }
    }
}, {
    timestamps: true,
    strict: true
});

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;