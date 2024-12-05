// src/services/mealService.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// const dataURLtoFile = (dataurl, filename) => {
//     if (!dataurl) return null;
    
//     const arr = dataurl.split(',');
//     if (arr.length < 2) return null;
    
//     const mime = arr[0].match(/:(.*?);/)[1];
//     const bstr = atob(arr[1]);
//     let n = bstr.length;
//     const u8arr = new Uint8Array(n);
    
//     while(n--) {
//         u8arr[n] = bstr.charCodeAt(n);
//     }
    
//     return new File([u8arr], filename, { type: mime });
// };

export const mealService = {
    async addMeal(mealData) {
        try {
            console.log('mealService.addMeal received:', mealData);

            // If ingredients are present, ensure they're in the correct format
            if (mealData.ingredients) {
                // ingredients are already formatted correctly from the component
                // just need to stringify them for transmission
                const formattedData = {
                    ...mealData,
                    ingredients: JSON.stringify(mealData.ingredients),
                    date: mealData.date instanceof Date ? 
                        mealData.date.toISOString() : mealData.date
                };

                console.log('Sending formatted data to backend:', formattedData);

                const response = await axios.post(`${API_BASE_URL}/meals`, formattedData, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                });

                return response.data.data;
            }
            
            // Handle image uploads and other meal types
            else {
                const formData = new FormData();
                
                Object.entries(mealData).forEach(([key, value]) => {
                    if (value instanceof Date) {
                        formData.append(key, value.toISOString());
                    } else if (typeof value === 'object' && value !== null) {
                        formData.append(key, JSON.stringify(value));
                    } else {
                        formData.append(key, value);
                    }
                });

                console.log('FormData entries:');
                for (let pair of formData.entries()) {
                    console.log(pair[0], pair[1]);
                }

                const response = await axios.post(`${API_BASE_URL}/meals`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    withCredentials: true
                });

                return response.data.data;
            }
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
            return response.data;  // Changed to return full response
        } catch (error) {
            console.error('Error getting meals:', error.response?.data || error.message);
            throw error;
        }
    }
};