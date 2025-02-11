import { useState } from 'react';
import { format, startOfWeek, addDays } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Recipe } from '@/utils/recipeValidator';
import { useRouter } from 'next/navigation';

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface AddToWeeklyMealProps {
  recipe: Recipe;
}

export default function AddToWeeklyMeal({ recipe }: AddToWeeklyMealProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const getDaysOfWeek = () => {
    const start = startOfWeek(new Date(), { weekStartsOn: 1 });
    return Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      return {
        date,
        dayName: format(date, 'EEEE'),
        formattedDate: format(date, 'yyyy-MM-dd'),
      };
    });
  };

  const addToMeal = (date: string, mealType: MealType) => {
    try {
      // Get existing meals
      const savedMeals = localStorage.getItem('weeklyMeals');
      const weeklyMeals = savedMeals ? JSON.parse(savedMeals) : {};

      // Initialize the date object if it doesn't exist
      if (!weeklyMeals[date]) {
        weeklyMeals[date] = {
          breakfast: null,
          lunch: null,
          dinner: null,
        };
      }

      // Add the recipe to the specified meal slot
      weeklyMeals[date][mealType] = {
        id: recipe.id,
        title: recipe.name,
        name: recipe.name,
        description: recipe.description,
        images: recipe.images,
        category: recipe.category,
        timing: recipe.timing,
        servings: recipe.servings,
        nutrition: recipe.nutrition
      };

      // Save back to localStorage
      localStorage.setItem('weeklyMeals', JSON.stringify(weeklyMeals));
      
      // Close the dialog
      setIsOpen(false);
      
      // Force a refresh of the weekly meals page if we're on it
      router.refresh();
    } catch (error) {
      console.error('Error adding meal to planner:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add to Weekly Meal Plan</Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add "{recipe.name}" to Weekly Meal Plan</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {getDaysOfWeek().map(({ dayName, formattedDate }) => (
            <div key={formattedDate} className="border rounded-lg p-4">
              <h3 className="font-medium mb-2">{dayName}</h3>
              <div className="flex gap-2">
                {(['breakfast', 'lunch', 'dinner'] as MealType[]).map((mealType) => (
                  <Button
                    key={`${formattedDate}-${mealType}`}
                    variant="outline"
                    size="sm"
                    onClick={() => addToMeal(formattedDate, mealType)}
                  >
                    {mealType}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
