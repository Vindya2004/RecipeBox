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
      Alert.alert("Please fill all fields...!")
      return
    }

    if (password !== conPassword) {
      Alert.alert("Passwords do not match...!")
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
        <View className="w-full bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-lg">
          <Text className="text-3xl font-bold mb-6 text-center text-gray-900">
            Create Account
          </Text>
          
          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#6B7280"
            className="border border-gray-300 p-4 mb-4 rounded-xl"
            value={name}
            onChangeText={setName}
          />
          
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
            className="border border-gray-300 p-4 mb-4 rounded-xl"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#6B7280"
            className="border border-gray-300 p-4 mb-6 rounded-xl"
            value={conPassword}
            onChangeText={setConPassword}
            secureTextEntry
          />
          
          <Pressable
            className="bg-orange-500 px-6 py-4 rounded-2xl"
            onPress={handleRegister}
          >
            <Text className="text-white text-lg font-semibold text-center">
              {isLoading ? "Creating account..." : "Register"}
            </Text>
          </Pressable>
          
          <View className="flex-row justify-center mt-6">
            <Text className="text-gray-700">Already have an account? </Text>
            <TouchableOpacity
              onPress={() => router.back()}
            >
              <Text className="text-orange-600 font-semibold">Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default Register