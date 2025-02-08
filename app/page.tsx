'use client';

import { useState, useEffect } from 'react';
import { OramaClient } from '@oramacloud/client';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Flame } from "lucide-react"
import Link from "next/link"

const ITEMS_PER_PAGE = 12;

export default function Home() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const performSearch = async () => {
    try {
      setLoading(true);
      const endpoint = process.env.NEXT_PUBLIC_ORAMA_ENDPOINT?.trim();
      const apiKey = process.env.NEXT_PUBLIC_ORAMA_API_KEY?.trim();
      
      const client = new OramaClient({
        endpoint,
        api_key: apiKey
      });

      const searchResults = await client.search({
        term: searchTerm,
        mode: 'fulltext',
        limit: ITEMS_PER_PAGE,
        offset: (currentPage - 1) * ITEMS_PER_PAGE
      });

      setRecipes(searchResults.hits.map(hit => hit.document));
      setTotalPages(Math.ceil(searchResults.count / ITEMS_PER_PAGE));
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
        ) : recipes.length > 0 ? (
          recipes.map((recipe) => (
            <Card key={recipe.id} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{recipe.name}</CardTitle>
                <Badge variant="secondary" className="w-fit">
                  {recipe.category}
                </Badge>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-muted-foreground mb-4">{recipe.description}</p>
                <div className="flex gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {recipe.timing.totalTime} mins
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Serves {recipe.servings}
                  </div>
                  <div className="flex items-center gap-1">
                    <Flame className="w-4 h-4" />
                    {Math.round(recipe.nutrition.calories)} cal
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link 
                  href={`/recipe/${encodeURIComponent(recipe.id)}?name=${encodeURIComponent(recipe.name)}`} 
                  className="w-full"
                >
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">View Recipe</Button>
                </Link>
              </CardFooter>
            </Card>
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground">No recipes found</p>
        )}
      </div>

      {recipes.length > 0 && (
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
