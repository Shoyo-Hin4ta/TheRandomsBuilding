import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';

dotenv.config();

export const app = express();

app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials :true,
}))


app.use(express.json({
    limit : "50mb",
}));

app.use(express.urlencoded(
    {
        extended : true,
        limit : "50mb"
    }
));

app.use(express.static("public"));

// crud operation on cookies
app.use(cookieParser());

// Routes
import userRoutes from './routes/user.route.js'
app.use('/api/users', userRoutes);

import authRoutes from './routes/auth.route.js'
app.use('/api/auth', authRoutes);


import mealRouter from './routes/meal.route.js';
app.use('/api/meals', mealRouter);

import recipeRouter from './routes/recipe.route.js';
app.use('/api/recipes', recipeRouter);

import generateReportRouter from './routes/report.route.js';
app.use('/api/report', generateReportRouter);