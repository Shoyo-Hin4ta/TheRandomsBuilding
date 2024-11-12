import { useState, useCallback } from 'react';

const useMealNameGenerator = (mealType) => {
  const [usedNames, setUsedNames] = useState(new Set());

  const generateMealName = useCallback((customName) => {
    if (customName?.trim()) {
      return customName.trim();
    }

    let counter = 1;
    let proposedName;
    
    do {
      proposedName = `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} ${counter}`;
      counter++;
    } while (usedNames.has(proposedName));

    setUsedNames(prev => new Set(prev).add(proposedName));
    return proposedName;
  }, [mealType, usedNames]);

  return generateMealName;
};

export default useMealNameGenerator;