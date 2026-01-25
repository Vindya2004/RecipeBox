import { View, Text, TouchableOpacity } from "react-native"
import React from "react"
import { MaterialIcons } from "@expo/vector-icons"

interface ProfileMenuItemProps {
  icon: keyof typeof MaterialIcons.glyphMap
  label: string
  onPress: () => void
  showChevron?: boolean
  color?: string
  badge?: string | number
}

const ProfileMenuItem = ({
  icon,
  label,
  onPress,
  showChevron = true,
  color = "#6b7280",
  badge
}: ProfileMenuItemProps) => {
  return (
    <TouchableOpacity
      className="flex-row items-center bg-white p-4 rounded-xl mb-3 active:bg-gray-50"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="p-2 rounded-lg" style={{ backgroundColor: `${color}15` }}>
        <MaterialIcons name={icon} size={20} color={color} />
      </View>
      
      <View className="flex-1 flex-row items-center justify-between ml-4">
        <Text className="text-gray-800 text-base font-medium">{label}</Text>
        
        <View className="flex-row items-center">
          {badge && (
            <View className="bg-orange-500 rounded-full px-2 py-1 mr-2 min-w-6">
              <Text className="text-white text-xs font-bold text-center">
                {badge}
              </Text>
            </View>
          )}
          
          {showChevron && (
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ProfileMenuItem