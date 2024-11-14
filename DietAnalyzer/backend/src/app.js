import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

export const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials :true,
}))


app.use(express.json({
    limit : "16kb",
}));
app.use(express.urlencoded(
    {
        extended : true,
        limit : "16kb"
    }
));
app.use(express.static("public"));

// crud operation on cookies
app.use(cookieParser());

// Routes
import userRoutes from './routes/user.route.js'
app.use('/api/users', userRoutes);

//chatgpt
const express = require('express');
const multer = require('multer');
const axios = require('axios');
const fs = require('fs');

// Set up multer for image uploads
const upload = multer({ dest: 'uploads/' });
const OPENAI_API_KEY = "";
const model = 'gpt-4o';
// Route to handle image upload and recognition
app.post('/api/recognize-food', upload.single('image'), async (req, res) => {
    if (!req.file) return res.status(400).send({ error: 'Image is required' });

    try {
        // Read the image file
        const image = fs.readFileSync(req.file.path);

        // Define a descriptive prompt to improve recognition accuracy
        const prompt = "Analyze this image to identify the food items. Only identify specific foods, such as fruits, vegetables, grains, proteins, and common dishes. Do not include unrelated objects. Return a list of identified food items.";

        // Replace with the actual API endpoint and your OpenAI API key
        const response = await axios.post('https://api.openai.com/v1/completions', {
            image,
            prompt,
            model,
        }, {
            headers: {
                //The actual chatgpt api key needs to be used here, but we haven't set the fees together yet,
                // so I haven't created the actual key yet, but I've tested the program by the free LLM
                'Authorization': OPENAI_API_KEY,
                'Content-Type': 'multipart/form-data',
            }
        });
        const result = response.data.result;
        res.send({ result });
    } catch (error) {
        console.error('Error recognizing food:', error);
        res.status(500).send({ error: 'Failed to recognize food' });
    } finally {
        // Clean up uploaded file
        fs.unlinkSync(req.file.path);
    }
});

const axios = require('axios');
async function analyzeFoodNutrients(foodList) {
    const prompt = `
    Analyze the following list of foods and provide the calorie consumption for each food item and provide some suggestions:
    ${foodList.join(", ")}
    Please list the nutritional information for each food item clearly.
    `;
try {
        // Send the prompt to the GPT-4 model
        const response = await axios.post('https://api.openai.com/v1/completions', {
            model: model,
            prompt: prompt,
        }, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
            }
        });

        // Extract the response and return the nutritional analysis
        const analysis = response.data.choices[0].text.trim();
        console.log("Nutritional Analysis:");
        console.log(analysis);
        return analysis;

    } catch (error) {
        console.error('Error analyzing food:', error);
        throw new Error('Failed to analyze food');
    }
}




const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});







 