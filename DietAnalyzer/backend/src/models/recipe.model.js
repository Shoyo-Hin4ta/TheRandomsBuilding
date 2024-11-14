import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: '655310520a61c845a2906e19'
    },
    recipes: [{
        name: {
            type: String,
            required: true
        },
        directions: {
            type: String,
            required: true
        }
    }],
    generationType: {
        type: String,
        enum: ['dietary', 'ingredients'],
        required: true
    },
    preferences: {
        dietaryNeeds: [String],
        healthCondition: String,
        activityLevel: String,
        ingredients: [String]
    }
    }, {
        timestamps: true
    });

const Recipe = mongoose.model('Recipe', recipeSchema);

export default Recipe;