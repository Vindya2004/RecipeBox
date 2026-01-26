import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
  FlatList,
  Image
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { useLocalSearchParams, useRouter } from "expo-router"
import * as ImagePicker from "expo-image-picker"
import { addRecipe, getRecipeById, updateRecipe, uploadImage } from "@/services/recipeService"
import { Recipe } from "@/types/recipe"

const categories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Vegetarian", "Non-Vegetarian"]
const difficulties = ["Easy", "Medium", "Hard"]

const RecipeForm = () => {
  const router = useRouter()
  const { recipeId } = useLocalSearchParams<{ recipeId?: string }>()
  const { showLoader, hideLoader, isLoading } = useLoader()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [prepTime, setPrepTime] = useState("")
  const [servings, setServings] = useState("")
  const [difficulty, setDifficulty] = useState("Easy")
  const [ingredient, setIngredient] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [instruction, setInstruction] = useState("")
  const [instructions, setInstructions] = useState<string[]>([])

  // Image handling
  const [imageUri, setImageUri] = useState<string | undefined>(undefined) // local uri or remote url

  useEffect(() => {
    if (recipeId) {
      loadRecipe()
    }
  }, [recipeId])

  const loadRecipe = async () => {
    showLoader()
    try {
      const recipe = await getRecipeById(recipeId!)
      setTitle(recipe.title)
      setDescription(recipe.description)
      setCategory(recipe.category)
      setPrepTime(recipe.prepTime.toString())
      setServings(recipe.servings.toString())
      setDifficulty(recipe.difficulty)
      setIngredients(recipe.ingredients)
      setInstructions(recipe.instructions)
      setImageUri((recipe as any).imageUrl)// existing image
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load recipe")
    } finally {
      hideLoader()
    }
  }

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (status !== 'granted') {
      Alert.alert("Permission required", "Please allow access to your photos.")
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    })

    if (!result.canceled && result.assets?.[0]?.uri) {
      setImageUri(result.assets[0].uri)
    }
  }

  const addIngredient = () => {
    const trimmed = ingredient.trim()
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed])
      setIngredient("")
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const addInstruction = () => {
    const trimmed = instruction.trim()
    if (trimmed && !instructions.includes(trimmed)) {
      setInstructions([...instructions, trimmed])
      setInstruction("")
    }
  }

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    if (isLoading) return

    if (!title.trim() || !description.trim() || !category || !prepTime || !servings) {
      Alert.alert("Error", "Please fill all required fields")
      return
    }

    if (ingredients.length === 0 || instructions.length === 0) {
      Alert.alert("Error", "Please add at least one ingredient and one instruction")
      return
    }

    showLoader()

    try {
      let finalImageUrl = imageUri

      // Upload only if it's a new local image (not http/https url)
      if (imageUri && !imageUri.startsWith('http')) {
        finalImageUrl = await uploadImage(imageUri)
      }

      const recipeData: Partial<Recipe> = {
        title: title.trim(),
        description: description.trim(),
        category,
        prepTime: parseInt(prepTime),
        servings: parseInt(servings),
        difficulty,
        ingredients,
        instructions,
        ...(finalImageUrl && { imageUrl: finalImageUrl })
      }

      if (recipeId) {
        await updateRecipe(recipeId, recipeData)
        Alert.alert("Success", "Recipe updated successfully")
      } else {
        await addRecipe(recipeData as Omit<Recipe, 'id' | 'userId' | 'createdAt'>)
        Alert.alert("Success", "Recipe added successfully")
      }

      router.back()
    } catch (error: any) {
      Alert.alert("Error", error.message || "Something went wrong")
    } finally {
      hideLoader()
    }
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} className="bg-gray-50">
      {/* Header */}
      <TouchableOpacity
        className="flex-row items-center mb-6"
        onPress={() => router.back()}
      >
        <MaterialIcons name="arrow-back" size={24} color="#333" />
        <Text className="text-gray-800 font-medium ml-2">Back</Text>
      </TouchableOpacity>

      {/* Form */}
      <View className="bg-white rounded-2xl p-6 shadow-md mb-8">

        <Text className="text-2xl font-bold text-gray-800 mb-2">Hi!</Text>
        <Text className="text-2xl font-bold text-orange-700 mb-6">
          {recipeId ? "Edit Recipe" : "Add New Recipe"}
        </Text>

        {/* Image Picker */}
        <Text className="text-lg font-semibold text-gray-800 mb-3">Recipe Photo</Text>
        <TouchableOpacity
          onPress={pickImage}
          className="h-48 bg-gray-100 rounded-xl mb-6 justify-center items-center border border-dashed border-gray-300 overflow-hidden"
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
          ) : (
            <View className="items-center">
              <MaterialIcons name="add-a-photo" size={40} color="#9ca3af" />
              <Text className="text-gray-500 mt-2 text-center">Tap to add or change photo</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Title */}
        <TextInput
          placeholder="Recipe Title *"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          className="mb-4 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300"
        />

        {/* Description */}
        <TextInput
          placeholder="Description *"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          className="mb-5 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 h-28"
        />

        {/* Category */}
        <Text className="text-lg font-semibold text-gray-800 mb-2">Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              className={`px-5 py-2.5 mr-3 rounded-full border ${
                category === cat
                  ? "bg-orange-500 border-orange-500"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <Text
                className={category === cat ? "text-white font-medium" : "text-gray-700"}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Prep Time & Servings */}
        <View className="flex-row mb-5 gap-3">
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800 mb-2">Prep Time (mins) *</Text>
            <TextInput
              placeholder="30"
              placeholderTextColor="#999"
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
              className="p-4 rounded-xl bg-gray-100 border border-gray-300"
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-semibold text-gray-800 mb-2">Servings *</Text>
            <TextInput
              placeholder="4"
              placeholderTextColor="#999"
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
              className="p-4 rounded-xl bg-gray-100 border border-gray-300"
            />
          </View>
        </View>

        {/* Difficulty */}
        <Text className="text-lg font-semibold text-gray-800 mb-2">Difficulty</Text>
        <View className="flex-row mb-6 gap-3">
          {difficulties.map((diff) => (
            <TouchableOpacity
              key={diff}
              onPress={() => setDifficulty(diff)}
              className={`flex-1 py-3 rounded-xl border ${
                difficulty === diff
                  ? "bg-orange-500 border-orange-500"
                  : "bg-gray-100 border-gray-300"
              }`}
            >
              <Text
                className={`text-center font-medium ${
                  difficulty === diff ? "text-white" : "text-gray-700"
                }`}
              >
                {diff}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ingredients */}
        <Text className="text-lg font-semibold text-gray-800 mb-3">Ingredients</Text>
        <View className="flex-row mb-4">
          <TextInput
            placeholder="Add ingredient (e.g. 2 cups flour)"
            placeholderTextColor="#999"
            value={ingredient}
            onChangeText={setIngredient}
            className="flex-1 p-4 rounded-xl bg-gray-100 border border-gray-300 mr-3"
          />
          <TouchableOpacity
            onPress={addIngredient}
            className="bg-green-600 p-4 rounded-xl justify-center"
          >
            <MaterialIcons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {ingredients.length > 0 && (
          <FlatList
            data={ingredients}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View className="flex-row items-center justify-between bg-gray-50 p-3.5 rounded-xl mb-2.5">
                <Text className="text-gray-800 flex-1">• {item}</Text>
                <TouchableOpacity onPress={() => removeIngredient(index)}>
                  <MaterialIcons name="close" size={22} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* Instructions */}
        <Text className="text-lg font-semibold text-gray-800 mt-7 mb-3">Instructions</Text>
        <View className="flex-row mb-4">
          <TextInput
            placeholder="Add step (e.g. Mix all dry ingredients...)"
            placeholderTextColor="#999"
            value={instruction}
            onChangeText={setInstruction}
            multiline
            className="flex-1 p-4 rounded-xl bg-gray-100 border border-gray-300 mr-3 min-h-[100px]"
          />
          <TouchableOpacity
            onPress={addInstruction}
            className="bg-green-600 p-4 rounded-xl justify-center"
          >
            <MaterialIcons name="add" size={28} color="#fff" />
          </TouchableOpacity>
        </View>

        {instructions.length > 0 && (
          <FlatList
            data={instructions}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View className="bg-gray-50 p-4 rounded-xl mb-3">
                <View className="flex-row justify-between items-start">
                  <Text className="font-medium text-gray-800 mb-1.5">Step {index + 1}</Text>
                  <TouchableOpacity onPress={() => removeInstruction(index)}>
                    <MaterialIcons name="close" size={22} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <Text className="text-gray-700 leading-6">{item}</Text>
              </View>
            )}
          />
        )}

        {/* Submit */}
        <Pressable
          className={`mt-10 py-4 rounded-2xl ${recipeId ? "bg-orange-600" : "bg-green-600"}`}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {isLoading
              ? "Saving..."
              : recipeId
              ? "Update Recipe"
              : "Create Recipe"}
          </Text>
        </Pressable>
      </View>

      <View className="h-12" />
    </ScrollView>
  )
}

export default RecipeForm