import React from "react";
import { View, Text, Button, TouchableOpacity } from "react-native";
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

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Please verify your email and try to log in after.</Text>
      <Button title="Resend verification email" onPress={resendEmail} />
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default VerifyEmail;
