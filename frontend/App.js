import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";

import { useFonts } from "expo-font";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator, DefaultTheme } from "@react-navigation/stack";
import { firebase } from "./db/firebase";
import { LogBox } from "react-native";
import { COLORS } from "./constants/colors";

import Profile from "./components/Profile";
import Login from "./components/Login";
import Name from "./components/SignUpScreens/Name";
import Email from "./components/SignUpScreens/Email";
import Password from "./components/SignUpScreens/Password";
import RoleAndDob from "./components/SignUpScreens/RoleAndDob";
import Feed from "./components/Feed";
import Arrow from "./assets/icons/arrow.svg";

const Stack = createStackNavigator();
LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);

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
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.background,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 0,
          },
          headerTintColor: COLORS.grayWhite,
          headerTitleStyle: {
            fontSize: 24,
            fontFamily: "Nunito-Medium",
          },
          headerBackImage: () => (
            <Arrow width={25} height={20} style={{ marginLeft: 20 }} />
          ),
          headerBackTitleVisible: false,
          title: "Personal Info",
        }}
      >
        <Stack.Screen
          name="Login"
          component={Login}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Name" component={Name} />
        <Stack.Screen name="Email" component={Email} />
        <Stack.Screen name="Password" component={Password} />
        <Stack.Screen name="RoleAndDob" component={RoleAndDob} />
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
