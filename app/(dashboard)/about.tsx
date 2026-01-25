// import { View, Text, ScrollView, Linking, TouchableOpacity } from "react-native"
// import React from "react"
// import { MaterialIcons } from "@expo/vector-icons"

// const About = () => {
//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-orange-500 p-8 rounded-b-3xl">
//         <Text className="text-white text-3xl font-bold text-center">About</Text>
//       </View>

//       {/* Content */}
//       <View className="mx-6 -mt-8 bg-white rounded-2xl shadow-lg p-6">
//         <Text className="text-2xl font-bold text-gray-800 mb-4">Recipe Finder App</Text>
        
//         <View className="mb-6">
//           <Text className="text-gray-600 mb-3">
//             This Recipe Finder mobile application is built using React Native with Expo Go for 
//             simplified development and testing. The backend is implemented using Firebase, with 
//             Firestore as a cloud-based NoSQL database for storing and managing recipe data.
//           </Text>
          
//           <Text className="text-gray-600 mb-3">
//             Firebase Authentication handles user registration and login, ensuring secure access 
//             to the application. The main objective is to demonstrate CRUD operations (Create, 
//             Read, Update, and Delete) within a mobile environment while integrating authentication 
//             and cloud database services.
//           </Text>
          
//           <Text className="text-gray-600">
//             Each registered user can securely sign in and manage recipe data through a 
//             user-friendly interface. The application focuses on core functionality and clean 
//             architecture rather than complex features like recommendation systems.
//           </Text>
//         </View>

//         {/* Features */}
//         <View className="mb-6">
//           <Text className="text-xl font-semibold text-gray-800 mb-3">Features</Text>
//           {[
//             "User Authentication with Firebase",
//             "Create, Read, Update, Delete (CRUD) Recipes",
//             "Search Recipes by Title, Ingredients, or Category",
//             "Categorize Recipes (Breakfast, Lunch, Dinner, etc.)",
//             "View Detailed Recipe Instructions",
//             "User Profile Management",
//             "Clean and Modern UI/UX"
//           ].map((feature, index) => (
//             <View key={index} className="flex-row items-start mb-2">
//               <MaterialIcons name="check-circle" size={20} color="#10b981" />
//               <Text className="text-gray-600 ml-3">{feature}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Tech Stack */}
//         <View className="mb-6">
//           <Text className="text-xl font-semibold text-gray-800 mb-3">Technology Stack</Text>
//           <View className="flex-row flex-wrap">
//             {[
//               "React Native",
//               "Expo",
//               "Firebase",
//               "Firestore",
//               "TypeScript",
//               "Tailwind CSS",
//               "React Navigation"
//             ].map((tech, index) => (
//               <View key={index} className="bg-orange-100 px-3 py-2 rounded-full mr-2 mb-2">
//                 <Text className="text-orange-700">{tech}</Text>
//               </View>
//             ))}
//           </View>
//         </View>

//         {/* Contact/Info */}
//         <View className="bg-gray-50 p-4 rounded-xl">
//           <Text className="text-lg font-semibold text-gray-800 mb-2">For Academic Purposes</Text>
//           <Text className="text-gray-600">
//             This project focuses on frontend-mobile development, authentication, and CRUD 
//             functionality rather than complex business logic, while still reflecting real-world 
//             recipe finder app behavior.
//           </Text>
          
//           <TouchableOpacity 
//             className="flex-row items-center mt-4"
//             onPress={() => Linking.openURL('https://github.com')}
//           >
//             <MaterialIcons name="code" size={20} color="#6b7280" />
//             <Text className="text-orange-600 ml-2">View Source Code</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       <View className="h-8" />
//     </ScrollView>
//   )
// }

// export default About

import { View, Text, ScrollView, TouchableOpacity, Linking } from "react-native";
import React from "react";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";

