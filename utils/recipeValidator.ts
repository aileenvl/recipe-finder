export interface Recipe {
  id: string;
  name: string;
  description: string;
  category: string;
  images: string[];
  ingredients: {
    quantities: string[];
    parts: string[];
  };
  instructions: string[];
  timing: {
    cookTime: string;
    prepTime: string;
    totalTime: string;
  };
  servings: number;
  nutrition: {
    calories: number;
    [key: string]: number;
  };
}

export function validateAndSanitizeRecipe(rawRecipe: any): Recipe {
  // Helper to check if URL is valid
  const isValidUrl = (url: string) => {
    try {
      return url.startsWith('http') && url.length > 10;
    } catch {
      return false;
    }
  };

  // Filter out invalid images
  const sanitizedImages = Array.isArray(rawRecipe.images) 
    ? rawRecipe.images.filter((img: string) => isValidUrl(img))
    : [];

  // Ensure ingredients are properly formatted
  const sanitizedIngredients = {
    quantities: Array.isArray(rawRecipe.ingredients?.quantities) 
      ? rawRecipe.ingredients.quantities.map((q: string) => q.split(',')[0]) // Take first part if there are commas
      : [],
    parts: Array.isArray(rawRecipe.ingredients?.parts)
      ? rawRecipe.ingredients.parts
      : []
  };

  // Ensure instructions are in array format
  const sanitizedInstructions = Array.isArray(rawRecipe.instructions)
    ? rawRecipe.instructions
    : typeof rawRecipe.instructions === 'string'
    ? [rawRecipe.instructions]
    : [];

  // Convert timing values to minutes if possible
  const sanitizeTiming = (time: string) => {
    if (time === 'NA' || !time) return '0';
    // Remove PT and convert H and M to minutes
    return time.replace('PT', '')
      .replace('H', ' hours ')
      .replace('M', ' minutes');
  };

  return {
    id: String(rawRecipe.id || ''),
    name: String(rawRecipe.name || ''),
    description: String(rawRecipe.description || ''),
    category: String(rawRecipe.category || 'Uncategorized'),
    images: sanitizedImages,
    ingredients: sanitizedIngredients,
    instructions: sanitizedInstructions,
    timing: {
      cookTime: sanitizeTiming(rawRecipe.timing?.cookTime || ''),
      prepTime: sanitizeTiming(rawRecipe.timing?.prepTime || ''),
      totalTime: sanitizeTiming(rawRecipe.timing?.totalTime || '')
    },
    servings: Number(rawRecipe.servings) || 1,
    nutrition: {
      calories: Number(rawRecipe.nutrition?.calories) || 0,
      ...rawRecipe.nutrition
    }
  };
}

// Debug function to test recipe data
export function debugRecipe(recipe: any) {
  const sanitized = validateAndSanitizeRecipe(recipe);
  console.log('Debug Recipe Info:');
  console.log('------------------');
  console.log('ID:', sanitized.id);
  console.log('Name:', sanitized.name);
  console.log('Valid Images:', sanitized.images.length);
  console.log('Image URLs:', sanitized.images);
  console.log('Ingredients Match:', 
    sanitized.ingredients.quantities.length === sanitized.ingredients.parts.length
      ? 'Yes'
      : `No (Quantities: ${sanitized.ingredients.quantities.length}, Parts: ${sanitized.ingredients.parts.length})`
  );
  console.log('Instructions:', sanitized.instructions.length, 'steps');
  console.log('------------------');
  return sanitized;
}
