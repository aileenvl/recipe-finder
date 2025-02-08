import React from 'react';
import Link from 'next/link';

interface Recipe {
  id: string;
  name: string;
  category: string;
  description: string;
  timing: {
    totalTime: number;
  };
  servings: number;
  nutrition: {
    calories: number;
  };
}

const RecipeCard = ({ recipe }: { recipe: Recipe }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.name}</h3>
        
        <div className="mb-2">
          <span className="inline-block bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
            {recipe.category}
          </span>
        </div>

        <p className="text-gray-600 mb-4">{recipe.description}</p>

        <div className="flex flex-wrap gap-4 text-sm text-gray-500">
          <span>🕒 {recipe.timing.totalTime} mins</span>
          <span>👥 Serves {recipe.servings}</span>
          <span>🔥 {Math.round(recipe.nutrition.calories)} cal</span>
        </div>
        
        <Link 
          href={`/recipe/${encodeURIComponent(recipe.id)}?name=${encodeURIComponent(recipe.name)}`}
          className="mt-4 inline-block px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          View Recipe
        </Link>
      </div>
    </div>
  );
};

export default RecipeCard;
