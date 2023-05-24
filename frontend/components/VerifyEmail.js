import React from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { firebase } from "../db/firebase";
import { useNavigation } from "@react-navigation/native";

const VerifyEmail = () => {
  const user = firebase.auth().currentUser;
  const navigation = useNavigation();

  const resendEmail = () => {
    if (user) {
      user
        .sendEmailVerification()
        .then(function () {
          alert("Verification email sent!");
        })
        .catch(function (error) {
          alert("Error sending verification email: " + error.message);
        });
    }
  };

  const goBack = () => {
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text>Please verify your email and try to log in after.</Text>
      <Button title="Resend verification email" onPress={resendEmail} />
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp", { screen: "Login" })}
      >
        <Text>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#007bff",
    fontSize: 16,
    textDecorationLine: "underline",
    marginTop: 20,
  },
});

export default VerifyEmail;