const About = () => {
  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero Header with subtle gradient */}
      <View className="bg-orange-500 pt-16 pb-24 px-6 rounded-b-3xl shadow-xl">
        <Text className="text-white text-4xl font-extrabold tracking-tight text-center">
          Recipe Finder
        </Text>
        <Text className="text-orange-100 text-xl font-medium mt-3 text-center opacity-90">
          Cook with love. Share with joy.
        </Text>
      </View>

      {/* Overlapping Card - Main Content */}
      <View className="px-6 -mt-16 mb-10">
        <View className="bg-white rounded-3xl shadow-2xl p-8 border border-orange-100/50">
          {/* Welcome / Purpose */}
          <Text className="text-2xl font-bold text-gray-800 mb-5 text-center">
            Your Everyday Kitchen Companion
          </Text>

          <Text className="text-gray-700 leading-7 mb-6 text-base">
            Recipe Finder is a mobile app designed to bring delicious, simple, and heartfelt cooking into your daily life.
          </Text>

          <Text className="text-gray-700 leading-7 mb-6 text-base">
            Make the most amazing dishes with ingredients you already have at home, share your own recipes with the world, and get inspired by what others create — that's our biggest goal.
          </Text>

          <Text className="text-gray-700 leading-7 italic text-center border-l-4 border-orange-400 pl-4 py-1 mb-8">
            "We believe food has the power to spread love, create memories, and bring joy."
          </Text>

          {/* What we offer - Features in nice cards */}
          <Text className="text-xl font-bold text-gray-800 mb-5">
            What You Can Do Here
          </Text>

          <View className="space-y-4 mb-10">
            {[
              {
                icon: "restaurant",
                title: "Discover & Save Recipes",
                desc: "Browse hundreds of tasty ideas from breakfast to dessert and save your favorites",
              },
              {
                icon: "add-circle",
                title: "Create & Share Your Own",
                desc: "Upload your signature dishes and share them with the community",
              },
              {
                icon: "search",
                title: "Easy Search & Filter",
                desc: "Quickly find recipes by title, ingredients, or category",
              },
              {
                icon: "favorite",
                title: "Build Your Collection",
                desc: "Bookmark the recipes you love so you can come back to them anytime",
              },
            ].map((item, index) => (
              <View
                key={index}
                className="flex-row items-start bg-orange-50/40 p-5 rounded-2xl border border-orange-100"
              >
                <View className="bg-orange-100 p-3 rounded-full mr-4 mt-1">
                  <MaterialIcons name={item.icon as any} size={28} color="#f97316" />
                </View>
                <View className="flex-1">
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {item.title}
                  </Text>
                  <Text className="text-gray-600 leading-6">
                    {item.desc}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {/* Academic / Project Note */}
          <View className="bg-gray-50 p-6 rounded-2xl mb-8">
            <Text className="text-lg font-semibold text-gray-800 mb-3">
              A Project Made with Passion
            </Text>
            <Text className="text-gray-700 leading-7">
              While this app started as an academic project, the love and effort put into it are real — 
              and we truly hope it can bring joy to everyday cooks and become part of the wider food-loving community.
            </Text>
          </View>

          {/* GitHub Link - Prominent */}
          <TouchableOpacity
            className="flex-row items-center justify-center bg-orange-500 py-5 px-8 rounded-2xl shadow-lg active:opacity-90"
            onPress={() => Linking.openURL('https://github.com')} // ← Replace with your real repo link
          >
            <Ionicons name="logo-github" size={26} color="white" />
            <Text className="text-white font-semibold text-lg ml-3">
              View Source Code on GitHub
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer subtle */}
      <View className="items-center pb-12 pt-4">
        <Text className="text-gray-500 text-sm">
          Made with 🍳 & ❤️ in Colombo
        </Text>
        <Text className="text-gray-400 text-xs mt-2">
          © {new Date().getFullYear()} Recipe Finder
        </Text>
      </View>
    </ScrollView>
  );
};

export default About;