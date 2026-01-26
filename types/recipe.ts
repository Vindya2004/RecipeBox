export interface Recipe {
  id: string
  title: string
  description: string
  category: string
  prepTime: number
  servings: number
  difficulty: string
  ingredients: string[]
  instructions: string[]
  userId: string
  createdAt: string
  imageUrl?: string  // New field for Cloudinary image URL
}