import {
  View,
  Text,
  TextInput,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native"
import React, { useState } from "react"
import { useRouter } from "expo-router"
import { useLoader } from "@/hooks/useLoader"
import { login } from "@/services/authService"

const Login = () => {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { showLoader, hideLoader, isLoading } = useLoader()

  const handleLogin = async () => {
    if (!email || !password || isLoading) {
      Alert.alert("Please enter email and password")
      return
    }

    showLoader()
    try {
      await login(email, password)
      router.replace("/home")
    } catch (e) {
      console.error(e)
      Alert.alert("Login failed", "Invalid email or password")
    } finally {
      hideLoader()
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-orange-50 to-white p-6">
        <View className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <Text className="text-3xl font-bold mb-6 text-center text-gray-900">
            Recipe Finder
          </Text>
          <Text className="text-lg text-center text-gray-600 mb-8">
            Login to discover amazing recipes
          </Text>
          
          <TextInput
            placeholder="Email"
            placeholderTextColor="#6B7280"
            className="border border-gray-300 p-4 mb-4 rounded-xl"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            placeholder="Password"
            placeholderTextColor="#6B7280"
            className="border border-gray-300 p-4 mb-6 rounded-xl"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <Pressable
            className="bg-orange-500 px-6 py-4 rounded-2xl"
            onPress={handleLogin}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {isLoading ? "Logging in..." : "Login"}
            </Text>
          </Pressable>
          
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-700">Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => router.push("/register")}
            >
              <Text className="text-orange-600 font-semibold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Login