// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Image,
// } from "react-native";
// import React, { useState } from "react";
// import { useLocalSearchParams, useRouter } from "expo-router";
// import { MaterialIcons } from "@expo/vector-icons";
// import { useLoader } from "@/hooks/useLoader";
// import { getRecipeById } from "@/services/recipeService";
// import { Recipe } from "@/types/recipe";
// import { useFocusEffect } from "@react-navigation/native";
// import { useCallback } from "react";
// import { getAuth } from "firebase/auth";  // ← Add this import to get current user

// const RecipeDetail = () => {
//   const router = useRouter();
//   const { id } = useLocalSearchParams<{ id: string }>();
//   const { showLoader, hideLoader } = useLoader();
//   const [recipe, setRecipe] = useState<Recipe | null>(null);

//   const currentUser = getAuth().currentUser;  // Get current authenticated user

//   useFocusEffect(
//     useCallback(() => {
//       if (!id) return;

//       const loadRecipe = async () => {
//         showLoader();
//         try {
//           const data = await getRecipeById(id);
//           setRecipe(data);
//         } catch (error: any) {
//           if (error.message === "Recipe not found") {
//             Alert.alert(
//               "Recipe Not Found",
//               "This recipe may have been deleted or is unavailable.",
//               [{ text: "OK", onPress: () => router.replace("/recipes") }]
//             );
//           } else {
//             Alert.alert("Error", error.message || "Failed to load recipe");
//             router.back();
//           }
//         } finally {
//           hideLoader();
//         }
//       };

//       loadRecipe();
//     }, [id, showLoader, hideLoader, router])
//   );

  

//   if (!recipe) {
//     return (
//       <View className="flex-1 justify-center items-center bg-gray-50">
//         <Text className="text-lg text-gray-600">Loading...</Text>
//       </View>
//     );
//   }

//   // Check if current user owns this recipe
//   const isOwner = currentUser && recipe.userId === currentUser.uid;

//   return (
//     <ScrollView className="flex-1 bg-gray-50">
//       {/* Back Button */}
//       <TouchableOpacity
//         className="flex-row items-center p-5"
//         onPress={() => router.back()}
//       >
//         <MaterialIcons name="arrow-back" size={26} color="#333" />
//         <Text className="text-gray-800 font-medium ml-2 text-base">Back</Text>
//       </TouchableOpacity>

//       {/* Recipe Content */}
//       <View className="bg-white mx-4 mb-8 rounded-2xl shadow-lg p-6">
//         {/* Image */}
//         {recipe.imageUrl ? (
//           <Image
//             source={{ uri: recipe.imageUrl }}
//             className="w-full h-64 rounded-xl mb-5"
//             resizeMode="cover"
//           />
//         ) : (
//           <View className="w-full h-64 bg-gray-100 rounded-xl mb-5 justify-center items-center">
//             <MaterialIcons name="no-photography" size={48} color="#d1d5db" />
//             <Text className="text-gray-500 mt-2">No image</Text>
//           </View>
//         )}

//         {/* Title and Edit Button (conditional) */}
//         <View className="flex-row justify-between items-start mb-6">
//           <View className="flex-1 pr-4">
//             <Text className="text-2xl font-bold text-gray-800">{recipe.title}</Text>
//             <View className="flex-row flex-wrap items-center mt-3 gap-2">
//               <View className="bg-orange-100 px-3 py-1 rounded-full">
//                 <Text className="text-orange-700 font-medium">{recipe.category}</Text>
//               </View>
//               <View className="bg-blue-100 px-3 py-1 rounded-full">
//                 <Text className="text-blue-700 font-medium">{recipe.prepTime} mins</Text>
//               </View>
//             </View>
//           </View>

//           {isOwner ? (
//             <TouchableOpacity
//               onPress={() => router.push({ pathname: "/recipes/form", params: { recipeId: id } })}
//               className="p-3 rounded-full bg-orange-500 shadow-sm"
//             >
//               <MaterialIcons name="edit" size={24} color="#ffffff" />
//             </TouchableOpacity>
//           ) : (
//             // Optional: show disabled / hidden button or nothing
//             <View className="w-12 h-12" /> // empty space to keep layout balanced
//             // OR show a message: <Text className="text-gray-500 text-sm">View only</Text>
//           )}
//         </View>

