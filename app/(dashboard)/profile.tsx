// import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native"
// import React from "react"
// import { MaterialIcons } from "@expo/vector-icons"
// import { useRouter } from "expo-router"
// import { useAuth } from "@/hooks/useAuth"
// import { logoutUser } from "@/services/authService"

// const Profile = () => {
//   const router = useRouter()
//   const { user } = useAuth()

//   const handleLogout = async () => {
//     Alert.alert(
//       "Logout",
//       "Are you sure you want to logout?",
//       [
//         { text: "Cancel", style: "cancel" },
//         {
//           text: "Logout",
//           style: "destructive",
//           onPress: async () => {
//             try {
//               await logoutUser()
//               router.replace("/login")
//             } catch (error) {
//               Alert.alert("Error", "Failed to logout")
//             }
//           }
//         }
//       ]
//     )
//   }

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       {/* Profile Header */}
//       <View className="bg-orange-500 p-8 rounded-b-3xl">
//         <View className="items-center">
//           <View className="bg-white p-4 rounded-full">
//             <MaterialIcons name="person" size={64} color="#f97316" />
//           </View>
//           <Text className="text-white text-2xl font-bold mt-4">
//             {user?.displayName || "User"}
//           </Text>
//           <Text className="text-orange-100 mt-2">{user?.email}</Text>
//         </View>
//       </View>

//       {/* Stats */}
//       <View className="mx-6 -mt-8 bg-white rounded-2xl shadow-lg p-6">
//         <View className="flex-row justify-between">
//           <View className="items-center">
//             <Text className="text-2xl font-bold text-gray-800">0</Text>
//             <Text className="text-gray-600 mt-1">Recipes</Text>
//           </View>
//           <View className="items-center">
//             <Text className="text-2xl font-bold text-gray-800">0</Text>
//             <Text className="text-gray-600 mt-1">Favorites</Text>
//           </View>
//           <View className="items-center">
//             <Text className="text-2xl font-bold text-gray-800">0</Text>
//             <Text className="text-gray-600 mt-1">Reviews</Text>
//           </View>
//         </View>
//       </View>

//       {/* Menu Options */}
//       <View className="mt-8 mx-6">
//         <Text className="text-xl font-bold text-gray-800 mb-4">Account</Text>
        
//         {[
//           { icon: "restaurant", label: "My Recipes", onPress: () => router.push("/recipes") },
//           { icon: "favorite", label: "Favorites", onPress: () => Alert.alert("Coming Soon") },
//           { icon: "history", label: "Recent Views", onPress: () => Alert.alert("Coming Soon") },
//           { icon: "settings", label: "Settings", onPress: () => Alert.alert("Coming Soon") },
//           { icon: "help", label: "Help & Support", onPress: () => Alert.alert("Coming Soon") },
//           { icon: "info", label: "About", onPress: () => router.push("/about") },
//         ].map((item, index) => (
//           <TouchableOpacity
//             key={index}
//             className="flex-row items-center bg-white p-4 rounded-xl mb-3"
//             onPress={item.onPress}
//           >
//             <MaterialIcons name={item.icon as any} size={24} color="#6b7280" />
//             <Text className="text-gray-800 ml-4 flex-1">{item.label}</Text>
//             <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
//           </TouchableOpacity>
//         ))}
//       </View>

//       {/* Logout Button */}
//       <TouchableOpacity
//         className="mx-6 my-8 bg-red-500 p-4 rounded-xl flex-row items-center justify-center"
//         onPress={handleLogout}
//       >
//         <MaterialIcons name="logout" size={20} color="#fff" />
//         <Text className="text-white font-semibold ml-2">Logout</Text>
//       </TouchableOpacity>

//       <View className="h-8" />
//     </ScrollView>
//   )
// }

// export default Profile

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