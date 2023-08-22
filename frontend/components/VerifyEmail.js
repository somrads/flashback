import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { auth } from "../db/firebase";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
import Logo from "../assets/icons/logo.svg";

const VerifyEmail = () => {
  const navigation = useNavigation();

  const resendEmail = () => {
    const user = auth.currentUser;
    if (user) {
      user
        .sendEmailVerification()
        .then(function () {
          alert("Verification email sent!");
        })
        .catch(function (error) {
          alert("Error sending verification email: " + error.message);
        });
    } else {
      alert("No current user found. Please log in again.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Logo width={186} height={186} />
      </View>
      <View style={styles.text}>
        <Text style={styles.verifyTitle}>Thank you for signing up!</Text>
        <Text style={styles.verifyText}>
          Check your email, including <Text style={styles.boldText}>spam</Text>,
          for verification instructions. Once verified, please{" "}
          <Text style={styles.boldText}>restart the app</Text> for a successful
          login. Thank you!
        </Text>
      </View>
      <View style={styles.buttons}>
        <TouchableOpacity onPress={resendEmail} style={styles.resendButton}>
          <Text style={styles.buttonText}>Resend link</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUp", { screen: "Login" })}
          style={styles.loginButton}
        >
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VerifyEmail;

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
    marginBottom: 50,
  },
  verifyText: {
    fontSize: 18,
    color: COLORS.grayWhite,
    marginHorizontal: 40,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Nunito-Regular",
  },
  verifyTitle: {
    fontSize: 22,
    color: COLORS.grayWhite,
    marginHorizontal: 40,
    textAlign: "center",
    marginBottom: 30,
    fontFamily: "Nunito-Bold",
  },
  resendButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    width: 200,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: COLORS.main,
    borderWidth: 1,
    alignSelf: "center",
  },
  loginButton: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    width: 200,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: COLORS.main,
    borderWidth: 1,
    alignSelf: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },

  text: {
    marginBottom: 50,
  },
  boldText: {
    fontFamily: "Nunito-Black",
    color: COLORS.main,
    fontSize: 19,
  },
});
