import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";

import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, DefaultTheme } from "@react-navigation/stack";
import { firebase } from "./db/firebase";

import Profile from "./components/Profile";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Feed from "./components/Feed";

const Stack = createStackNavigator();

function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  let [fontsLoaded] = useFonts({
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Black": require("./assets/fonts/Nunito-Black.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
    "Ubuntu-Regular": require("./assets/fonts/Ubuntu-Regular.ttf"),
  });

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
  }

  useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, []);

  if (!fontsLoaded || initializing) return null;

  if (!user) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Personal Info" component={Signup} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        // options={{
        //   headerShown: false,
        // }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <AppNavigator />
    </NavigationContainer>
  );
}
