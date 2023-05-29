import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { ref, set } from "firebase/database";
import { COLORS } from "../../constants/colors";
import { auth, database } from "../../db/firebase";

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

    let response;
    try {
      response = await createUserWithEmailAndPassword(auth, email, password);
      if (response.user) {
        if (auth.currentUser) {
          await sendEmailVerification(auth.currentUser);
          alert("A verification email has been sent to your email account");
        }

        const initials = firstName.charAt(0) + lastName.charAt(0);

        const colors = [
          "#2A9D8F",
          "#9D2A38",
          "#9D2A91",
          "#2A589D",
          "#9D5A2A",
          "#2A9D61",
          "#9D2A6A",
          "#5F2A9D",
          "#9D5F2A",
        ];

        const color = colors[Math.floor(Math.random() * colors.length)];

        const userData = {
          firstName,
          lastName,
          email,
          role,
          dob,
          initials,
          color,
        };

        try {
          await set(ref(database, `users/${response.user.uid}`), userData);
          navigation.navigate("VerifyEmail");
        } catch (error) {
          console.log("Error while setting user data:", error);
          alert("An error occurred while completing the registration.");
        }
      }
    } catch (error) {
      alert(error.message);
      console.log(error);
      console.log(database);
      if (response && response.user) console.log(response.user.uid);
      console.log(userData);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.contentContainer}
        >
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
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputsContainer: {
    width: "100%",
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
