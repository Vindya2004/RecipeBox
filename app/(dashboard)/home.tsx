
// import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useRouter } from "expo-router";
// import { MaterialIcons } from "@expo/vector-icons";
// import { useAuth } from "@/hooks/useAuth";
// import { getRecipeCounts, getRecentRecipes } from "@/services/recipeService";
// import { Recipe } from "@/types/recipe";
// import { useFocusEffect } from "@react-navigation/native";

// const Home = () => {
//   const router = useRouter();
//   const { user } = useAuth();

//   const [recipeCounts, setRecipeCounts] = useState({ total: 0, userRecipes: 0 });
//   const [recentRecipes, setRecentRecipes] = useState<Recipe[]>([]);
//   const [loading, setLoading] = useState(true);

//   // useEffect(() => {
//   //   let mounted = true;

//   //   const loadData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       const [counts, recipes] = await Promise.all([
//   //         getRecipeCounts(),
//   //         getRecentRecipes(3),
//   //       ]);

//   //       if (!mounted) return;

//   //       setRecipeCounts(counts);
//   //       setRecentRecipes(recipes);
//   //     } catch (error) {
//   //       console.error("Home data load error:", error);
//   //     } finally {
//   //       if (mounted) setLoading(false);
//   //     }
//   //   };

//   //   loadData();

//   //   return () => {
//   //     mounted = false;
//   //   };
//   // }, []);
// useFocusEffect(
//     React.useCallback(() => {
//       let mounted = true;

//       const loadData = async () => {
//         try {
//           setLoading(true);
//           const [counts, recipes] = await Promise.all([
//             getRecipeCounts(),
//             getRecentRecipes(3),
//           ]);

//           if (!mounted) return;

//           setRecipeCounts(counts);
//           setRecentRecipes(recipes);
//         } catch (error) {
//           console.error("Home data load error:", error);
//         } finally {
//           if (mounted) setLoading(false);
//         }
//       };

//       loadData();

//       return () => {
//         mounted = false;
//       };
//     }, [])   // dependencies ඕන නැහැ මෙතනදි
//   );
//   if (loading) {
//     return (
//       <View className="flex-1 bg-gray-50 justify-center items-center">
//         <ActivityIndicator size="large" color="#f97316" />
//         <Text className="mt-4 text-gray-600">Loading recipes...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       {/* Header */}
//       <View className="bg-orange-500 p-6 rounded-b-3xl">
//         <Text className="text-white text-3xl font-bold">Recipe Finder</Text>
//         <Text className="text-orange-100 text-lg mt-2">
//           Welcome back, {user?.displayName || "Chef"}!
//         </Text>
//       </View>

//       {/* Stats Cards */}
//       <View className="flex-row justify-around mx-6 -mt-8 top-9">
//         <View className="bg-white p-4 rounded-2xl shadow-lg w-2/5 items-center">
//           <Text className="text-2xl font-bold text-gray-800">{recipeCounts.total}</Text>
//           <Text className="text-gray-600 mt-1" >Total Recipes</Text>
//         </View>

//         <View className="bg-white p-4 rounded-2xl shadow-lg w-2/5 items-center">
//           <Text className="text-2xl font-bold text-gray-800">{recipeCounts.userRecipes}</Text>
//           <Text className="text-gray-600 mt-1">Your Recipes</Text>
//         </View>
//       </View>

//       {/* Quick Actions */}
//       <View className="mt-8 px-6">
//         <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
//         <View className="flex-row justify-between">
//           <TouchableOpacity
//             className="bg-white p-4 rounded-2xl shadow-md w-2/5 items-center"
//             onPress={() => router.push("/search")}
//           >
//             <MaterialIcons name="search" size={32} color="#f97316" />
//             <Text className="text-gray-800 font-medium mt-2">Search</Text>
//           </TouchableOpacity>

