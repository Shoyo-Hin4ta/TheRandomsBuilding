export const validateMealEntry = (data) => {
    const errors = {};
  
    if (!data.mealType) {
      errors.mealType = 'Meal type is required';
    }
  
    if (!data.size) {
      errors.size = 'Meal size is required';
    }
  
    return errors;
  };
  
  export const validateIngredient = (ingredient) => {
    const errors = {};
  
    if (!ingredient.name) {
      errors.name = 'Ingredient name is required';
    }
  
    if (!ingredient.customMeasurement && !ingredient.amount) {
      errors.measurement = 'Measurement is required';
    }
  
    return errors;
  };

  export const validateImageUpload = (file) => {
    const errors = {};
    
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        errors.type = 'Please upload a valid image file (JPEG, PNG)';
      }
      
      // 10MB limit
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        errors.size = 'Image size should be less than 10MB';
      }
    }
  
    return errors;
  };