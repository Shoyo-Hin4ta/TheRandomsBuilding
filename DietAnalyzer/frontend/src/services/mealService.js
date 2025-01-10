// src/services/mealService.js
import axios from 'axios';
import appStore from '@/store/appStore';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

// Helper function to get current token
const getToken = () => {
  const state = appStore.getState();
  return state.user.accessToken;
};

export const mealService = {
    async addMeal(mealData) {
        try {
            // console.log('mealService.addMeal received:', mealData);
            const token = getToken();

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

                // console.log('Sending formatted data to backend:', formattedData);

                const response = await axios.post(`${API_BASE_URL}/meals`, formattedData, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
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

                // console.log('FormData entries:');
                // for (let pair of formData.entries()) {
                //     console.log(pair[0], pair[1]);
                // }

                const response = await axios.post(`${API_BASE_URL}/meals`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    }
                });

                return response.data.data;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                // Optionally dispatch logout action here
                // store.dispatch(clearUser());
                throw new Error('Authentication expired');
            }
            console.error('Error adding meal:', error.response?.data || error.message);
            throw error;
        }
    },

    async getMealsByDate(date) {
        try {
            const token = getToken();
            const formattedDate = date.toISOString().split('T')[0];
            const response = await axios.get(`${API_BASE_URL}/meals/date/${formattedDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Authentication expired');
            }
            console.error('Error getting meals:', error.response?.data || error.message);
            throw error;
        }
    },

    // You might want to add other methods
    async updateMeal(id, mealData) {
        try {
            const token = getToken();
            const response = await axios.put(`${API_BASE_URL}/meals/${id}`, mealData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Authentication expired');
            }
            throw error;
        }
    },

    async deleteMeal(id) {
        try {
            const token = getToken();
            const response = await axios.delete(`${API_BASE_URL}/meals/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Authentication expired');
            }
            throw error;
        }
    }
};