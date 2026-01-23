import { getAuth } from 'firebase/auth'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
  Timestamp
} from 'firebase/firestore'
import { db } from './firebase'
import { Recipe } from '@/types/recipe'

const auth = getAuth()
const recipesCollection = collection(db, 'recipes')

export const addRecipe = async (recipeData: Omit<Recipe, 'id' | 'userId' | 'createdAt'>) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const recipeToAdd = {
    ...recipeData,
    userId: user.uid,
    createdAt: Timestamp.now()
  }

  const docRef = await addDoc(recipesCollection, recipeToAdd)
  
  return {
    id: docRef.id,
    ...recipeToAdd,
    createdAt: new Date().toISOString()
  }
}

export const getAllRecipes = async () => {
  const q = query(recipesCollection, orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    const timestamp = data.createdAt as Timestamp
    
    return {
      id: docSnap.id,
      title: data.title as string,
      description: data.description as string,
      category: data.category as string,
      prepTime: data.prepTime as number,
      servings: data.servings as number,
      difficulty: data.difficulty as string,
      ingredients: data.ingredients as string[],
      instructions: data.instructions as string[],
      userId: data.userId as string,
      createdAt: timestamp ? timestamp.toDate().toISOString() : new Date().toISOString()
    }
  })
}

export const getUserRecipes = async () => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const q = query(
    recipesCollection,
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  )

  const snapshot = await getDocs(q)
  
  return snapshot.docs.map(docSnap => {
    const data = docSnap.data()
    const timestamp = data.createdAt as Timestamp
    
    return {
      id: docSnap.id,
      title: data.title as string,
      description: data.description as string,
      category: data.category as string,
      prepTime: data.prepTime as number,
      servings: data.servings as number,
      difficulty: data.difficulty as string,
      ingredients: data.ingredients as string[],
      instructions: data.instructions as string[],
      userId: data.userId as string,
      createdAt: timestamp ? timestamp.toDate().toISOString() : new Date().toISOString()
    }
  })
}

export const getRecipeById = async (id: string) => {
  const ref = doc(db, 'recipes', id)
  const recipeDoc = await getDoc(ref)
  
  if (!recipeDoc.exists()) throw new Error('Recipe not found')
  
  const data = recipeDoc.data()
  const timestamp = data.createdAt as Timestamp
  
  return {
    id: recipeDoc.id,
    title: data.title as string,
    description: data.description as string,
    category: data.category as string,
    prepTime: data.prepTime as number,
    servings: data.servings as number,
    difficulty: data.difficulty as string,
    ingredients: data.ingredients as string[],
    instructions: data.instructions as string[],
    userId: data.userId as string,
    createdAt: timestamp ? timestamp.toDate().toISOString() : new Date().toISOString()
  }
}

export const updateRecipe = async (
  id: string,
  recipeData: Partial<Omit<Recipe, 'id' | 'userId' | 'createdAt'>>
) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'recipes', id)
  const snap = await getDoc(ref)
  
  if (!snap.exists()) throw new Error('Recipe not found')
  
  const data = snap.data()
  if (data.userId !== user.uid) throw new Error('Unauthorized')
  
  await updateDoc(ref, recipeData)
}

export const deleteRecipe = async (id: string) => {
  const user = auth.currentUser
  if (!user) throw new Error('User not authenticated.')

  const ref = doc(db, 'recipes', id)
  const snap = await getDoc(ref)
  
  if (!snap.exists()) throw new Error('Recipe not found')
  
  if (snap.data().userId !== user.uid) throw new Error('Unauthorized')
  
  await deleteDoc(ref)
}

export const searchRecipes = async (searchQuery: string) => {
  const allRecipes = await getAllRecipes()
  const query = searchQuery.toLowerCase().trim()
  
  return allRecipes.filter(recipe => {
    const inTitle = recipe.title.toLowerCase().includes(query)
    const inDescription = recipe.description.toLowerCase().includes(query)
    const inCategory = recipe.category.toLowerCase().includes(query)
    const inIngredients = recipe.ingredients.some(ing => 
      ing.toLowerCase().includes(query)
    )
    
    return inTitle || inDescription || inCategory || inIngredients
  })
}

export const getRecipeCounts = async () => {
  const allRecipes = await getAllRecipes()
  const userRecipes = await getUserRecipes()
  
  return {
    total: allRecipes.length,
    userRecipes: userRecipes.length
  }
}

export const getRecentRecipes = async (limit: number = 5) => {
  const allRecipes = await getAllRecipes()
  return allRecipes.slice(0, limit)
}