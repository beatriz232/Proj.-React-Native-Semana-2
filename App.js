import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import HomeScreen from "./src/screens/HomeScreen";
import { COLORS } from "./src/styles/colors";

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <StatusBar barStyle="dark-content" />
      <HomeScreen />
    </SafeAreaView>
  );
}
