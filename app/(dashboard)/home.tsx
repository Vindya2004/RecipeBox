import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/hooks/useAuth";
import { getRecipeCounts, getRecentRecipes } from "@/services/recipeService";
import { Recipe } from "@/types/recipe";
import { useFocusEffect } from "@react-navigation/native";

const Home = () => {
  const router = useRouter();
  const { user } = useAuth();

  const [recipeCounts, setRecipeCounts] = React.useState({
    total: 0,
    userRecipes: 0,
  });
  const [recentRecipes, setRecentRecipes] = React.useState<Recipe[]>([]);
  const [loading, setLoading] = React.useState(true);

  useFocusEffect(
    React.useCallback(() => {
      let mounted = true;

      const loadData = async () => {
        try {
          setLoading(true);
          const [counts, recipes] = await Promise.all([
            getRecipeCounts(),
            getRecentRecipes(6), // try 6 to increase chance of having images
          ]);

          if (!mounted) return;

          // Debug: Log which recipes have images
          console.log("Recent recipes loaded:", recipes.length);
          recipes.forEach((r, i) => {
            console.log(
              `${i + 1}. ${r.title} → imageUrl:`,
              r.imageUrl ? "YES" : "NO",
              r.imageUrl || "(missing)"
            );
          });

          setRecipeCounts(counts);
          setRecentRecipes(recipes);
        } catch (error) {
          console.error("Home data load error:", error);
        } finally {
          if (mounted) setLoading(false);
        }
      };

      loadData();

      return () => {
        mounted = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#f97316" />
        <Text className="mt-5 text-gray-600 font-medium text-lg">
          Preparing delicious recipes...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header + Stats Cards (unchanged) */}
      <View className="relative">
        <View className="bg-orange-500 pt-14 pb-20 px-6">
          <Text className="text-white text-4xl font-extrabold tracking-tight">
            RecipeBox
          </Text>
          <Text className="text-orange-100/90 text-xl mt-2 font-medium">
            Welcome back, {user?.displayName?.split(" ")[0] || "Chef"}! 🍳
          </Text>
        </View>

        <View className="absolute -bottom-10 left-0 right-0 px-6 flex-row justify-between">
          <View className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-xl w-[48%] items-center">
            <Text className="text-3xl font-bold text-gray-800">
              {recipeCounts.total}
            </Text>
            <Text className="text-gray-600 mt-1 text-base font-medium">
              Total Recipes
            </Text>
          </View>

          <View className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-xl w-[48%] items-center">
            <Text className="text-3xl font-bold text-gray-800">
              {recipeCounts.userRecipes}
            </Text>
            <Text className="text-gray-600 mt-1 text-base font-medium">
              Your Creations
            </Text>
          </View>
        </View>
      </View>

      <View className="h-14" />

      {/* Quick Actions (unchanged) */}
      <View className="mt-6 px-6 bottom-8">
        <Text className="text-2xl font-bold text-gray-800 mb-5">
          Let's Cook
        </Text>

        <View className="flex-row justify-between">
          <TouchableOpacity
            activeOpacity={0.88}
            className="bg-white rounded-3xl shadow-lg p-6 items-center w-[48%] border border-gray-100"
            onPress={() => router.push("/search")}
          >
            <View className="bg-orange-100 p-4 rounded-full mb-3">
              <MaterialIcons name="search" size={36} color="#f97316" />
            </View>
            <Text className="text-gray-800 font-semibold text-lg">Search</Text>
            <Text className="text-gray-500 text-sm mt-1">Find inspiration</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.88}
            className="bg-white rounded-3xl shadow-lg p-6 items-center w-[48%] border border-gray-100"
            onPress={() => router.push("/recipes/form")}
          >
            <View className="bg-orange-100 p-4 rounded-full mb-3">
              <Ionicons name="add" size={36} color="#f97316" />
            </View>
            <Text className="text-gray-800 font-semibold text-lg">New Recipe</Text>
            <Text className="text-gray-500 text-sm mt-1">Share your dish</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Recipes */}
      <View className="mt-10 px-6 mb-12 bottom-14">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="text-2xl font-bold text-gray-900">
            Recent Favorites
          </Text>
          <TouchableOpacity onPress={() => router.push("/recipes/all")}>
            <Text className="text-orange-600 font-semibold text-base">
              See All →
            </Text>
          </TouchableOpacity>
        </View>

        {recentRecipes.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            {recentRecipes.map((recipe) => (
              <TouchableOpacity
                key={recipe.id}
                activeOpacity={0.9}
                className="bg-white rounded-3xl shadow-md mr-5 overflow-hidden border border-gray-100"
                style={{ width: 280 }}
                onPress={() => router.push(`/recipes/${recipe.id}`)}
              >
                {/* Image handling - same as your /recipes page */}
                {recipe.imageUrl ? (
                  <Image
                    source={{ uri: recipe.imageUrl }}
                    className="w-full h-44"
                    resizeMode="cover"
                    onError={(e) =>
                      console.log(
                        `Image failed on Home: ${recipe.title} → ${recipe.imageUrl}`,
                        e.nativeEvent.error
                      )
                    }
                    onLoad={() =>
                      console.log(`Image loaded on Home: ${recipe.title}`)
                    }
                  />
                ) : (
                  <View className="w-full h-44 bg-gray-100 items-center justify-center">
                    <Ionicons name="restaurant-outline" size={48} color="#d1d5db" />
                    <Text className="text-gray-400 text-sm mt-2">No photo</Text>
                  </View>
                )}

                <View className="p-4">
                  <Text
                    className="text-lg font-bold text-gray-900 mb-1"
                    numberOfLines={2}
                  >
                    {recipe.title}
                  </Text>

                  <View className="flex-row items-center mt-1 mb-2">
                    <View className="bg-orange-50 px-3 py-1 rounded-full mr-3">
                      <Text className="text-orange-700 text-xs font-medium">
                        {recipe.category}
                      </Text>
                    </View>
                    <Text className="text-gray-600 text-xs">
                      ⏱ {recipe.prepTime} min
                    </Text>
                  </View>

                  <Text
                    className="text-gray-600 text-sm leading-5"
                    numberOfLines={2}
                  >
                    {recipe.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : (
          <View className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 items-center border border-gray-100">
            <Ionicons name="restaurant-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-600 mt-5 text-center text-lg font-medium">
              No recent recipes yet...
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              Add your first dish!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Home;