//           <TouchableOpacity
//             className="bg-white p-4 rounded-2xl shadow-md w-2/5 items-center"
//             onPress={() => router.push("/recipes/form")}
//           >
//             <MaterialIcons name="add-circle" size={32} color="#f97316" />
//             <Text className="text-gray-800 font-medium mt-2">Add Recipe</Text>
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Recent Recipes */}
//       <View className="mt-8 px-6 mb-8">
//         <View className="flex-row justify-between items-center mb-4">
//           <Text className="text-xl font-bold text-gray-800">Recent Recipes</Text>
//           <TouchableOpacity onPress={() => router.push("/recipes")}>
//             <Text className="text-orange-500 font-medium">View All</Text>
//           </TouchableOpacity>
//         </View>

//         {recentRecipes.length > 0 ? (
//           recentRecipes.map((recipe) => (
//             <TouchableOpacity
//               key={recipe.id}
//               className="bg-white p-4 rounded-2xl shadow-md mb-4"
//               onPress={() => router.push(`/recipes/${recipe.id}`)}
//             >
//               <Text className="text-lg font-semibold text-gray-800">{recipe.title}</Text>
//               <Text className="text-gray-600 mt-1">
//                 {recipe.category} • {recipe.prepTime} mins
//               </Text>
//               <Text className="text-gray-500 mt-2" numberOfLines={2}>
//                 {recipe.description}
//               </Text>
//             </TouchableOpacity>
//           ))
//         ) : (
//           <View className="bg-white p-8 rounded-2xl items-center">
//             <MaterialIcons name="restaurant" size={48} color="#d1d5db" />
//             <Text className="text-gray-500 mt-4 text-center">
//               No recipes yet. Add your first one!
//             </Text>
//           </View>
//         )}
//       </View>
//     </ScrollView>
//   );
// };

// export default Home;

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
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
            getRecentRecipes(3),
          ]);

          if (!mounted) return;

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
      {/* Modern Header with Gradient */}
      <View className="relative">
        <View className="bg-orange-500  pt-14 pb-20 px-6 ">
          <Text className="text-white text-4xl font-extrabold tracking-tight">
            Recipe Finder
          </Text>
          <Text className="text-orange-100/90 text-xl mt-2 font-medium">
            Welcome back, {user?.displayName?.split(" ")[0] || "Chef"}! 🍳
          </Text>
        </View>

        {/* Stats Cards - Glassmorphism style */}
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

      {/* Spacer for overlapping cards */}
      <View className="h-14" />

      {/* Quick Actions - Bigger & more stylish */}
      <View className="mt-6 px-6">
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

      {/* Recent Recipes Section */}
      <View className="mt-10 px-6 mb-10">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold text-gray-900">
            Recent Favorites
          </Text>
          <TouchableOpacity onPress={() => router.push("/recipes")}>
            <Text className="text-orange-600 font-semibold text-base">
              See All →
            </Text>
          </TouchableOpacity>
        </View>

        {recentRecipes.length > 0 ? (
          recentRecipes.map((recipe) => (
            <TouchableOpacity
              key={recipe.id}
              activeOpacity={0.9}
              className="bg-white rounded-3xl shadow-md mb-5 overflow-hidden border border-gray-100"
              onPress={() => router.push(`/recipes/${recipe.id}`)}
            >
              {/* Optional: Add recipe image here later */}
              {/* <Image source={{ uri: recipe.image }} className="w-full h-44" /> */}

              <View className="p-5">
                <Text className="text-xl font-bold text-gray-900 mb-1">
                  {recipe.title}
                </Text>

                <View className="flex-row items-center mt-2 mb-3">
                  <View className="bg-orange-50 px-3 py-1 rounded-full mr-3">
                    <Text className="text-orange-700 text-sm font-medium">
                      {recipe.category}
                    </Text>
                  </View>
                  <Text className="text-gray-600 text-sm">
                    ⏱ {recipe.prepTime} min
                  </Text>
                </View>

                <Text
                  className="text-gray-600 leading-6"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {recipe.description}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 items-center border border-gray-100">
            <Ionicons name="restaurant-outline" size={64} color="#d1d5db" />
            <Text className="text-gray-600 mt-5 text-center text-lg font-medium">
              Your kitchen is empty...
            </Text>
            <Text className="text-gray-500 mt-2 text-center">
              Add your first recipe now!
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default Home;