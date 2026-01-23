import { View, Text, ScrollView, Linking, TouchableOpacity } from "react-native"
import React from "react"
import { MaterialIcons } from "@expo/vector-icons"

const About = () => {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-orange-500 p-8 rounded-b-3xl">
        <Text className="text-white text-3xl font-bold text-center">About</Text>
      </View>

      {/* Content */}
      <View className="mx-6 -mt-8 bg-white rounded-2xl shadow-lg p-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Recipe Finder App</Text>
        
        <View className="mb-6">
          <Text className="text-gray-600 mb-3">
            This Recipe Finder mobile application is built using React Native with Expo Go for 
            simplified development and testing. The backend is implemented using Firebase, with 
            Firestore as a cloud-based NoSQL database for storing and managing recipe data.
          </Text>
          
          <Text className="text-gray-600 mb-3">
            Firebase Authentication handles user registration and login, ensuring secure access 
            to the application. The main objective is to demonstrate CRUD operations (Create, 
            Read, Update, and Delete) within a mobile environment while integrating authentication 
            and cloud database services.
          </Text>
          
          <Text className="text-gray-600">
            Each registered user can securely sign in and manage recipe data through a 
            user-friendly interface. The application focuses on core functionality and clean 
            architecture rather than complex features like recommendation systems.
          </Text>
        </View>

        {/* Features */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-3">Features</Text>
          {[
            "User Authentication with Firebase",
            "Create, Read, Update, Delete (CRUD) Recipes",
            "Search Recipes by Title, Ingredients, or Category",
            "Categorize Recipes (Breakfast, Lunch, Dinner, etc.)",
            "View Detailed Recipe Instructions",
            "User Profile Management",
            "Clean and Modern UI/UX"
          ].map((feature, index) => (
            <View key={index} className="flex-row items-start mb-2">
              <MaterialIcons name="check-circle" size={20} color="#10b981" />
              <Text className="text-gray-600 ml-3">{feature}</Text>
            </View>
          ))}
        </View>

        {/* Tech Stack */}
        <View className="mb-6">
          <Text className="text-xl font-semibold text-gray-800 mb-3">Technology Stack</Text>
          <View className="flex-row flex-wrap">
            {[
              "React Native",
              "Expo",
              "Firebase",
              "Firestore",
              "TypeScript",
              "Tailwind CSS",
              "React Navigation"
            ].map((tech, index) => (
              <View key={index} className="bg-orange-100 px-3 py-2 rounded-full mr-2 mb-2">
                <Text className="text-orange-700">{tech}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Contact/Info */}
        <View className="bg-gray-50 p-4 rounded-xl">
          <Text className="text-lg font-semibold text-gray-800 mb-2">For Academic Purposes</Text>
          <Text className="text-gray-600">
            This project focuses on frontend-mobile development, authentication, and CRUD 
            functionality rather than complex business logic, while still reflecting real-world 
            recipe finder app behavior.
          </Text>
          
          <TouchableOpacity 
            className="flex-row items-center mt-4"
            onPress={() => Linking.openURL('https://github.com')}
          >
            <MaterialIcons name="code" size={20} color="#6b7280" />
            <Text className="text-orange-600 ml-2">View Source Code</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View className="h-8" />
    </ScrollView>
  )
}

export default About