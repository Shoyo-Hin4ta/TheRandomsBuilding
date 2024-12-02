// src/services/mealService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const dataURLtoFile = (dataurl, filename) => {
    if (!dataurl) return null;
    
    const arr = dataurl.split(',');
    if (arr.length < 2) return null;
    
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while(n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, { type: mime });
};

export const mealService = {
    async addMeal(mealData) {
        try {
            const formData = new FormData();
            
            // Handle image if present
            if (mealData.image) {
                const imageFile = dataURLtoFile(mealData.image, 'meal-image.jpg');
                if (imageFile) {
                    formData.append('image', imageFile);
                }
            }
            
            // Process ingredients data specifically
            if (Object.keys(mealData).some(key => mealData[key]?.id)) {
                const ingredients = Object.entries(mealData)
                    .filter(([_, value]) => value && value.id)
                    .map(([_, item]) => ({
                        name: item.name,
                        measurement: item.customMeasurement 
                            ? { 
                                isCustom: true, 
                                value: item.customMeasurement,
                                unit: null 
                            }
                            : { 
                                isCustom: false, 
                                value: item.amount,
                                unit: item.unit 
                            }
                    }));
                
                formData.append('ingredients', JSON.stringify(ingredients));
            }
            
            // Add all other fields
            Object.entries(mealData).forEach(([key, value]) => {
                if (!value?.id && key !== 'image') {
                    if (value instanceof Date) {
                        formData.append(key, value.toISOString());
                    } else if (typeof value === 'object') {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                }
            });

            const response = await axios.post(`${API_BASE_URL}/meals`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            return response.data.data;
        } catch (error) {
            console.error('Error adding meal:', error.response?.data || error.message);
            throw error;
        }
    },

    async getMealsByDate(date) {
        try {
            const formattedDate = date.toISOString().split('T')[0];
            const response = await axios.get(`${API_BASE_URL}/meals/date/${formattedDate}`, {
                withCredentials: true
            });
            return response.data.data;
        } catch (error) {
            console.error('Error getting meals:', error.response?.data || error.message);
            throw error;
        }
    }
};