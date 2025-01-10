import connectDB from "./db/index.js";
import { app } from "./app.js";
import dotenv from 'dotenv';
import fs from 'fs/promises';

dotenv.config();

const ensureTmpDirectory = async () => {
  try {
    await fs.access('/tmp');
  } catch {
    await fs.mkdir('/tmp', { recursive: true });
  }
};

connectDB()
.then(async () => {  // Make this callback async
    try {
        // Ensure tmp directory exists
        await ensureTmpDirectory();
        
        app.on("error", (error)=>{
            console.log(error);
            throw error;
        })
    
        app.listen(process.env.PORT || 8000 , ()=>{
            console.log("App lisening to port " + process.env.PORT);
        })
    } catch (error) {
        console.log(error);
    }
})
.catch((err) => {
    console.log("Connection to DB Failed");
})