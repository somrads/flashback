import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Profile from "./components/Profile";
import { COLORS } from "./constants/colors";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  let [fontsLoaded] = useFonts({
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Black": require("./assets/fonts/Nunito-Black.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
    "Ubuntu-Regular": require("./assets/fonts/Ubuntu-Regular.ttf"),
  });

  useEffect(() => {
    async function prepareApp() {
      try {
        // Keep the splash screen visible while we load everything
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }

      // Wait for fonts to load
      await new Promise((resolve) => {
        const interval = setInterval(() => {
          if (fontsLoaded) {
            clearInterval(interval);
            resolve();
          }
        }, 100);
      });

      // Hide the splash screen
      await SplashScreen.hideAsync();
      setAppIsReady(true);
    }

    prepareApp();
  }, []);

  if (!appIsReady) {
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
  },
});
