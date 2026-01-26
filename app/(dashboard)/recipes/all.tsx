// app/recipes/all.tsx  (or rename to app/explore.tsx)
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { getAllRecipes, getRecentRecipes } from "@/services/recipeService"; // ← use getAllRecipes
import { Recipe } from "@/types/recipe";

const AllRecipes = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchAll = async () => {
        setLoading(true);
        try {
          const data = await  getAllRecipes(); // all recipes, sorted by createdAt desc
          setRecipes(data);
        } catch (err) {
          console.error("Failed to load all recipes:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchAll();
    }, [])
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-14 pb-5 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">
          All Recipes
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : recipes.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <MaterialIcons name="restaurant-menu" size={80} color="#d1d5db" />
          <Text className="text-gray-500 mt-5 text-lg">No recipes found</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          {recipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              className="bg-white rounded-2xl mb-5 shadow-md overflow-hidden border border-gray-100"
              onPress={() => router.push(`/recipes/${recipe.id}`)}
            >
              {recipe.imageUrl && (
                <Image
                  source={{ uri: recipe.imageUrl }}
                  className="w-full h-44"
                  resizeMode="cover"
                />
              )}

              <View className="p-5">
                <Text className="text-xl font-bold text-gray-800 mb-2" numberOfLines={2}>
                  {recipe.title}
                </Text>

                <Text className="text-gray-600 mb-3" numberOfLines={2}>
                  {recipe.description}
                </Text>

                <View className="flex-row flex-wrap gap-2 mb-4">
                  <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-orange-700 text-sm font-medium">{recipe.category}</Text>
                  </View>
                  <View className="bg-blue-100 px-3 py-1 rounded-full">
                    <Text className="text-blue-700 text-sm font-medium">{recipe.difficulty}</Text>
                  </View>
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 text-sm font-medium">{recipe.prepTime} min</Text>
                  </View>
                </View>

                <Text className="text-gray-500 text-sm">
                  Added {new Date(recipe.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default AllRecipes;