import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { firebase } from "../../db/firebase";
import { COLORS } from "../../constants/colors";

const Password = ({ route, navigation }) => {
  const { firstName, lastName, email, role, dob } = route.params;
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const handleSignup = async () => {
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);
      if (response.user) {
        await response.user.sendEmailVerification();
        alert("A verification email has been sent to your email account");
        const userData = {
          firstName,
          lastName,
          email,
          role,
          dob,
        };
        await firebase
          .database()
          .ref("users")
          .child(response.user.uid)
          .set(userData);
        navigation.navigate("VerifyEmail");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}></View>
      <View style={styles.contentContainer}>
        <View style={styles.inputsContainer}>
          <TextInput
            style={styles.input}
            onChangeText={setPassword}
            value={password}
            placeholder="Password"
            placeholderTextColor={COLORS.grayWhite}
            secureTextEntry
          />

          <TextInput
            style={styles.input}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            placeholder="Confirm Password"
            placeholderTextColor={COLORS.grayWhite}
            secureTextEntry
          />
        </View>

        <TouchableOpacity onPress={handleSignup} style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Complete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  titleContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: {
    width: "100%",
  },
  title: {
    fontSize: 40,
    textAlign: "center",
    fontFamily: "Nunito-Bold",
    color: COLORS.grayWhite,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.grayBlack,
    fontSize: 25,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    marginBottom: 80,
    width: "100%",
  },
  signUpButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: COLORS.main,
    borderWidth: 1,
    alignSelf: "center",
  },
  signUpButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },
});

export default Password;
