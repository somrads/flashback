import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { COLORS } from "../../constants/colors";
import { firebase } from "../../db/firebase";
const ResetPassword = () => {
  const [email, setEmail] = useState("");

  const handleResetPassword = () => {
    firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        alert("If an account exists with this email, a password reset email has been sent!");
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        autoCapitalize="none"
        placeholderTextColor={COLORS.grayWhite}
      />

      <TouchableOpacity
        onPress={handleResetPassword}
        style={styles.resetButton}
      >
        <Text style={styles.resetButtonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: COLORS.grayWhite,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.grayBlack,
    fontSize: 25,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    marginBottom: 30,
  },
  resetButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: COLORS.main,
    borderWidth: 1,
  },
  resetButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },
});

export default ResetPassword;
