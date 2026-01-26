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
  limit,
  setDoc
} from 'firebase/firestore'
import { db } from './firebase'
import { Recipe } from '@/types/recipe'

const auth = getAuth()
const recipesCollection = collection(db, 'recipes')


// New: Cloudinary config (from your food project)
const CLOUD_NAME = 'dt7qkhaz9';
const UPLOAD_PRESET = 'recipe_upload';  // Use your existing preset or create new one

// New: Cloudinary එකට image upload කරන function
export const uploadImage = async (uri: string): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', {
      uri,
      type: 'image/jpeg',
      name: `recipe-${Date.now()}.jpg`,  // Changed to 'recipe' for naming
    } as any);
    formData.append('upload_preset', UPLOAD_PRESET);
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );
    const data = await response.json();
    if (data.secure_url) {
      console.log('Cloudinary success:', data.secure_url);
      return data.secure_url;
    } else {
      throw new Error(data.error?.message || 'Upload failed');
    }
  } catch (error: any) {
    console.error('Cloudinary error:', error);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};



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
      imageUrl: data.imageUrl as string | undefined,
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
    //orderBy('createdAt', 'desc')
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
      imageUrl: data.imageUrl as string | undefined,
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
     imageUrl: data.imageUrl as string | undefined,
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
         imageUrl: data.imageUrl as string | undefined,
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

///////////////////////
export const findRecipesByIngredientsAndTime = async (
  userIngredients: string[],
  maxTime: number,
  limit: number = 5
): Promise<Recipe[]> => {
  try {
    console.log('Searching recipes with:', {
      ingredients: userIngredients,
      maxTime: maxTime,
      limit: limit
    });

    // 1. Get all recipes from database
    const allRecipes = await getAllRecipes();
    
    if (allRecipes.length === 0) {
      console.log('No recipes found in database');
      return [];
    }

    console.log(`Total recipes in database: ${allRecipes.length}`);

    // 2. Score each recipe based on ingredient matching and time
    const scoredRecipes = allRecipes.map(recipe => {
      let score = 0;
      const matchedIngredients: string[] = [];
      
      // Convert both arrays to lowercase for case-insensitive matching
      const recipeIngredientsLower = recipe.ingredients.map(ing => 
        ing.toLowerCase().trim()
      );
      const userIngredientsLower = userIngredients.map(ing => 
        ing.toLowerCase().trim()
      );
      
      // Check each user ingredient against recipe ingredients
      userIngredientsLower.forEach(userIng => {
        recipeIngredientsLower.forEach(recipeIng => {
          // Check for exact match or partial match
          if (
            recipeIng.includes(userIng) || 
            userIng.includes(recipeIng) ||
            recipeIng.split(' ').some(word => userIng.includes(word)) ||
            userIng.split(' ').some(word => recipeIng.includes(word))
          ) {
            score += 2; // Bonus for ingredient match
            if (!matchedIngredients.includes(userIng)) {
              matchedIngredients.push(userIng);
            }
          }
        });
      });
      
      // Bonus if recipe has most of user's ingredients
      const matchPercentage = userIngredients.length > 0 
        ? matchedIngredients.length / userIngredients.length 
        : 0;
      score += matchPercentage * 10;
      
      // Time constraint - higher score if within time limit
      if (recipe.prepTime <= maxTime) {
        score += 5;
        // Bonus for recipes that use less time than available
        const timeBonus = (maxTime - recipe.prepTime) / 10;
        score += timeBonus;
      } else {
        // Penalty for recipes that exceed time limit
        score -= 3;
      }
      
      // Bonus for recipes with fewer additional ingredients needed
      const additionalIngredients = Math.max(0, recipe.ingredients.length - matchedIngredients.length);
      score -= additionalIngredients * 0.5;
      
      return {
        recipe,
        score,
        matchedIngredients,
        matchPercentage,
        additionalIngredients
      };
    });

    // 3. Filter and sort recipes
    const filteredRecipes = scoredRecipes
      .filter(item => {
        // Include recipes that have at least one matching ingredient AND are within time limit
        return (item.matchedIngredients.length > 0 || item.recipe.prepTime <= maxTime);
      })
      .sort((a, b) => b.score - a.score) // Sort by score descending
      .slice(0, limit) // Take top N recipes
      .map(item => ({
        ...item.recipe,
        matchScore: Math.round(item.score * 100) / 100,
        matchedIngredients: item.matchedIngredients,
        matchPercentage: Math.round(item.matchPercentage * 100),
        additionalIngredients: item.additionalIngredients
      }));

    console.log(`Found ${filteredRecipes.length} matching recipes`);
    
    // Debug: Log the matched recipes
    filteredRecipes.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title} - Score: ${(recipe as any).matchScore}%`);
    });
    
    return filteredRecipes;
    
  } catch (error) {
    console.error('Error in findRecipesByIngredientsAndTime:', error);
    return [];
  }
};

export const generateRecipesFromIngredients = async (
  userIngredients: string[],
  availableTime: number
): Promise<any[]> => {
  try {
    // Filter out empty ingredients
    const filteredIngredients = userIngredients
      .filter(ing => ing.trim() !== "")
      .map(ing => ing.trim().toLowerCase());
    
    if (filteredIngredients.length === 0) {
      throw new Error("Please add at least one ingredient");
    }
    
    if (availableTime <= 0) {
      throw new Error("Please enter a valid time");
    }
    
    console.log('Generating recipes for:', {
      ingredients: filteredIngredients,
      time: availableTime
    });
    
    // Find matching recipes from database
    const matchingRecipes = await findRecipesByIngredientsAndTime(
      filteredIngredients,
      availableTime,
      5 // Limit to 5 recipes
    );
    
    console.log('Matching recipes found:', matchingRecipes.length);
    
    // Format the results
    return matchingRecipes.map(recipe => ({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      category: recipe.category,
      prepTime: recipe.prepTime,
      servings: recipe.servings,
      difficulty: recipe.difficulty,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
      userId: recipe.userId,
      createdAt: recipe.createdAt,
      matchScore: (recipe as any).matchScore || 0,
      matchedIngredients: (recipe as any).matchedIngredients || [],
      matchPercentage: (recipe as any).matchPercentage || 0,
      additionalIngredients: (recipe as any).additionalIngredients || 0
    }));
    
  } catch (error: any) {
    console.error("Error generating recipes:", error);
    throw error;
  }
};

export const addToFavorites = async (recipeId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const favRef = doc(db, 'users', user.uid, 'favorites', recipeId);
  await setDoc(favRef, {
    addedAt: Timestamp.now(),
    recipeId, // optional, for reference
  });
};

// Remove from favorites
export const removeFromFavorites = async (recipeId: string) => {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const favRef = doc(db, 'users', user.uid, 'favorites', recipeId);
  await deleteDoc(favRef);
};

// Check if a recipe is favorited by current user
export const isFavorite = async (recipeId: string): Promise<boolean> => {
  const user = auth.currentUser;
  if (!user) return false;

  const favRef = doc(db, 'users', user.uid, 'favorites', recipeId);
  const docSnap = await getDoc(favRef);
  return docSnap.exists();
};

// Get all favorited recipe IDs for current user
export const getFavoriteRecipeIds = async (): Promise<string[]> => {
  const user = auth.currentUser;
  if (!user) return [];

  const favsCollection = collection(db, 'users', user.uid, 'favorites');
  const snapshot = await getDocs(favsCollection);
  return snapshot.docs.map(doc => doc.id);
};
