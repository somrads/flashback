import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Profile from "./components/Profile";
import { COLORS } from "./constants/colors";
import { useFonts } from "expo-font";

export default function App() {
  let [fontsLoaded] = useFonts({
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Black": require("./assets/fonts/Nunito-Black.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
    "Ubuntu-Regular": require("./assets/fonts/Ubuntu-Regular.ttf"),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Profile />
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    // alignItems: "center",
    // justifyContent: "center",
  },
});
