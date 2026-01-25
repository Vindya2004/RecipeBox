import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Pressable,
  Alert,
  FlatList
} from "react-native"
import React, { useEffect, useState } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { useLocalSearchParams, useRouter } from "expo-router"
import { addRecipe, getRecipeById, updateRecipe } from "@/services/recipeService"
import { Recipe } from "@/types/recipe"

const categories = ["Breakfast", "Lunch", "Dinner", "Dessert", "Snack", "Vegetarian", "Non-Vegetarian"]
const difficulties = ["Easy", "Medium", "Hard"]

const RecipeForm = () => {
  const router = useRouter()
  const { recipeId } = useLocalSearchParams()
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

  useEffect(() => {
    if (recipeId) {
      loadRecipe()
    }
  }, [recipeId])

  const loadRecipe = async () => {
    showLoader()
    try {
      const recipe = await getRecipeById(recipeId as string)
      setTitle(recipe.title)
      setDescription(recipe.description)
      setCategory(recipe.category)
      setPrepTime(recipe.prepTime.toString())
      setServings(recipe.servings.toString())
      setDifficulty(recipe.difficulty)
      setIngredients(recipe.ingredients)
      setInstructions(recipe.instructions)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load recipe")
    } finally {
      hideLoader()
    }
  }

  const addIngredient = () => {
    if (ingredient.trim() && !ingredients.includes(ingredient.trim())) {
      setIngredients([...ingredients, ingredient.trim()])
      setIngredient("")
    }
  }

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index))
  }

  const addInstruction = () => {
    if (instruction.trim() && !instructions.includes(instruction.trim())) {
      setInstructions([...instructions, instruction.trim()])
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
      Alert.alert("Error", "Please add at least one ingredient and instruction")
      return
    }

    showLoader()
    try {
      const recipeData = {
        title: title.trim(),
        description: description.trim(),
        category,
        prepTime: parseInt(prepTime),
        servings: parseInt(servings),
        difficulty,
        ingredients,
        instructions
      }

      if (recipeId) {
        await updateRecipe(recipeId as string, recipeData)
        Alert.alert("Success", "Recipe updated successfully")
      } else {
        await addRecipe(recipeData)
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
      <View className="bg-white rounded-2xl p-6 shadow-md">
        <Text className="text-2xl font-bold text-gray-800 mb-6">
          {recipeId ? "Edit Recipe" : "Add New Recipe"}
        </Text>

        {/* Basic Info */}
        <Text className="text-lg font-semibold text-gray-800 mb-4">Basic Information</Text>
        
        <TextInput
          placeholder="Recipe Title *"
          placeholderTextColor="#999"
          value={title}
          onChangeText={setTitle}
          className="mb-4 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300"
        />

        <TextInput
          placeholder="Description *"
          placeholderTextColor="#999"
          value={description}
          onChangeText={setDescription}
          multiline
          className="mb-4 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 h-24"
        />

        {/* Category Selection */}
        <Text className="text-lg font-semibold text-gray-800 mb-2">Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              onPress={() => setCategory(cat)}
              className={`px-4 py-2 mr-2 rounded-full ${
                category === cat ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              <Text className={category === cat ? "text-white" : "text-gray-700"}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Prep Time & Servings */}
        <View className="flex-row mb-4">
          <View className="flex-1 mr-2">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Prep Time (mins) *</Text>
            <TextInput
              placeholder="30"
              placeholderTextColor="#999"
              value={prepTime}
              onChangeText={setPrepTime}
              keyboardType="numeric"
              className="p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300"
            />
          </View>
          
          <View className="flex-1 ml-2">
            <Text className="text-lg font-semibold text-gray-800 mb-2">Servings *</Text>
            <TextInput
              placeholder="4"
              placeholderTextColor="#999"
              value={servings}
              onChangeText={setServings}
              keyboardType="numeric"
              className="p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300"
            />
          </View>
        </View>

        {/* Difficulty */}
        <Text className="text-lg font-semibold text-gray-800 mb-2">Difficulty</Text>
        <View className="flex-row mb-6">
          {difficulties.map((diff) => (
            <TouchableOpacity
              key={diff}
              onPress={() => setDifficulty(diff)}
              className={`flex-1 px-4 py-3 mr-2 rounded-xl ${
                difficulty === diff ? "bg-orange-500" : "bg-gray-200"
              }`}
            >
              <Text className={`text-center ${difficulty === diff ? "text-white" : "text-gray-700"}`}>
                {diff}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ingredients */}
        <Text className="text-lg font-semibold text-gray-800 mb-4">Ingredients</Text>
        <View className="flex-row mb-4">
          <TextInput
            placeholder="Add ingredient"
            placeholderTextColor="#999"
            value={ingredient}
            onChangeText={setIngredient}
            className="flex-1 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 mr-2"
          />
          <TouchableOpacity
            onPress={addIngredient}
            className="bg-green-500 p-4 rounded-xl"
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {ingredients.length > 0 && (
          <FlatList
            data={ingredients}
            renderItem={({ item, index }) => (
              <View className="flex-row items-center justify-between bg-gray-100 p-3 rounded-xl mb-2">
                <Text className="text-gray-700 flex-1">• {item}</Text>
                <TouchableOpacity onPress={() => removeIngredient(index)}>
                  <MaterialIcons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
          />
        )}

        {/* Instructions */}
        <Text className="text-lg font-semibold text-gray-800 mt-6 mb-4">Instructions</Text>
        <View className="flex-row mb-4">
          <TextInput
            placeholder="Add instruction step"
            placeholderTextColor="#999"
            value={instruction}
            onChangeText={setInstruction}
            multiline
            className="flex-1 p-4 rounded-xl bg-gray-100 text-gray-800 border border-gray-300 mr-2"
          />
          <TouchableOpacity
            onPress={addInstruction}
            className="bg-green-500 p-4 rounded-xl"
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        {instructions.length > 0 && (
          <FlatList
            data={instructions}
            renderItem={({ item, index }) => (
              <View className="flex-row items-start justify-between bg-gray-100 p-3 rounded-xl mb-2">
                <View className="flex-1">
                  <Text className="font-medium text-gray-800">Step {index + 1}</Text>
                  <Text className="text-gray-700 mt-1">{item}</Text>
                </View>
                <TouchableOpacity onPress={() => removeInstruction(index)} className="ml-2">
                  <MaterialIcons name="close" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            )}
            scrollEnabled={false}
          />
        )}

        {/* Submit Button */}
        <Pressable
          className={`mt-8 px-6 py-4 rounded-2xl position-absolute bottom-10 ${recipeId ? "bg-orange-500" : "bg-green-500"}`}
          onPress={handleSubmit}
        >
          <Text className="text-white text-lg font-semibold text-center">
            {isLoading ? "Please wait..." : recipeId ? "Update Recipe" : "Add Recipe"}
          </Text>
        </Pressable>
      </View>

      <View className="h-8" />
    </ScrollView>
  )
}

export default RecipeForm