//         {/* Description */}
//         <View className="mb-6">
//           <Text className="text-lg font-semibold text-gray-800 mb-2">Description</Text>
//           <Text className="text-gray-600 leading-6">{recipe.description}</Text>
//         </View>

//         {/* Ingredients */}
//         <View className="mb-6">
//           <Text className="text-lg font-semibold text-gray-800 mb-3">Ingredients</Text>
//           {recipe.ingredients.map((ingredient, index) => (
//             <View key={index} className="flex-row items-center mb-2">
//               <MaterialIcons name="circle" size={10} color="#f97316" />
//               <Text className="text-gray-700 ml-3 flex-1">{ingredient}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Instructions */}
//         <View className="mb-6">
//           <Text className="text-lg font-semibold text-gray-800 mb-3">Instructions</Text>
//           {recipe.instructions.map((step, index) => (
//             <View key={index} className="mb-4">
//               <Text className="font-medium text-gray-800 mb-1">Step {index + 1}</Text>
//               <Text className="text-gray-600 ml-1 leading-6">{step}</Text>
//             </View>
//           ))}
//         </View>

//         {/* Additional Info */}
//         <View className="bg-gray-50 p-5 rounded-xl">
//           <View className="flex-row justify-between py-2 border-b border-gray-200">
//             <Text className="text-gray-600">Servings</Text>
//             <Text className="font-medium text-gray-800">{recipe.servings} people</Text>
//           </View>
//           <View className="flex-row justify-between py-2 border-b border-gray-200">
//             <Text className="text-gray-600">Difficulty</Text>
//             <Text className="font-medium text-gray-800">{recipe.difficulty}</Text>
//           </View>
//           <View className="flex-row justify-between py-2">
//             <Text className="text-gray-600">Added</Text>
//             <Text className="font-medium text-gray-800">
//               {new Date(recipe.createdAt).toLocaleDateString("en-US", {
//                 month: "short",
//                 day: "numeric",
//                 year: "numeric",
//               })}
//             </Text>
//           </View>
//         </View>
//       </View>

//       <View className="h-12" />
//     </ScrollView>
//   );
// };

// export default RecipeDetail;

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons"; // ← Ionicons එකතු කළා
import { useLoader } from "@/hooks/useLoader";
import { getRecipeById, addToFavorites, removeFromFavorites, isFavorite } from "@/services/recipeService";
import { Recipe } from "@/types/recipe";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { getAuth } from "firebase/auth";

