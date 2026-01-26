import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native"
import React from "react"
import { useRouter } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { logoutUser } from "@/services/authService"
import ProfileHeader from "@/components/ProfileHeader"
import ProfileStats from "@/components/ProfileState"
import ProfileMenuItem from "@/components/ProfileMenuItem"

const Profile = () => {
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            try {
              await logoutUser()
              router.replace("/login")
            } catch (error) {
              Alert.alert("Error", "Failed to logout")
            }
          }
        }
      ]
    )
  }

  const menuItems = [
    { 
      icon: "restaurant", 
      label: "My Recipes", 
      onPress: () => router.push("/recipes"),
      //badge: "12" // Dynamic value can be passed
    },
    { 
      icon: "favorite", 
      label: "Favorites", 
      onPress: () => Alert.alert("Coming Soon", "Favorites feature is coming soon!"),
      color: "#ef4444"
    },
    { 
      icon: "history", 
      label: "Recent Views", 
      onPress: () => Alert.alert("Coming Soon", "Recent views feature is coming soon!")
    },
    { 
      icon: "notifications", 
      label: "Notifications", 
      onPress: () => Alert.alert("Coming Soon", "Notifications feature is coming soon!"),
      badge: "3"
    },
    { 
      icon: "settings", 
      label: "Settings", 
      onPress: () => router.push("/(dashboard)/settings")
    },
    { 
      icon: "help", 
      label: "Help & Support", 
      onPress: () => Alert.alert("Help", "Contact support@recipefinder.com"),
      color: "#10b981"
    },
    { 
      icon: "info", 
      label: "About", 
      onPress: () => router.push("/about"),
      color: "#3b82f6"
    },
  ]

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature is coming soon!")
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Profile Header */}
      <ProfileHeader onEditPress={handleEditProfile} />

      {/* Stats */}
      <ProfileStats />

      {/* Menu Options */}
      <View className="mt-8 mx-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Account</Text>
        
        {menuItems.map((item, index) => (
          <ProfileMenuItem
            key={index}
            icon={item.icon as any}
            label={item.label}
            onPress={item.onPress}
            color={item.color}
            badge={item.badge}
          />
        ))}
      </View>

      {/* App Info */}
      <View className="mx-6 mt-6 bg-white rounded-2xl p-5">
        <View className="flex-row items-center mb-3">
          <View className="bg-orange-100 p-2 rounded-lg">
            <Text className="text-orange-600 text-lg font-bold">RF</Text>
          </View>
          <View className="ml-3">
            <Text className="text-gray-800 font-semibold">Recipe Finder</Text>
            <Text className="text-gray-500 text-sm">Version 1.0.0</Text>
          </View>
        </View>
        <Text className="text-gray-600 text-sm">
          Discover, create, and share amazing recipes with the community.
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        className="mx-6 my-8 bg-red-500 p-4 rounded-2xl flex-row items-center justify-center active:bg-red-600 position-absolute bottom-7"
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <View className="p-1 bg-white/20 rounded-full">
          <Text className="text-white text-lg font-bold">←</Text>
        </View>
        <Text className="text-white font-semibold ml-3 text-lg">Logout</Text>
      </TouchableOpacity>

      <View className="h-8" />
    </ScrollView>
  )
}

export default Profile