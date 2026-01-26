import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  Image
} from "react-native"
import React, { useState, useCallback } from "react"
import { useFocusEffect, useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { getUserRecipes, deleteRecipe } from "@/services/recipeService"
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
      const data = await getUserRecipes()
      setRecipes(data)
      setFilteredRecipes(data)
    } catch (error: any) {
      console.error("Error fetching user recipes:", error)
      Alert.alert("Error", error.message || "Failed to load your recipes")
    } finally {
      hideLoader()
    }
  }

  const handleSearch = (text: string) => {
    setSearchQuery(text)
    if (text.trim() === "") {
      setFilteredRecipes(recipes)
    } else {
      const lowerText = text.toLowerCase()
      const filtered = recipes.filter(recipe =>
        recipe.title.toLowerCase().includes(lowerText) ||
        recipe.description.toLowerCase().includes(lowerText) ||
        recipe.category.toLowerCase().includes(lowerText)
      )
      setFilteredRecipes(filtered)
    }
  }

  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Recipe",
      "Are you sure you want to delete this recipe? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            showLoader()
            try {
              await deleteRecipe(id)
              await fetchRecipes()
              Alert.alert("Success", "Recipe deleted successfully")
            } catch (error: any) {
              let msg = "Failed to delete recipe"
              if (error.message?.includes("not authenticated")) msg = "Please login again"
              else if (error.message?.includes("Unauthorized")) msg = "You can only delete your own recipes"
              else if (error.message?.includes("not found")) msg = "Recipe not found"
              Alert.alert("Error", msg)
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
      <View className="bg-white px-6 pt-14 pb-5 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          My Recipes {filteredRecipes.length > 0 && `(${filteredRecipes.length})`}
        </Text>

        <View className="flex-row items-center bg-gray-100 rounded-2xl px-4 py-3">
          <MaterialIcons name="search" size={22} color="#6b7280" />
          <TextInput
            placeholder="Search your recipes..."
            className="flex-1 ml-2 text-gray-800"
            value={searchQuery}
            onChangeText={handleSearch}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* List */}
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        {filteredRecipes.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialIcons name="restaurant-menu" size={80} color="#d1d5db" />
            <Text className="text-gray-500 text-lg mt-5 text-center">
              {searchQuery ? "No matching recipes found" : "You haven't added any recipes yet"}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                onPress={() => router.push("/recipes/form")}
                className="mt-6 bg-orange-600 px-8 py-4 rounded-2xl shadow-md"
              >
                <Text className="text-white font-semibold text-base">Add Your First Recipe</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          filteredRecipes.map((recipe) => (
            <View
              key={recipe.id}
              className="bg-white rounded-2xl mb-5 shadow-md overflow-hidden"
            >
              {recipe.imageUrl && (
                <Image
                  source={{ uri: recipe.imageUrl }}
                  className="w-full h-44"
                  resizeMode="cover"
                />
              )}

              <View className="p-5">
                <TouchableOpacity
                  onPress={() => router.push(`/recipes/${recipe.id}`)}
                >
                  <Text className="text-xl font-bold text-gray-800 mb-2" numberOfLines={2}>
                    {recipe.title}
                  </Text>

                  <Text className="text-gray-600 mb-3" numberOfLines={2}>
                    {recipe.description}
                  </Text>

                  <View className="flex-row flex-wrap gap-2 mb-4">
                    <View className="bg-orange-100 px-3 py-1 rounded-full">
                      <Text className="text-orange-700 text-sm font-medium">{recipe.category}</Text>
                    </View>
                    <View className="bg-blue-100 px-3 py-1 rounded-full">
                      <Text className="text-blue-700 text-sm font-medium">{recipe.difficulty}</Text>
                    </View>
                    <View className="bg-green-100 px-3 py-1 rounded-full">
                      <Text className="text-green-700 text-sm font-medium">{recipe.prepTime} min</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-500 text-sm">
                    Added {formatDate(recipe.createdAt)}
                  </Text>

                  <View className="flex-row gap-3">
                    <TouchableOpacity
                      onPress={() => router.push(`/recipes/form?recipeId=${recipe.id}`)}
                      className="bg-amber-500 p-3 rounded-full"
                    >
                      <MaterialIcons name="edit" size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => handleDelete(recipe.id)}
                      className="bg-red-500 p-3 rounded-full"
                    >
                      <MaterialIcons name="delete" size={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        className="absolute bottom-8 right-6 bg-orange-600 w-16 h-16 rounded-full items-center justify-center shadow-2xl"
        onPress={() => router.push("/recipes/form")}
      >
        <MaterialIcons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  )
}

export default Recipes