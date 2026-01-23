import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import React, { useEffect, useState } from "react"
import { useLocalSearchParams, useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { getRecipeById } from "@/services/recipeService"
import { Recipe } from "@/types/recipe"

const RecipeDetail = () => {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const { showLoader, hideLoader } = useLoader()
  const [recipe, setRecipe] = useState<Recipe | null>(null)

  useEffect(() => {
    if (id) {
      loadRecipe()
    }
  }, [id])

  const loadRecipe = async () => {
    showLoader()
    try {
      const data = await getRecipeById(id as string)
      setRecipe(data)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load recipe")
      router.back()
    } finally {
      hideLoader()
    }
  }

  if (!recipe) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Back Button */}
      <TouchableOpacity
        className="flex-row items-center p-4"
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#333" />
        <Text className="text-gray-800 font-medium ml-2">Back</Text>
      </TouchableOpacity>

      {/* Recipe Content */}
      <View className="bg-white mx-4 rounded-2xl shadow-lg p-6">
        {/* Title and Actions */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800">{recipe.title}</Text>
            <View className="flex-row items-center mt-2">
              <View className="bg-orange-100 px-3 py-1 rounded-full">
                <Text className="text-orange-700 font-medium">{recipe.category}</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full ml-2">
                <Text className="text-blue-700 font-medium">{recipe.prepTime} mins</Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => router.push({ pathname: "/recipes/form", params: { recipeId: id } })}
            className="p-2 rounded-full bg-orange-500"
          >
            <MaterialIcons name="edit" size={24} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Description</Text>
          <Text className="text-gray-600">{recipe.description}</Text>
        </View>

        {/* Ingredients */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <MaterialIcons name="circle" size={8} color="#f97316" />
              <Text className="text-gray-700 ml-3">{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Instructions</Text>
          {recipe.instructions.map((step, index) => (
            <View key={index} className="mb-3">
              <Text className="font-medium text-gray-800">Step {index + 1}</Text>
              <Text className="text-gray-600 ml-4">{step}</Text>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View className="bg-gray-50 p-4 rounded-xl">
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Servings</Text>
            <Text className="font-medium">{recipe.servings} people</Text>
          </View>
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Difficulty</Text>
            <Text className="font-medium">{recipe.difficulty}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-gray-600">Added</Text>
            <Text className="font-medium">
              {new Date(recipe.createdAt).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  )
}

export default RecipeDetail