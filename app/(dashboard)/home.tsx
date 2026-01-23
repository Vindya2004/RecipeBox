import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native"
import React, { useEffect, useState } from "react"
import { useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "@/hooks/useAuth"
import { getRecipeCounts, getRecentRecipes } from "@/services/recipeService"
import { Recipe } from "@/types/recipe"

const Home = () => {
  const router = useRouter()
  const { user } = useAuth()
  const [recipeCounts, setRecipeCounts] = useState({ total: 0, userRecipes: 0 })
  const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const counts = await getRecipeCounts()
      const recipes = await getRecentRecipes()
      setRecipeCounts(counts)
      setRecentRecipes(recipes.slice(0, 3))
    } catch (error) {
      console.error("Error loading home data:", error)
    }
  }

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 p-6 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold">Recipe Finder</Text>
        <Text className="text-orange-100 text-lg mt-2">
          Welcome back, {user?.displayName || "Chef"}!
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="flex-row justify-around mx-6 -mt-8">
        <View className="bg-white p-4 rounded-2xl shadow-lg w-2/5 items-center">
          <Text className="text-2xl font-bold text-gray-800">{recipeCounts.total}</Text>
          <Text className="text-gray-600 mt-1">Total Recipes</Text>
        </View>
        
        <View className="bg-white p-4 rounded-2xl shadow-lg w-2/5 items-center">
          <Text className="text-2xl font-bold text-gray-800">{recipeCounts.userRecipes}</Text>
          <Text className="text-gray-600 mt-1">Your Recipes</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="mt-8 px-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity 
            className="bg-white p-4 rounded-2xl shadow-md w-2/5 items-center"
            onPress={() => router.push("/search")}
          >
            <MaterialIcons name="search" size={32} color="#f97316" />
            <Text className="text-gray-800 font-medium mt-2">Search</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="bg-white p-4 rounded-2xl shadow-md w-2/5 items-center"
            onPress={() => router.push("/recipes/form")}
          >
            <MaterialIcons name="add-circle" size={32} color="#f97316" />
            <Text className="text-gray-800 font-medium mt-2">Add Recipe</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Recipes */}
      <View className="mt-8 px-6 mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold text-gray-800">Recent Recipes</Text>
          <TouchableOpacity onPress={() => router.push("/recipes")}>
            <Text className="text-orange-500 font-medium">View All</Text>
          </TouchableOpacity>
        </View>

        {recentRecipes.length > 0 ? (
          recentRecipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id}
              className="bg-white p-4 rounded-2xl shadow-md mb-4"
              onPress={() => router.push(`/recipes/${recipe.id}`)}
            >
              <Text className="text-lg font-semibold text-gray-800">{recipe.title}</Text>
              <Text className="text-gray-600 mt-1">
                {recipe.category} • {recipe.prepTime} mins
              </Text>
              <Text className="text-gray-500 mt-2" numberOfLines={2}>
                {recipe.description}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white p-8 rounded-2xl items-center">
            <MaterialIcons name="restaurant" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-center">No recipes yet. Add your first recipe!</Text>
          </View>
        )}
      </View>
    </ScrollView>
  )
}

export default Home