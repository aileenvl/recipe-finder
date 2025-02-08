import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Users, Flame, ChevronLeft } from "lucide-react"
import Link from "next/link"

interface PageProps {
  params: {
    id: string
    name: string
  }
}

export default function RecipePage({ params }: PageProps) {
  // This would typically fetch from an API using the ID
  const recipe = {
    id: params.id,
    name: decodeURIComponent(params.name),
    category: "Lunch/Snacks",
    description:
      "This recipe is a great way to mix up the traditional preparation of hot dogs. Kids love it and adults enjoy the unique approach. Vegetarians can substitute hot dogs with soy wieners.",
    totalTime: "PT1H10M",
    servings: "8",
    calories: 179,
    ingredients: [
      "8 hot dogs",
      "8 hot dog buns",
      "1 cup BBQ sauce",
      "1 onion, diced",
      "Optional toppings: mustard, relish",
    ],
    instructions: [
      "Preheat your grill to medium-high heat",
      "Grill the hot dogs for 5-7 minutes, turning occasionally",
      "Warm the buns on the grill for 1-2 minutes",
      "Place hot dogs in buns and top with BBQ sauce",
      "Add diced onions and other toppings as desired",
      "Serve immediately while hot",
    ],
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link href="/" className="inline-flex items-center gap-2 mb-6 hover:text-purple-600">
        <ChevronLeft className="w-4 h-4" />
        Back to recipes
      </Link>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-3xl font-bold mb-2">{recipe.name}</CardTitle>
              <Badge variant="secondary" className="mb-4">
                {recipe.category}
              </Badge>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {recipe.totalTime.replace("PT", "").replace("M", " mins")}
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                Serves {recipe.servings}
              </div>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4" />
                {recipe.calories} cal
              </div>
            </div>
          </div>
          <p className="text-muted-foreground">{recipe.description}</p>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                    {ingredient}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-4">Instructions</h2>
              <ol className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <li key={index} className="flex gap-4">
                    <span className="font-bold text-purple-600">{index + 1}.</span>
                    {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

