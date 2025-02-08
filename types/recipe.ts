export interface Recipe {
  id: string
  name: string
  category: string
  description: string
  totalTime: string
  servings: string | number
  calories: number
  ingredients: string[]
  instructions: string[]
}