const RecipeDetail = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { showLoader, hideLoader } = useLoader();
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  // Favorite states
  const [isFavorited, setIsFavorited] = useState(false);
  const [checkingFav, setCheckingFav] = useState(true);

  const currentUser = getAuth().currentUser;

  useFocusEffect(
    useCallback(() => {
      if (!id) return;

      const loadData = async () => {
        showLoader();

        try {
          // Load recipe
          const data = await getRecipeById(id);
          setRecipe(data);

          // Check if favorited (only if user is logged in)
          if (currentUser) {
            const favorited = await isFavorite(id);
            setIsFavorited(favorited);
          }
        } catch (error: any) {
          if (error.message === "Recipe not found") {
            Alert.alert(
              "Recipe Not Found",
              "This recipe may have been deleted or is unavailable.",
              [{ text: "OK", onPress: () => router.replace("/recipes") }]
            );
          } else {
            Alert.alert("Error", error.message || "Failed to load recipe");
            router.back();
          }
        } finally {
          hideLoader();
          setCheckingFav(false);
        }
      };

      loadData();
    }, [id, currentUser, showLoader, hideLoader, router])
  );

  const toggleFavorite = async () => {
    if (!recipe?.id || !currentUser) {
      Alert.alert("Login Required", "Please login to favorite recipes");
      return;
    }

    try {
      if (isFavorited) {
        await removeFromFavorites(recipe.id);
        setIsFavorited(false);
        Alert.alert("Removed", `${recipe.title} removed from favorites`);
      } else {
        await addToFavorites(recipe.id);
        setIsFavorited(true);
        Alert.alert("Added", `${recipe.title} added to favorites`);
      }
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to update favorites");
    }
  };

  if (!recipe) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg text-gray-600">Loading...</Text>
      </View>
    );
  }

  const isOwner = currentUser && recipe.userId === currentUser.uid;

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Back Button */}
      <TouchableOpacity
        className="flex-row items-center p-5"
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={26} color="#333" />
        <Text className="text-gray-800 font-medium ml-2 text-base">Back</Text>
      </TouchableOpacity>

      {/* Recipe Content */}
      <View className="bg-white mx-4 mb-8 rounded-2xl shadow-lg p-6 relative">
        {/* Heart Icon - top right */}
        {currentUser && (
          <TouchableOpacity
            className="absolute top-4 right-4 z-10 bg-white/90 p-3 rounded-full shadow-md active:scale-95"
            onPress={toggleFavorite}
            disabled={checkingFav}
          >
            <Ionicons
              name={isFavorited ? "heart" : "heart-outline"}
              size={28}
              color={isFavorited ? "#ef4444" : "#6b7280"}
            />
          </TouchableOpacity>
        )}

        {/* Image */}
        {recipe.imageUrl ? (
          <Image
            source={{ uri: recipe.imageUrl }}
            className="w-full h-64 rounded-xl mb-5"
            resizeMode="cover"
          />
        ) : (
          <View className="w-full h-64 bg-gray-100 rounded-xl mb-5 justify-center items-center">
            <MaterialIcons name="no-photography" size={48} color="#d1d5db" />
            <Text className="text-gray-500 mt-2">No image</Text>
          </View>
        )}

        {/* Title and Edit Button (conditional) */}
        <View className="flex-row justify-between items-start mb-6">
          <View className="flex-1 pr-4">
            <Text className="text-2xl font-bold text-gray-800">{recipe.title}</Text>
            <View className="flex-row flex-wrap items-center mt-3 gap-2">
              <View className="bg-orange-100 px-3 py-1 rounded-full">
                <Text className="text-orange-700 font-medium">{recipe.category}</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-700 font-medium">{recipe.prepTime} mins</Text>
              </View>
            </View>
          </View>

          {isOwner ? (
            <TouchableOpacity
              onPress={() => router.push({ pathname: "/recipes/form", params: { recipeId: id } })}
              className="p-3 rounded-full bg-orange-500 shadow-sm"
            >
              <MaterialIcons name="edit" size={24} color="#ffffff" />
            </TouchableOpacity>
          ) : (
            <View className="w-12 h-12" /> // Keeps layout balanced
          )}
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-2">Description</Text>
          <Text className="text-gray-600 leading-6">{recipe.description}</Text>
        </View>

        {/* Ingredients */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Ingredients</Text>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={index} className="flex-row items-center mb-2">
              <MaterialIcons name="circle" size={10} color="#f97316" />
              <Text className="text-gray-700 ml-3 flex-1">{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* Instructions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Instructions</Text>
          {recipe.instructions.map((step, index) => (
            <View key={index} className="mb-4">
              <Text className="font-medium text-gray-800 mb-1">Step {index + 1}</Text>
              <Text className="text-gray-600 ml-1 leading-6">{step}</Text>
            </View>
          ))}
        </View>

        {/* Additional Info */}
        <View className="bg-gray-50 p-5 rounded-xl">
          <View className="flex-row justify-between py-2 border-b border-gray-200">
            <Text className="text-gray-600">Servings</Text>
            <Text className="font-medium text-gray-800">{recipe.servings} people</Text>
          </View>
          <View className="flex-row justify-between py-2 border-b border-gray-200">
            <Text className="text-gray-600">Difficulty</Text>
            <Text className="font-medium text-gray-800">{recipe.difficulty}</Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className="text-gray-600">Added</Text>
            <Text className="font-medium text-gray-800">
              {new Date(recipe.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </Text>
          </View>
        </View>
      </View>

      <View className="h-12" />
    </ScrollView>
  );
};

export default RecipeDetail;