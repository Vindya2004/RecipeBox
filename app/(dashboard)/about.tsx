import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native"
import React from "react"
import { MaterialIcons } from "@expo/vector-icons"

const About = () => {
  const features = [
    {
      icon: "search",
      title: "Search Recipes",
      description: "Find recipes by name, ingredients, or category"
    },
    {
      icon: "add-circle",
      title: "Add Recipes",
      description: "Create and save your own recipes with ingredients and instructions"
    },
    {
      icon: "edit",
      title: "Edit & Update",
      description: "Modify your recipes anytime"
    },
    {
      icon: "delete",
      title: "Delete Recipes",
      description: "Remove recipes you no longer need"
    },
    {
      icon: "category",
      title: "Categories",
      description: "Organize recipes by categories"
    },
    {
      icon: "security",
      title: "Secure",
      description: "Your recipes are private and secure"
    }
  ]

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 pt-12 pb-8">
        <Text className="text-3xl font-bold text-white text-center mb-4">
          Recipe Finder
        </Text>
        <Text className="text-white/90 text-center">
          Your personal recipe collection
        </Text>
      </View>

      {/* App Info */}
      <View className="p-6">
        <View className="bg-white rounded-2xl p-6 mb-6 shadow-md">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            About This App
          </Text>
          <Text className="text-gray-600 mb-4">
            Recipe Finder is a mobile application built with React Native and Expo Go. 
            It allows you to store, search, and manage your favorite recipes in one place.
          </Text>
          
          <Text className="text-gray-600">
            This app demonstrates CRUD operations with Firebase Firestore and includes 
            user authentication using Firebase Auth.
          </Text>
        </View>

        {/* Features */}
        <Text className="text-xl font-bold text-gray-800 mb-4">Features</Text>
        <View className="space-y-4">
          {features.map((feature, index) => (
            <View key={index} className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="flex-row items-center mb-2">
                <View className="bg-orange-100 p-2 rounded-full mr-3">
                  <MaterialIcons name={feature.icon} size={24} color="#f97316" />
                </View>
                <Text className="font-semibold text-gray-800">
                  {feature.title}
                </Text>
              </View>
              <Text className="text-gray-600 ml-11">
                {feature.description}
              </Text>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <View className="bg-white rounded-2xl p-6 mt-6 shadow-md">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Technology Stack
          </Text>
          <View className="space-y-3">
            <View className="flex-row items-center">
              <MaterialIcons name="code" size={20} color="#f97316" />
              <Text className="ml-3 text-gray-700">React Native with TypeScript</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="explicit" size={20} color="#f97316" />
              <Text className="ml-3 text-gray-700">Expo Go</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="cloud" size={20} color="#f97316" />
              <Text className="ml-3 text-gray-700">Firebase Authentication</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="storage" size={20} color="#f97316" />
              <Text className="ml-3 text-gray-700">Firestore Database</Text>
            </View>
            <View className="flex-row items-center">
              <MaterialIcons name="smartphone" size={20} color="#f97316" />
              <Text className="ml-3 text-gray-700">NativeWind (Tailwind CSS)</Text>
            </View>
          </View>
        </View>

        {/* Contact/Info */}
        <View className="bg-white rounded-2xl p-6 mt-6 shadow-md">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Developer Info
          </Text>
          <Text className="text-gray-600 mb-4">
            This app was created for educational purposes to demonstrate mobile app 
            development with React Native, Firebase, and CRUD operations.
          </Text>
          
          <TouchableOpacity
            className="bg-orange-500 py-3 rounded-2xl mt-4"
            onPress={() => Linking.openURL('https://github.com')}
          >
            <Text className="text-white font-semibold text-center">
              View Source Code
            </Text>
          </TouchableOpacity>
        </View>

        {/* Version */}
        <View className="items-center mt-8 mb-12">
          <Text className="text-gray-500">Version 1.0.0</Text>
          <Text className="text-gray-500 mt-1">© 2024 Recipe Finder App</Text>
        </View>
      </View>
    </ScrollView>
  )
}

export default About