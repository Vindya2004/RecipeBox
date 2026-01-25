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
  Timestamp,
  limit
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


export const deleteRecipe = async (id: string): Promise<void> => {
  try {
    console.log('deleteRecipe called with ID:', id)
    
    const user = auth.currentUser
    if (!user) {
      console.error('No authenticated user found')
      throw new Error('User not authenticated. Please login again.')
    }

    console.log('Current user UID:', user.uid)
    
    const ref = doc(db, 'recipes', id)
    console.log('Document reference created:', ref.path)
    
    const snap = await getDoc(ref)
    console.log('Document snapshot exists:', snap.exists())
    
    if (!snap.exists()) {
      throw new Error(`Recipe with ID ${id} not found`)
    }
    
    const data = snap.data()
    console.log('Recipe data:', {
      id: id,
      title: data.title,
      userId: data.userId,
      currentUser: user.uid
    })
    
    if (data.userId !== user.uid) {
      console.error('User mismatch:', {
        recipeUserId: data.userId,
        currentUserId: user.uid
      })
      throw new Error('Unauthorized: You can only delete your own recipes')
    }
    
    console.log('Proceeding to delete...')
    await deleteDoc(ref)
    console.log('Recipe deleted successfully')
    
  } catch (error: any) {
    console.error('Error in deleteRecipe:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    })
    throw error
  }
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

// export const getRecipeCounts = async () => {
//   const allRecipes = await getAllRecipes()
//   const userRecipes = await getUserRecipes()
  
//   return {
//     total: allRecipes.length,
//     userRecipes: userRecipes.length
//   }
// }

export const getRecipeCounts = async () => {
  try {
    // Total count - better to use aggregation later, but for now:
    const totalSnap = await getDocs(collection(db, 'recipes'))
    const total = totalSnap.size

    const user = auth.currentUser
    let userCount = 0

    if (user) {
      const q = query(
        collection(db, 'recipes'),
        where('userId', '==', user.uid)
      )
      const userSnap = await getDocs(q)
      userCount = userSnap.size
    }

    return {
      total,
      userRecipes: userCount
    }
  } catch (err) {
    console.error("getRecipeCounts failed:", err)
    return { total: 0, userRecipes: 0 }
  }
}

// export const getRecentRecipes = async (limit: number = 5) => {
//   const allRecipes = await getAllRecipes()
//   return allRecipes.slice(0, limit)
// }

// ... other imports and functions remain unchanged ...

export const getRecentRecipes = async (limitNum = 5): Promise<Recipe[]> => {
  try {
    const q = query(
      collection(db, "recipes"),
      orderBy("createdAt", "desc"),
      limit(limitNum)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log("No recent recipes found in query");
    }

    return snapshot.docs.map((docSnap) => {
      const data = docSnap.data();
      const timestamp = data.createdAt as Timestamp | undefined;

      return {
        id: docSnap.id,
        title: (data.title as string) || "Untitled",
        description: (data.description as string) || "",
        category: (data.category as string) || "Uncategorized",
        prepTime: (data.prepTime as number) || 0,
        servings: (data.servings as number) || 1,
        difficulty: (data.difficulty as string) || "Medium",
        ingredients: (data.ingredients as string[]) || [],
        instructions: (data.instructions as string[]) || [],
        userId: (data.userId as string) || "",
        createdAt: timestamp ? timestamp.toDate().toISOString() : new Date().toISOString(),
      } satisfies Recipe;
    });
  } catch (err: any) {
    console.error("getRecentRecipes failed:", err.message || err);
    if (err.code === "failed-precondition" || err.code === "permission-denied") {
      console.warn("→ Probably missing index or rules issue. Check Firebase console.");
    }
    return [];
  }
};
