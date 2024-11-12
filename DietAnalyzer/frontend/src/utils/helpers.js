export const generateUniqueId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };
  
  export const formatMealTitle = (mealType, mealName) => {
    if (mealName) return mealName;
    const time = new Date().toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    return `${mealType} at ${time}`;
  };
  
  export const calculateTotalCalories = (ingredients) => {
    // This is a placeholder. In real app, you'd get this from your backend
    return ingredients.reduce((total, ingredient) => {
      return total + (ingredient.calories || 0);
    }, 0);
  };