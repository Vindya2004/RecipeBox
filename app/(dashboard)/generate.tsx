import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"
import { useLoader } from "@/hooks/useLoader"
import { useAuth } from "@/hooks/useAuth"
import { generateRecipesFromIngredients } from "@/services/recipeService"

const GenerateRecipes = () => {
  const router = useRouter()
  const { showLoader, hideLoader, isLoading } = useLoader()
  const { user } = useAuth()
  
  const [ingredients, setIngredients] = useState<string[]>(["", "", ""])
  const [availableTime, setAvailableTime] = useState("30")
  const [generatedRecipes, setGeneratedRecipes] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)

  const handleIngredientChange = (text: string, index: number) => {
    const newIngredients = [...ingredients]
    newIngredients[index] = text
    setIngredients(newIngredients)
  }

  const addIngredientField = () => {
    if (ingredients.length < 10) {
      setIngredients([...ingredients, ""])
    }
  }

  const removeIngredientField = (index: number) => {
    if (ingredients.length > 1) {
      const newIngredients = ingredients.filter((_, i) => i !== index)
      setIngredients(newIngredients)
    }
  }

  const handleGenerate = async () => {
    const filteredIngredients = ingredients.filter(ing => ing.trim() !== "")
    
    if (filteredIngredients.length === 0) {
      Alert.alert("Error", "Please add at least one ingredient")
      return
    }

    if (!availableTime || parseInt(availableTime) <= 0) {
      Alert.alert("Error", "Please enter a valid time")
      return
    }

    setIsGenerating(true)
    showLoader()
    
    try {
      const recipes = await generateRecipesFromIngredients(
        filteredIngredients,
        parseInt(availableTime)
      )
      setGeneratedRecipes(recipes)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to generate recipes")
    } finally {
      hideLoader()
      setIsGenerating(false)
    }
  }

  const handleSaveRecipe = async (recipe: any) => {
    showLoader()
    try {
      // Remove metadata before saving
      const { matchScore, matchedIngredients, matchPercentage, additionalIngredients, ...recipeToSave } = recipe;
      
     // await saveGeneratedRecipe(recipeToSave)
      Alert.alert("Success", "Recipe saved to your collection!")
      
      // Update the list to show it's saved
      setGeneratedRecipes(prev => 
        prev.map(r => r.id === recipe.id ? { ...r, isSaved: true } : r)
      )
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to save recipe")
    } finally {
      hideLoader()
    }
  }

  const handleViewRecipe = (recipeId: string) => {
    router.push(`/recipes/${recipeId}`)
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-orange-400 to-orange-500 px-6 pt-12 pb-8">
        <Text className="text-white text-3xl font-bold">Recipe Generator</Text>
        <Text className="text-orange-100 mt-2">
          Find recipes using ingredients you have
        </Text>
      </View>

      {/* Input Section */}
      <View className="mx-6 -mt-6 bg-white rounded-3xl shadow-xl p-6 mb-6">
        <Text className="text-xl font-bold text-gray-800 mb-4">What ingredients do you have?</Text>
        
        <FlatList
          data={ingredients}
          scrollEnabled={false}
          renderItem={({ item, index }) => (
            <View className="flex-row items-center mb-4">
              <View className="bg-orange-100 p-2 rounded-full">
                <MaterialIcons name="restaurant" size={18} color="#f97316" />
              </View>
              <TextInput
                placeholder={`Ingredient ${index + 1} (e.g., Chicken, Rice, Tomatoes)`}
                placeholderTextColor="#9ca3af"
                value={item}
                onChangeText={(text) => handleIngredientChange(text, index)}
                className="flex-1 ml-3 p-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-800"
              />
              {ingredients.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeIngredientField(index)}
                  className="ml-2 p-2 bg-red-50 rounded-full"
                >
                  <MaterialIcons name="close" size={18} color="#ef4444" />
                </TouchableOpacity>
              )}
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
        />

        <TouchableOpacity
          onPress={addIngredientField}
          disabled={ingredients.length >= 10}
          className="flex-row items-center justify-center p-3 bg-orange-50 rounded-xl mb-6"
        >
          <MaterialIcons name="add" size={22} color="#f97316" />
          <Text className="text-orange-600 font-medium ml-2">Add More Ingredients</Text>
          <Text className="text-orange-400 ml-2">
            ({ingredients.length}/10)
          </Text>
        </TouchableOpacity>

        {/* Time Selection */}
        <Text className="text-xl font-bold text-gray-800 mb-4">Available Cooking Time</Text>
        <View className="flex-row items-center mb-6">
          <View className="flex-1">
            <TextInput
              placeholder="Enter time in minutes"
              placeholderTextColor="#9ca3af"
              value={availableTime}
              onChangeText={setAvailableTime}
              keyboardType="numeric"
              className="p-4 bg-gray-50 rounded-xl border border-gray-200 text-gray-800 text-center text-lg"
            />
            <Text className="text-gray-500 text-sm mt-2 text-center">
              Maximum preparation time you have
            </Text>
          </View>
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          onPress={handleGenerate}
          disabled={isGenerating}
          className="bg-orange-500/80 to-red-500 p-4 rounded-2xl shadow-lg"
        >
          {isGenerating ? (
            <View className="flex-row items-center justify-center">
              <ActivityIndicator color="#fff" />
              <Text className="text-white font-bold text-lg ml-3">
                Searching recipes...
              </Text>
            </View>
          ) : (
            <View className="flex-row items-center justify-center">
              <MaterialIcons name="search" size={24} color="#fff" />
              <Text className="text-white font-bold text-lg ml-3">
                Find Matching Recipes
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Results Section */}
      {generatedRecipes.length > 0 && (
        <View className="mx-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-gray-800">
              Suggested Recipes
            </Text>
            <View className="bg-orange-100 px-3 py-1 rounded-full">
              <Text className="text-orange-700 font-medium">
                {generatedRecipes.length} found
              </Text>
            </View>
          </View>
          
          <FlatList
            data={generatedRecipes}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <View className="bg-white rounded-2xl shadow-lg p-5 mb-4 border border-gray-100">
                {/* Match Score Badge */}
                {item.matchPercentage > 0 && (
                  <View className="absolute top-4 right-4 bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 font-bold">
                      {item.matchPercentage}% Match
                    </Text>
                  </View>
                )}
                
                <TouchableOpacity onPress={() => handleViewRecipe(item.id)}>
                  <View className="pr-20">
                    <Text className="text-xl font-bold text-gray-800">{item.title}</Text>
                    <View className="flex-row items-center mt-2">
                      <View className="bg-orange-100 px-3 py-1 rounded-full">
                        <Text className="text-orange-700 font-medium">{item.category}</Text>
                      </View>
                      <View className="bg-blue-100 px-3 py-1 rounded-full ml-2">
                        <Text className="text-blue-700 font-medium">{item.prepTime} mins</Text>
                      </View>
                      <View className="bg-purple-100 px-3 py-1 rounded-full ml-2">
                        <Text className="text-purple-700 font-medium">{item.difficulty}</Text>
                      </View>
                    </View>
                  </View>

                  <Text className="text-gray-600 mt-4 mb-4">{item.description}</Text>

                  {/* Matched Ingredients */}
                  {item.matchedIngredients && item.matchedIngredients.length > 0 && (
                    <View className="mb-4">
                      <Text className="font-semibold text-gray-800 mb-2">
                        Matches your ingredients:
                      </Text>
                      <View className="flex-row flex-wrap">
                        {item.matchedIngredients.map((ing: string, idx: number) => (
                          <View key={idx} className="bg-green-100 px-3 py-1 rounded-full mr-2 mb-2">
                            <Text className="text-green-700">
                              <MaterialIcons name="check" size={14} /> {ing}
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Additional Ingredients Needed */}
                  {item.additionalIngredients > 0 && (
                    <View className="mb-4">
                      <Text className="text-amber-600 font-medium">
                        <MaterialIcons name="info" size={16} />
                        {` Need ${item.additionalIngredients} more ingredient(s)`}
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>

                {/* Action Buttons */}
                <View className="flex-row justify-between mt-4">
                  <TouchableOpacity
                    onPress={() => handleViewRecipe(item.id)}
                    className="flex-1 mr-2 flex-row items-center justify-center bg-blue-500 p-3 rounded-xl"
                  >
                    <MaterialIcons name="visibility" size={18} color="#fff" />
                    <Text className="text-white font-semibold ml-2">View Recipe</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    onPress={() => handleSaveRecipe(item)}
                    disabled={item.isSaved}
                    className={`flex-1 ml-2 flex-row items-center justify-center p-3 rounded-xl ${
                      item.isSaved ? 'bg-gray-300' : 'bg-green-500'
                    }`}
                  >
                    <MaterialIcons 
                      name={item.isSaved ? "check" : "save"} 
                      size={18} 
                      color="#fff" 
                    />
                    <Text className="text-white font-semibold ml-2">
                      {item.isSaved ? "Saved" : "Save"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            keyExtractor={(item, index) => item.id || index.toString()}
          />
        </View>
      )}

      {/* Empty State */}
      {generatedRecipes.length === 0 && !isGenerating && (
        <View className="mx-6 items-center justify-center py-12">
          <MaterialIcons name="search" size={64} color="#d1d5db" />
          <Text className="text-gray-600 text-lg font-medium mt-4">
            No recipes generated yet
          </Text>
          <Text className="text-gray-500 mt-2 text-center px-8">
            Enter the ingredients you have and available time to find matching recipes from our database
          </Text>
        </View>
      )}

      <View className="h-8" />
    </ScrollView>
  )
}

export default GenerateRecipes