import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Recipe } from '@/utils/recipeValidator';
import AddToWeeklyMeal from './AddToWeeklyMeal';

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  // Safety check for required properties
  if (!recipe?.id || !recipe?.name) {
    return null;
  }

  const hasValidImage = recipe.images && Array.isArray(recipe.images) && recipe.images.length > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {hasValidImage && (
        <div className="relative w-full h-48">
          <Image
            src={recipe.images[0]}
            alt={recipe.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.name}</h3>
        
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {recipe.category || 'Uncategorized'}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{recipe.description || 'No description available'}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span> {recipe.timing?.totalTime || 'N/A'} mins</span>
          <span> Serves {recipe.servings || 'N/A'}</span>
          <span> {recipe.nutrition?.calories ? Math.round(recipe.nutrition.calories) : 'N/A'} cal</span>
        </div>
        
        <div className="mt-4 flex gap-2">
          <Link 
            href={`/recipe/${encodeURIComponent(recipe.id)}?name=${encodeURIComponent(recipe.name)}`}
            className="inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            View Recipe
          </Link>
          <AddToWeeklyMeal recipe={recipe} />
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;
