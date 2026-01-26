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
import { Ionicons } from "@expo/vector-icons";
import { getFavoriteRecipeIds, getRecipeById } from "@/services/recipeService";
import { Recipe } from "@/types/recipe";

const Favorites = () => {
  const router = useRouter();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchFavorites = async () => {
        setLoading(true);
        try {
          const favIds = await getFavoriteRecipeIds();

          if (favIds.length === 0) {
            setFavorites([]);
            return;
          }

          // Fetch recipe details — safely handle failures
          const recipePromises = favIds.map(async (id): Promise<Recipe | null> => {
            try {
              return await getRecipeById(id);
            } catch (err) {
              console.warn(`Failed to load recipe ${id}:`, err);
              return null;
            }
          });

          const recipesArray = await Promise.all(recipePromises);

          // Filter out nulls with proper type guard
          const validRecipes = recipesArray.filter(
            (recipe): recipe is Recipe => recipe !== null
          );

          setFavorites(validRecipes);
        } catch (err) {
          console.error("Failed to load favorites:", err);
          setFavorites([]);
        } finally {
          setLoading(false);
        }
      };

      fetchFavorites();
    }, [])
  );

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-6 pt-14 pb-5 shadow-sm">
        <Text className="text-2xl font-bold text-gray-800">
          My Favorites ({favorites.length})
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
          <Text className="mt-4 text-gray-600">Loading your favorites...</Text>
        </View>
      ) : favorites.length === 0 ? (
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="heart-outline" size={80} color="#d1d5db" />
          <Text className="text-gray-600 mt-6 text-xl font-medium text-center">
            No favorites yet
          </Text>
          <Text className="text-gray-500 mt-3 text-center">
            Tap the heart icon on any recipe to save it here!
          </Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
          {favorites.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              className="bg-white rounded-2xl mb-5 shadow-md overflow-hidden border border-gray-100"
              onPress={() => router.push(`/recipes/${recipe.id}`)}
            >
              {recipe.imageUrl ? (
                <Image
                  source={{ uri: recipe.imageUrl }}
                  className="w-full h-44"
                  resizeMode="cover"
                />
              ) : (
                <View className="w-full h-44 bg-gray-100 items-center justify-center">
                  <Ionicons name="restaurant-outline" size={40} color="#d1d5db" />
                </View>
              )}

              <View className="p-5">
                <View className="flex-row justify-between items-start">
                  <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={2}>
                    {recipe.title}
                  </Text>
                  <Ionicons name="heart" size={24} color="#ef4444" />
                </View>

                <Text className="text-gray-600 mt-2 mb-3" numberOfLines={2}>
                  {recipe.description}
                </Text>

                <View className="flex-row flex-wrap gap-2">
                  <View className="bg-orange-100 px-3 py-1 rounded-full">
                    <Text className="text-orange-700 text-sm font-medium">
                      {recipe.category}
                    </Text>
                  </View>
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 text-sm font-medium">
                      {recipe.prepTime} min
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default Favorites;