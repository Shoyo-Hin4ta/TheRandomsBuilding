const NUTRITIONIX_API_URL = 'https://trackapi.nutritionix.com/v2/natural/nutrients';
const NUTRITIONIX_APP_ID = 'YOUR_APP_ID';
const NUTRITIONIX_API_KEY = 'YOUR_API_KEY';

export const fetchNutritionalInfo = (foodItem) => {
  return axios.post(
    NUTRITIONIX_API_URL,
    { query: foodItem },
    {
      headers: {
        'x-app-id': NUTRITIONIX_APP_ID,
        'x-app-key': NUTRITIONIX_API_KEY,
        'Content-Type': 'application/json',
      },
    }
  );
};
