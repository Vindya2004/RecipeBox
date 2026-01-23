import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert
} from "react-native"
import React, { useState, useCallback } from "react"
import { useFocusEffect, useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { searchRecipes, getRecipeCounts } from "@/services/recipeService"
import { Recipe } from "@/types/recipe"

const Home = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [searchQuery, setSearchQuery] = useState("")
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [stats, setStats] = useState({
    total: 0,
    categories: 0
  })

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      Alert.alert("Please enter a search term")
      return
    }
    
    showLoader()
    try {
      const results = await searchRecipes(searchQuery)
      setRecipes(results)
    } catch (error) {
      Alert.alert("Error", "Failed to search recipes")
    } finally {
      hideLoader()
    }
  }

  const fetchStats = async () => {
    try {
      const counts = await getRecipeCounts()
      setStats({
        total: counts.total,
        categories: counts.categories
      })
    } catch (error) {
      console.error("Failed to fetch stats:", error)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchStats()
    }, [])
  )

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 pt-12 pb-8">
        <Text className="text-3xl font-bold text-white mb-2">
          Find Delicious Recipes
        </Text>
        <Text className="text-white/90 mb-6">
          Discover amazing recipes from around the world
        </Text>
        
        {/* Search Bar */}
        <View className="flex-row bg-white rounded-2xl p-2">
          <TextInput
            placeholder="Search recipes..."
            className="flex-1 p-3 text-gray-800"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity 
            onPress={handleSearch}
            className="bg-orange-500 p-3 rounded-xl ml-2"
          >
            <MaterialIcons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row justify-around mx-6 -mt-4">
        <View className="bg-white rounded-2xl p-4 shadow-lg w-40">
          <Text className="text-2xl font-bold text-gray-800">{stats.total}</Text>
          <Text className="text-gray-600">Total Recipes</Text>
        </View>
        <View className="bg-white rounded-2xl p-4 shadow-lg w-40">
          <Text className="text-2xl font-bold text-gray-800">{stats.categories}</Text>
          <Text className="text-gray-600">Categories</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between">
          <TouchableOpacity 
            onPress={() => router.push("/recipes/form")}
            className="bg-orange-500 rounded-2xl p-4 mb-4 w-48 items-center"
          >
            <MaterialIcons name="add-circle" size={32} color="white" />
            <Text className="text-white font-semibold mt-2">Add Recipe</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => router.push("/recipes")}
            className="bg-amber-500 rounded-2xl p-4 mb-4 w-48 items-center"
          >
            <MaterialIcons name="list" size={32} color="white" />
            <Text className="text-white font-semibold mt-2">View All</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Results */}
      {recipes.length > 0 && (
        <View className="px-6 pb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Search Results
          </Text>
          {recipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              onPress={() => router.push(`/recipes/${recipe.id}`)}
              className="bg-white rounded-2xl p-4 mb-4 shadow-md"
            >
              <Text className="text-lg font-semibold text-gray-800 mb-2">
                {recipe.title}
              </Text>
              <Text className="text-gray-600 mb-2" numberOfLines={2}>
                {recipe.description}
              </Text>
              <View className="flex-row justify-between">
                <Text className="text-gray-500 text-sm">
                  {recipe.category} • {recipe.cookingTime} min
                </Text>
                <Text className="text-orange-500 font-semibold">
                  {recipe.difficulty}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Featured Categories */}
      <View className="px-6 pb-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["Vegetarian", "Dessert", "Quick Meals", "Healthy", "Italian", "Asian"].map((cat) => (
            <TouchableOpacity 
              key={cat}
              className="bg-white rounded-2xl p-4 mr-4 shadow-md"
            >
              <Text className="font-semibold text-gray-800">{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  )
}

export default Home