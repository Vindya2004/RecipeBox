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
import { registerUser } from "@/services/authService"
import { useLoader } from "@/hooks/useLoader"

const Register = () => {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [conPassword, setConPassword] = useState("")
  const { showLoader, hideLoader, isLoading } = useLoader()

  const handleRegister = async () => {
    if (!name || !email || !password || !conPassword || isLoading) {
      Alert.alert("Please fill all fields")
      return
    }
    
    if (password !== conPassword) {
      Alert.alert("Passwords do not match")
      return
    }
    
    if (password.length < 6) {
      Alert.alert("Password should be at least 6 characters")
      return
    }
    
    showLoader()
    try {
      await registerUser(name, email, password)
      Alert.alert("Success", "Account created successfully!")
      router.replace("/login")
    } catch (e: any) {
      console.error(e)
      Alert.alert("Registration failed", e.message || "Please try again")
    } finally {
      hideLoader()
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View className="flex-1 justify-center items-center bg-gradient-to-b from-orange-50 to-white p-6">
        <View className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <Text className="text-3xl font-bold mb-2 text-center text-gray-900">
            Create Account
          </Text>
          <Text className="text-gray-600 text-center mb-8">
            Join our recipe community
          </Text>
          
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#6B7280"
            className="border-2 border-gray-200 bg-white p-4 mb-4 rounded-xl text-gray-800"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            placeholder="Email"
            placeholderTextColor="#6B7280"
            className="border-2 border-gray-200 bg-white p-4 mb-4 rounded-xl text-gray-800"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            placeholder="Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            className="border-2 border-gray-200 bg-white p-4 mb-4 rounded-xl text-gray-800"
            value={password}
            onChangeText={setPassword}
          />
          
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#6B7280"
            secureTextEntry
            className="border-2 border-gray-200 bg-white p-4 mb-6 rounded-xl text-gray-800"
            value={conPassword}
            onChangeText={setConPassword}
          />
          
          <Pressable
            className={`bg-orange-500 px-6 py-4 rounded-2xl ${isLoading ? 'opacity-70' : ''}`}
            onPress={handleRegister}
            disabled={isLoading}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {isLoading ? "Creating..." : "Create Account"}
            </Text>
          </Pressable>
          
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-700">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text className="text-orange-600 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Register