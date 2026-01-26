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