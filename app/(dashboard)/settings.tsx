import {
  View,
  Text,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

type SettingsItem = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
  rightText?: string;
  badge?: string;
  color?: string;
};

type SettingsSection = {
  title: string;
  items: SettingsItem[];
};

const Settings = () => {
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoSave, setAutoSave] = useState(true);

  const settingsSections: SettingsSection[] = [
    {
      title: "Preferences",
      items: [
        {
          icon: "notifications",
          label: "Push Notifications",
          rightElement: (
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#767577", true: "#f97316" }}
              thumbColor={notifications ? "#fff" : "#f4f3f4"}
            />
          ),
        },
        {
          icon: "dark-mode",
          label: "Dark Mode",
          rightElement: (
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: "#767577", true: "#f97316" }}
              thumbColor={darkMode ? "#fff" : "#f4f3f4"}
            />
          ),
        },
        {
          icon: "save",
          label: "Auto Save Drafts",
          rightElement: (
            <Switch
              value={autoSave}
              onValueChange={setAutoSave}
              trackColor={{ false: "#767577", true: "#f97316" }}
              thumbColor={autoSave ? "#fff" : "#f4f3f4"}
            />
          ),
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          icon: "person",
          label: "Edit Profile",
          onPress: () => Alert.alert("Coming Soon", "Profile editing coming soon!"),
        },
        {
          icon: "email",
          label: "Change Email",
          onPress: () => Alert.alert("Coming Soon", "Email change coming soon!"),
        },
        {
          icon: "lock",
          label: "Change Password",
          onPress: () => Alert.alert("Coming Soon", "Password change coming soon!"),
        },
        {
          icon: "delete",
          label: "Delete Account",
          color: "#ef4444",
          onPress: () => {
            Alert.alert(
              "Delete Account",
              "This action cannot be undone. All your recipes will be deleted.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => Alert.alert("Account deletion coming soon!"),
                },
              ]
            );
          },
        },
      ],
    },
    {
      title: "App",
      items: [
        {
          icon: "language",
          label: "Language",
          rightText: "English",
          onPress: () => Alert.alert("Coming Soon", "Language selection coming soon!"),
        },
        {
          icon: "storage",
          label: "Clear Cache",
          onPress: () => {
            Alert.alert(
              "Clear Cache",
              "This will clear temporary data. Your recipes will not be affected.",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Clear",
                  onPress: () => Alert.alert("Success", "Cache cleared successfully!"),
                },
              ]
            );
          },
        },
        {
          icon: "update",
          label: "Check for Updates",
          badge: "New",
          onPress: () => Alert.alert("Up to date", "You have the latest version!"),
        },
      ],
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-orange-500 pt-14 pb-10 px-6 rounded-b-3xl">
        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
          <Text className="text-white ml-3 text-lg font-medium">Back</Text>
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold tracking-tight">
          Settings
        </Text>
        <Text className="text-orange-100 mt-1.5 text-lg">
          Customize your experience
        </Text>
      </View>

      {/* Settings Content */}
      <View className="px-5 mt-6 pb-10">
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} className="mb-8">
            <Text className="text-lg font-bold text-gray-800 mb-3 px-1">
              {section.title}
            </Text>

            <View className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  activeOpacity={0.7}
                  onPress={item.onPress}
                  // Switch තියෙන එකට onPress disable කරන්න (propagation stop)
                  disabled={!!item.rightElement}
                  className={`flex-row items-center justify-between px-5 py-4 ${
                    itemIndex < section.items.length - 1
                      ? "border-b border-gray-100"
                      : ""
                  }`}
                >
                  <View className="flex-row items-center flex-1">
                    <View
                      className="p-2.5 rounded-xl mr-4"
                      style={{
                        backgroundColor: item.color
                          ? `${item.color}15`
                          : "#f3f4f6",
                      }}
                    >
                      <MaterialIcons
                        name={item.icon}
                        size={22}
                        color={item.color || "#6b7280"}
                      />
                    </View>

                    <View className="flex-1">
                      <Text
                        className={`font-medium ${
                          item.color ? "text-red-600" : "text-gray-800"
                        }`}
                      >
                        {item.label}
                      </Text>
                      {item.rightText && (
                        <Text className="text-gray-500 text-sm mt-0.5">
                          {item.rightText}
                        </Text>
                      )}
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    {item.badge && (
                      <View className="bg-orange-500 rounded-full px-2.5 py-1 mr-3">
                        <Text className="text-white text-xs font-bold">
                          {item.badge}
                        </Text>
                      </View>
                    )}

                    {item.rightElement ? (
                      <View pointerEvents="box-only">{item.rightElement}</View>
                    ) : (
                      <MaterialIcons
                        name="chevron-right"
                        size={22}
                        color="#9ca3af"
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View className="items-center py-8 px-6">
        <Text className="text-gray-500 text-sm">Recipe Finder v1.0.0</Text>
        <Text className="text-gray-400 text-xs mt-1.5">
          © {new Date().getFullYear()} Recipe Finder. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
};

export default Settings;