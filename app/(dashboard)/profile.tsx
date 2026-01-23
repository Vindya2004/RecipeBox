import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  TextInput,
  ActivityIndicator
} from "react-native"
import React, { useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useAuth } from "@/hooks/useAuth"
import { useLoader } from "@/hooks/useLoader"
import { logoutUser } from "@/services/authService"
import { updateProfile } from "firebase/auth"
import { auth } from "@/services/firebase"

const Profile = () => {
  const router = useRouter()
  const { user } = useAuth()
  const { showLoader, hideLoader } = useLoader()
  
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.displayName || "")
  const [loading, setLoading] = useState(false)

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
            showLoader()
            try {
              await logoutUser()
              router.replace("/login")
            } catch (error) {
              Alert.alert("Error", "Failed to logout")
            } finally {
              hideLoader()
            }
          }
        }
      ]
    )
  }

  const handleUpdateProfile = async () => {
    if (!name.trim()) {
      Alert.alert("Error", "Name cannot be empty")
      return
    }

    setLoading(true)
    try {
      await updateProfile(auth.currentUser!, {
        displayName: name
      })
      
      Alert.alert("Success", "Profile updated successfully")
      setIsEditing(false)
    } catch (error) {
      Alert.alert("Error", "Failed to update profile")
    } finally {
      setLoading(false)
    }
  }

  const menuItems = [
    {
      icon: "history",
      title: "Recipe History",
      onPress: () => router.push("/recipes")
    },
    {
      icon: "favorite",
      title: "Favorite Recipes",
      onPress: () => Alert.alert("Coming Soon", "This feature will be available soon")
    },
    {
      icon: "settings",
      title: "Settings",
      onPress: () => Alert.alert("Settings", "Settings will be available in next update")
    },
    {
      icon: "help",
      title: "Help & Support",
      onPress: () => router.push("/about")
    }
  ]

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 pt-12 pb-8">
        <View className="items-center">
          <View className="bg-white/20 p-4 rounded-full">
            <MaterialIcons name="person" size={64} color="white" />
          </View>
          
          {isEditing ? (
            <View className="mt-4 w-full max-w-xs">
              <TextInput
                value={name}
                onChangeText={setName}
                className="bg-white p-3 rounded-xl text-gray-800 text-center font-semibold"
                placeholder="Enter your name"
              />
              <View className="flex-row justify-center mt-3 space-x-3">
                <TouchableOpacity
                  onPress={() => setIsEditing(false)}
                  className="bg-gray-500 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleUpdateProfile}
                  disabled={loading}
                  className="bg-green-500 px-4 py-2 rounded-xl"
                >
                  {loading ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Text className="text-white">Save</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <>
              <Text className="text-white text-xl font-bold mt-4">
                {user?.displayName || "User"}
              </Text>
              <Text className="text-white/90 mt-1">
                {user?.email}
              </Text>
              <TouchableOpacity
                onPress={() => setIsEditing(true)}
                className="mt-3 bg-white/20 px-4 py-2 rounded-full"
              >
                <Text className="text-white">Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      {/* Stats */}
      <View className="px-6 -mt-6">
        <View className="flex-row justify-around">
          <View className="bg-white rounded-2xl p-4 shadow-lg w-28 items-center">
            <Text className="text-2xl font-bold text-gray-800">0</Text>
            <Text className="text-gray-600 text-sm">Recipes</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 shadow-lg w-28 items-center">
            <Text className="text-2xl font-bold text-gray-800">0</Text>
            <Text className="text-gray-600 text-sm">Favorites</Text>
          </View>
          <View className="bg-white rounded-2xl p-4 shadow-lg w-28 items-center">
            <Text className="text-2xl font-bold text-gray-800">0</Text>
            <Text className="text-gray-600 text-sm">Categories</Text>
          </View>
        </View>
      </View>

      {/* Menu Items */}
      <View className="p-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">Menu</Text>
        <View className="space-y-3">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={item.onPress}
              className="bg-white rounded-2xl p-4 flex-row items-center shadow-sm"
            >
              <MaterialIcons name={item.icon} size={24} color="#f97316" />
              <Text className="ml-4 text-gray-700 flex-1">{item.title}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-500 rounded-2xl p-4 mt-8 flex-row justify-center items-center"
        >
          <MaterialIcons name="logout" size={20} color="white" />
          <Text className="text-white font-semibold ml-2">Logout</Text>
        </TouchableOpacity>

        {/* Account Info */}
        <View className="bg-white rounded-2xl p-4 mt-6 shadow-sm">
          <Text className="font-semibold text-gray-800 mb-2">Account Information</Text>
          <View className="space-y-2">
            <View className="flex-row">
              <Text className="text-gray-600 w-24">Email:</Text>
              <Text className="text-gray-800 flex-1">{user?.email}</Text>
            </View>
            <View className="flex-row">
              <Text className="text-gray-600 w-24">User ID:</Text>
              <Text className="text-gray-800 flex-1 text-sm" numberOfLines={1}>
                {user?.uid}
              </Text>
            </View>
            <View className="flex-row">
              <Text className="text-gray-600 w-24">Verified:</Text>
              <Text className={`${user?.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                {user?.emailVerified ? 'Yes' : 'No'}
              </Text>
            </View>
          </View>
        </View>

        {/* App Info */}
        <View className="items-center mt-8 mb-12">
          <Text className="text-gray-500">Recipe Finder App</Text>
          <Text className="text-gray-500 text-sm mt-1">Version 1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default Profile