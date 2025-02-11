'use client';

import { useState, useEffect } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import Link from 'next/link';
import type { Recipe } from '@/utils/recipeValidator';
import { Button } from "@/components/ui/button";

type MealType = 'breakfast' | 'lunch' | 'dinner';
type DayMeals = {
  [key in MealType]: Recipe | null;
};

type WeeklyMeals = {
  [key: string]: DayMeals;
};

export default function WeeklyMeals() {
  const [weeklyMeals, setWeeklyMeals] = useState<WeeklyMeals>({});

  useEffect(() => {
    // Load saved meals from localStorage
    const loadSavedMeals = () => {
      try {
        const saved = localStorage.getItem('weeklyMeals');
        if (saved) {
          const parsed = JSON.parse(saved);
          setWeeklyMeals(parsed);
        }
      } catch (error) {
        console.error('Error loading meals:', error);
      }
    };

    loadSavedMeals();

    // Check if it's Sunday after dinner (after 8 PM) to reset the week
    const checkAndResetWeek = () => {
      const now = new Date();
      if (now.getDay() === 0 && now.getHours() >= 20) {
        setWeeklyMeals({});
        localStorage.removeItem('weeklyMeals');
      }
    };

    checkAndResetWeek();

    // Add event listener for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'weeklyMeals') {
        loadSavedMeals();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const getDaysOfWeek = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 }); // Start from Monday
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return {
        date,
        dayName: format(date, 'EEEE'),
        formattedDate: format(date, 'yyyy-MM-dd'),
      };
    });
  };

  const removeMeal = (date: string, mealType: MealType) => {
    const newMeals = { ...weeklyMeals };
    if (newMeals[date]) {
      newMeals[date][mealType] = null;
      setWeeklyMeals(newMeals);
      localStorage.setItem('weeklyMeals', JSON.stringify(newMeals));
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">Weekly Meal Planner</h1>
      <div className="grid gap-6">
        {getDaysOfWeek().map(({ dayName, formattedDate }) => (
          <div key={formattedDate} className="border rounded-lg p-4 bg-white shadow-sm">
            <h2 className="text-xl font-semibold mb-4">{dayName}</h2>
            <div className="grid gap-4">
              {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((mealType) => (
                <div key={`${formattedDate}-${mealType}`} className="border-b pb-2">
                  <h3 className="capitalize text-lg font-medium mb-2">{mealType}</h3>
                  {weeklyMeals[formattedDate]?.[mealType] ? (
                    <div className="flex justify-between items-center">
                      <div className="flex-1">
                        <Link 
                          href={`/recipe/${encodeURIComponent(weeklyMeals[formattedDate][mealType]?.id)}?name=${encodeURIComponent(weeklyMeals[formattedDate][mealType]?.name)}`}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          {weeklyMeals[formattedDate][mealType]?.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          {weeklyMeals[formattedDate][mealType]?.description?.slice(0, 100)}
                          {weeklyMeals[formattedDate][mealType]?.description?.length > 100 ? '...' : ''}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMeal(formattedDate, mealType)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <span className="text-gray-400">No meal planned</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
