'use client';

import { useState, useEffect } from 'react';
import { OramaClient } from '@oramacloud/client';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import RecipeCard from '@/components/RecipeCard';
import { validateAndSanitizeRecipe } from '@/utils/recipeValidator';
import type { Recipe } from '@/utils/recipeValidator';

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const performSearch = async () => {
    try {
      setLoading(true);
      const oramaEndpoint: string = process.env.NEXT_PUBLIC_ORAMA_ENDPOINT!;
      const oramaApiKey: string = process.env.NEXT_PUBLIC_ORAMA_API_KEY!;
      
      if (!oramaEndpoint || !oramaApiKey) {
        throw new Error('Missing API configuration');
      }

      const client = new OramaClient({
        endpoint: oramaEndpoint,
        api_key: oramaApiKey
      });

      const searchResults = await client.search({
        term: searchTerm,
        mode: 'fulltext',
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE
      });

      // Validate that we have hits array
      if (!searchResults?.hits || !Array.isArray(searchResults.hits)) {
        setRecipes([]);
        setTotalPages(0);
        return;
      }

      // Validate and sanitize each recipe
      const validatedRecipes = searchResults.hits
        .map(hit => {
          try {
            if (!hit?.document) return null;
            return validateAndSanitizeRecipe(hit.document);
          } catch (err) {
            console.error('Error validating recipe:', hit?.document?.id, err);
            return null;
          }
        })
        .filter((recipe): recipe is Recipe => recipe !== null); // Type guard to ensure non-null recipes

      setRecipes(validatedRecipes);
      setTotalPages(Math.ceil((searchResults.count || 0) / ITEMS_PER_PAGE));
      setError(null);
    } catch (err) {
      console.error('Search error:', err);
      setError('Error loading recipes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    performSearch();
  }, [currentPage, searchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const searchValue = formData.get('search') as string;
    setSearchTerm(searchValue);
    setCurrentPage(1);
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Recipe Finder</h1>

      <form onSubmit={handleSearch} className="flex gap-2 max-w-2xl mx-auto mb-12">
        <Input type="search" name="search" placeholder="Search recipes..." className="flex-1" />
        <Button type="submit" className="bg-purple-600 hover:bg-purple-700">
          Search
        </Button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {loading ? (
          <p className="col-span-full text-center text-muted-foreground">Loading recipes...</p>
        ) : error ? (
          <p className="col-span-full text-center text-red-500">{error}</p>
        ) : recipes && recipes.length > 0 ? (
          recipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No recipes found</p>
        )}
      </div>

      {recipes && recipes.length > 0 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage <= 1}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage >= totalPages}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </main>
  );
}
