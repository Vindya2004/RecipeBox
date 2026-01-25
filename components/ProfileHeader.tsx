import { View, Text, TouchableOpacity } from "react-native"
import React from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useAuth } from "@/hooks/useAuth"

interface ProfileHeaderProps {
  onEditPress?: () => void
}

const ProfileHeader = ({ onEditPress }: ProfileHeaderProps) => {
  const { user } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <View className="bg-orange-500 p-8 rounded-b-3xl relative">
      {/* Edit Profile Button */}
      {onEditPress && (
        <TouchableOpacity
          className="absolute top-4 right-4 z-10 bg-white/20 p-2 rounded-full"
          onPress={onEditPress}
        >
          <MaterialIcons name="edit" size={20} color="white" />
        </TouchableOpacity>
      )}

      <View className="items-center">
        {/* Profile Avatar */}
        <View className="relative">
          <View className="bg-white p-6 rounded-full">
            {user?.photoURL ? (
              // You can add an Image component here for profile picture
              <MaterialIcons name="person" size={64} color="#f97316" />
            ) : (
              <View className="w-16 h-16 rounded-full bg-orange-100 items-center justify-center">
                <Text className="text-2xl font-bold text-orange-600">
                  {user?.displayName ? getInitials(user.displayName) : "U"}
                </Text>
              </View>
            )}
          </View>
          
          {/* Online Status Indicator */}
          <View className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </View>

        {/* User Info */}
        <Text className="text-white text-2xl font-bold mt-4">
          {user?.displayName || "User"}
        </Text>
        <Text className="text-orange-100 mt-2">{user?.email}</Text>
        
        {/* Member Since */}
        {user?.metadata?.creationTime && (
          <View className="flex-row items-center mt-3 bg-white/20 px-3 py-1 rounded-full">
            <MaterialIcons name="calendar-today" size={14} color="#fed7aa" />
            <Text className="text-orange-100 text-sm ml-1">
              Member since {new Date(user.metadata.creationTime).getFullYear()}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

export default ProfileHeader