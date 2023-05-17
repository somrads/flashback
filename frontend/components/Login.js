import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../db/firebase";
import { COLORS } from "../constants/colors";

import Logo from "../assets/icons/logo.svg";

const Login = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginUser = async (email, password) => {
    try {
      await firebase.auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      alert(error.message);
    }
  };

  const resetPassword = async (email) => {
    if (email === "") {
      alert("Please enter your email address.");
    } else {
      try {
        await firebase.auth().sendPasswordResetEmail(email);
        alert("Password reset link has been sent to your email.");
      } catch (error) {
        alert(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.logoContainer}>
          <Logo />
          <Text style={styles.logoTitle}>flashback</Text>
          <Text style={styles.logoSlogan}>Catch up in a flash</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.grayWhite}
          keyboardType="email-address"
          onChangeText={(email) => setEmail(email)}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.grayWhite}
          onChangeText={(password) => setPassword(password)}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
        />

        <TouchableOpacity
          onPress={() => resetPassword(email)}
          style={styles.forgotPassword}
        >
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity
          onPress={() => loginUser(email, password)}
          style={styles.loginButton}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Name")}
          style={styles.signupButton}
        >
          <Text style={styles.signupButtonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  logoTitle: {
    fontSize: 50,
    fontWeight: "bold",
    marginTop: 10,
    color: COLORS.grayWhite,
    fontFamily: "Ubuntu-Regular",
  },

  logoSlogan: {
    fontSize: 23,
    marginTop: 5,
    fontFamily: "Nunito-Light",
    color: COLORS.grayWhite,
  },

  formContainer: {
    width: "65%",
    marginBottom: 30,
  },

  input: {
    backgroundColor: "#303030",
    borderRadius: 15,
    color: COLORS.grayWhite,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    fontSize: 16,
  },

  loginButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: COLORS.main,
    borderWidth: 1,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Nunito-Medium",
  },

  signupButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: COLORS.mainDarker,
    borderWidth: 1,
  },

  signupButtonText: {
    color: COLORS.grayWhite,
    fontSize: 18,
    fontFamily: "Nunito-Medium",
  },

  forgotPassword: {
    alignSelf: "flex-end",
  },

  forgotPasswordText: {
    color: COLORS.grayWhite,
    fontSize: 14,
    fontFamily: "Nunito-Medium",
  },
  buttons: {
    marginTop: 10,
  },
});
