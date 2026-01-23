import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  ActivityIndicator
} from "react-native"
import React, { useState, useCallback } from "react"
import { MaterialIcons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { searchRecipes } from "@/services/recipeService"
import { Recipe } from "@/types/recipe"
import debounce from "lodash/debounce"

const Search = () => {
  const router = useRouter()
  const { showLoader, hideLoader } = useLoader()
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Recipe[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([])
      return
    }

    setIsSearching(true)
    try {
      const results = await searchRecipes(query)
      setSearchResults(results)
    } catch (error: any) {
      Alert.alert("Error", error.message || "Search failed")
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      performSearch(query)
    }, 500),
    []
  )

  const handleSearchChange = (text: string) => {
    setSearchQuery(text)
    debouncedSearch(text)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const renderRecipeItem = ({ item }: { item: Recipe }) => (
    <TouchableOpacity
      className="bg-white p-4 rounded-2xl mb-3 border border-gray-300 shadow-sm"
      onPress={() => router.push(`/recipes/${item.id}`)}
    >
      <Text className="text-lg font-semibold text-gray-800 mb-1">{item.title}</Text>
      <View className="flex-row items-center">
        <MaterialIcons name="restaurant" size={16} color="#6b7280" />
        <Text className="text-gray-600 ml-2">{item.category}</Text>
        <MaterialIcons name="access-time" size={16} color="#6b7280" className="ml-4" />
        <Text className="text-gray-600 ml-2">{item.prepTime} mins</Text>
      </View>
      <Text className="text-gray-500 mt-2" numberOfLines={2}>
        {item.description}
      </Text>
    </TouchableOpacity>
  )

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Header */}
      <View className="bg-white p-4">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Search Recipes</Text>
        
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <MaterialIcons name="search" size={24} color="#6b7280" />
          <TextInput
            placeholder="Search by title, ingredient, or category..."
            placeholderTextColor="#6b7280"
            className="flex-1 ml-3 text-gray-800"
            value={searchQuery}
            onChangeText={handleSearchChange}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <MaterialIcons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Results */}
      <View className="flex-1 p-4">
        {isSearching ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#f97316" />
            <Text className="text-gray-600 mt-4">Searching...</Text>
          </View>
        ) : searchQuery.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="search" size={64} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-lg">Search for recipes</Text>
            <Text className="text-gray-400 mt-2 text-center">
              Try searching by title, ingredients, or category
            </Text>
          </View>
        ) : searchResults.length === 0 ? (
          <View className="flex-1 justify-center items-center">
            <MaterialIcons name="restaurant" size={64} color="#d1d5db" />
            <Text className="text-gray-500 mt-4 text-lg">No recipes found</Text>
            <Text className="text-gray-400 mt-2">Try different search terms</Text>
          </View>
        ) : (
          <>
            <Text className="text-gray-600 mb-4">
              Found {searchResults.length} recipe{searchResults.length !== 1 ? 's' : ''}
            </Text>
            <FlatList
              data={searchResults}
              renderItem={renderRecipeItem}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}
      </View>
    </View>
  )
}

export default Search