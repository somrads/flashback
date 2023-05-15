import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Logo from "../assets/icons/logo.svg";
import { COLORS } from "../constants/colors";

const Home = () => {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo />
        <Text style={styles.logoTitle}>flashback</Text>
        <Text style={styles.logoSlogan}>Catch up in a flash</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.loginButton} onPress={() => {}}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.signUpButton} onPress={() => {}}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;

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

  loginButton: {
    borderColor: COLORS.main,
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
  },

  signUpButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 15,
  },

  signUpButtonText: {
    color: COLORS.grayWhite,
    fontSize: 18,
    fontFamily: "Nunito-Medium",
  },

  buttons: {
    marginTop: 20,
  },
});
