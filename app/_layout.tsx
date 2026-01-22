import { View } from "react-native"
import React from "react"
import { Slot } from "expo-router"
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context"

const RootLayout = () => {
  const insets = useSafeAreaInsets()

  return (
   
        <View style={{ marginTop: insets.top, flex: 1 }}>
          <Slot />
        </View>
    
  )
}

export default RootLayout