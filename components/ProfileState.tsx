import { View, Text } from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { getUserRecipes } from "@/services/recipeService"

const ProfileStats = () => {
  const [stats, setStats] = useState({
    recipes: 0,
    favorites: 0,
    reviews: 0
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const userRecipes = await getUserRecipes()
      setStats({
        recipes: userRecipes.length,
        favorites: 0, // You can implement favorites functionality later
        reviews: 0    // You can implement reviews functionality later
      })
    } catch (error) {
      console.error("Failed to load profile stats:", error)
    }
  }

  const statItems = [
    { 
      value: stats.recipes, 
      label: "Recipes",
      icon: "restaurant" as const,
      color: "#f97316" // Orange
    },
    { 
      value: stats.favorites, 
      label: "Favorites",
      icon: "favorite" as const,
      color: "#ef4444" // Red
    },
    { 
      value: stats.reviews, 
      label: "Reviews",
      icon: "rate-review" as const,
      color: "#3b82f6" // Blue
    }
  ]

  return (
    <View className="mx-6 -mt-8 bg-white rounded-2xl shadow-lg p-6">
      <View className="flex-row justify-between">
        {statItems.map((item, index) => (
          <View key={index} className="items-center">
            <View className="p-3 rounded-full mb-2" style={{ backgroundColor: `${item.color}15` }}>
              <MaterialIcons name={item.icon} size={24} color={item.color} />
            </View>
            <Text className="text-2xl font-bold text-gray-800">{item.value}</Text>
            <Text className="text-gray-600 mt-1">{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default ProfileStats