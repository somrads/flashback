import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";

import { useFonts } from "expo-font";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { auth } from "./db/firebase";
import {
  LogBox,
  Text,
  TouchableOpacity,
} from "react-native";

import { useNavigation } from "@react-navigation/native";
import { COLORS } from "./constants/colors";

import Login from "./components/Login";
import Profile from "./components/Profile";
import Name from "./components/SignUpScreens/Name";
import Email from "./components/SignUpScreens/Email";
import Password from "./components/SignUpScreens/Password";
import RoleAndDob from "./components/SignUpScreens/RoleAndDob";
import Feed from "./components/Feed";
import Add from "./components/Add";
import Options from "./components/Options";
import ResetPassword from "./components/SignUpScreens/ResetPassword";
import VerifyEmail from "./components/VerifyEmail";
import FriendRequest from "./components/FriendRequest";

import OptionsIcon from "./assets/icons/edit.svg";
import Arrow from "./assets/icons/arrow.svg";

const Stack = createStackNavigator();
LogBox.ignoreLogs(["Animated: `useNativeDriver`"]);

function SignUpNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
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
      <Stack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{
          title: "Reset Password",
        }}
      />
    </Stack.Navigator>
  );
}

function AppNavigator() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();
  const navigation = useNavigation();

  let [fontsLoaded] = useFonts({
    "Nunito-Bold": require("./assets/fonts/Nunito-Bold.ttf"),
    "Nunito-Regular": require("./assets/fonts/Nunito-Regular.ttf"),
    "Nunito-Black": require("./assets/fonts/Nunito-Black.ttf"),
    "Nunito-SemiBold": require("./assets/fonts/Nunito-SemiBold.ttf"),
    "Nunito-Medium": require("./assets/fonts/Nunito-Medium.ttf"),
    "Nunito-Light": require("./assets/fonts/Nunito-Light.ttf"),
    "Ubuntu-Regular": require("./assets/fonts/Ubuntu-Regular.ttf"),
  });

  useEffect(() => {
    const subscriber = auth.onIdTokenChanged((user) => {
      if (user) {
        user.reload().then(() => {
          setUser(user);
          if (initializing) setInitializing(false);
        });
      } else {
        setUser(null);
        if (initializing) setInitializing(false);
      }
    });

    return subscriber;
  }, [initializing]);

  if (!fontsLoaded || initializing) return null;

  if (!user) {
    return <SignUpNavigator />;
  }

  if (user && !user.emailVerified) {
    return (
      <Stack.Navigator>
        <Stack.Screen
          name="VerifyEmail"
          component={VerifyEmail}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={Feed}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{
          unmountOnBlur: true,
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
          title: "Profile",
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("Options")}
              style={{ marginRight: 20 }}
            >
              <OptionsIcon width={25} height={20} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen
        name="Options"
        component={Options}
        options={{
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
          title: "Edit Profile",
          headerBackTitleVisible: false,
          headerBackImage: () => (
            <Text style={{ color: "white", marginLeft: 20, fontSize: 20 }}>
              Cancel
            </Text>
          ),
        }}
      />
      <Stack.Screen
        name="Add"
        component={Add}
        options={{
          unmountOnBlur: true,
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
          title: "Add Family",
        }}
      />
      <Stack.Screen
        name="FriendRequest"
        component={FriendRequest}
        options={{
          unmountOnBlur: true,
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
          title: "Add Requests",
        }}
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
