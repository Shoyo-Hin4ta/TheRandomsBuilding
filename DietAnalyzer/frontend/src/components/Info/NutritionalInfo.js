import React, { useState } from 'react';
import { analyzeImage } from './clarifaiService';
import { fetchNutritionalInfo } from './nutritionixService';

function NutritionInfo() {
  const [image, setImage] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    try {
      const response = await analyzeImage(image.split(',')[1]);  // Remove base64 header
      const foodItem = response.data.outputs[0].data.concepts[0].name;
      const nutritionResponse = await fetchNutritionalInfo(foodItem);
      setNutritionInfo(nutritionResponse.data.foods[0]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      <button onClick={handleAnalyze}>Analyze</button>

      {nutritionInfo && (
        <div>
          <h3>Nutritional Information</h3>
          <p>Name: {nutritionInfo.food_name}</p>
          <p>Calories: {nutritionInfo.nf_calories}</p>
          <p>Protein: {nutritionInfo.nf_protein}g</p>
          {/* Add more details as needed */}
        </div>
      )}
    </div>
  );
}

export default NutritionInfo;