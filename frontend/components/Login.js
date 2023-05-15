import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from "react-native";
import Logo from "../assets/icons/logo.svg";
import { COLORS } from "../constants/colors";

const Login = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
        <Text style={styles.logoTitle}>flashback</Text>
        <Text style={styles.logoSlogan}>Catch up in a flash</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.grayWhite}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor={COLORS.grayWhite}
          secureTextEntry={true}
        />

        <TouchableOpacity style={styles.forgotPassword} onPress={() => {}}>
          <Text style={styles.forgotPasswordText}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.loginButton} onPress={() => {}}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
    width: "60%",
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

  forgotPassword: {
    alignSelf: "center",
  },

  forgotPasswordText: {
    color: COLORS.grayWhite,
    fontSize: 15,
    fontFamily: 'Nunito-Medium'
  },

  loginButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 70,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: COLORS.main,
    borderWidth: 1,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Nunito-Medium"
  },
});
