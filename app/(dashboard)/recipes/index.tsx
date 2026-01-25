import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput
} from "react-native"
import React, { useState, useCallback } from "react"
import { useFocusEffect, useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { getAllRecipes, deleteRecipe } from "@/services/recipeService"
import { Recipe } from "@/types/recipe"

const Recipes = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])

  const fetchRecipes = async () => {
    showLoader()
    try {
      const data = await getAllRecipes()
      setRecipes(data)
      setFilteredRecipes(data)
    } catch {
      Alert.alert("Error", "Failed to load recipes")
    } finally {
      hideLoader()
    }
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    if (text.trim() === "") {
      setFilteredRecipes(recipes)
    } else {
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(text.toLowerCase()) ||
        recipe.description.toLowerCase().includes(text.toLowerCase()) ||
        recipe.category.toLowerCase().includes(text.toLowerCase())
      )
      setFilteredRecipes(filtered)
    }
  }


const handleDelete = (id: string) => {
  Alert.alert(
    "Delete Recipe",
    "Are you sure you want to delete this recipe?",
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          showLoader()
          try {
            console.log('Deleting recipe ID:', id)
            
            // Debug - show current recipes
            console.log('Current recipes before delete:', recipes.map(r => ({id: r.id, title: r.title})))
            
            await deleteRecipe(id)
            
            // Refresh the list
            await fetchRecipes()
            
            Alert.alert("Success", "Recipe deleted successfully")
          } catch (error: any) {
            console.error('Full error deleting recipe:', error)
            
            // More specific error messages
            let errorMessage = "Failed to delete recipe"
            if (error.message.includes('not authenticated')) {
              errorMessage = "Please login again"
            } else if (error.message.includes('Unauthorized')) {
              errorMessage = "You can only delete your own recipes"
            } else if (error.message.includes('not found')) {
              errorMessage = "Recipe not found"
            }
            
            Alert.alert("Error", errorMessage)
          } finally {
            hideLoader()
          }
        }
      }
    ]
  )
}
  useFocusEffect(
    useCallback(() => {
      fetchRecipes()
    }, [])
  )

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    })
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          My Recipes ({filteredRecipes.length})
        </Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-2xl p-3 mb-4">
          <MaterialIcons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search recipes..."
            className="flex-1 ml-2 text-gray-800"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>
      </View>

      {/* Recipes List */}
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        {filteredRecipes.length === 0 ? (
          <View className="items-center justify-center py-12">
            <MaterialIcons name="restaurant" size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-4">
              {searchQuery ? "No recipes found" : "No recipes yet"}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                onPress={() => router.push("/recipes/form")}
                className="bg-orange-500 px-6 py-3 rounded-2xl mt-4"
              >
                <Text className="text-white font-semibold">Add Your First Recipe</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredRecipes.map((recipe) => (
            <View
              key={recipe.id}
              className="bg-white rounded-2xl p-4 mb-4 shadow-md"
            >
              <TouchableOpacity
                onPress={() => router.push(`/recipes/${recipe.id}`)}
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800 mb-1">
                      {recipe.title}
                    </Text>
                    <Text className="text-gray-600 mb-2" numberOfLines={2}>
                      {recipe.description}
                    </Text>
                    <View className="flex-row flex-wrap gap-2 mb-3">
                      <View className="bg-orange-100 px-3 py-1 rounded-full">
                        <Text className="text-orange-700 text-sm">
                          {recipe.category}
                        </Text>
                      </View>
                      <View className="bg-blue-100 px-3 py-1 rounded-full">
                        <Text className="text-blue-700 text-sm">
                          {recipe.difficulty}
                        </Text>
                      </View>
                      <View className="bg-green-100 px-3 py-1 rounded-full">
                        <Text className="text-green-700 text-sm">
                          {recipe.prepTime} min
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-500 text-sm">
                    Added: {formatDate(recipe.createdAt)}
                  </Text>
                  <View className="flex-row">
                    <TouchableOpacity
                      onPress={() => router.push(`/recipes/form?recipeId=${recipe.id}`)}
                      className="bg-yellow-500 p-2 rounded-full mr-2"
                    >
                      <MaterialIcons name="edit" size={20} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleDelete(recipe.id)}
                      className="bg-red-500 p-2 rounded-full"
                    >
                      <MaterialIcons name="delete" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity
        className="bg-orange-500 rounded-full shadow-lg absolute bottom-0 right-0 m-6 p-4 z-50"
        onPress={() => router.push("/recipes/form")}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default Recipes