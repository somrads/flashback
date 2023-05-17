import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { firebase } from "../../db/firebase";

const Password = ({ route, navigation }) => {
  const { firstName, lastName, email } = route.params;
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      await userCredential.user.sendEmailVerification();

      alert("Verification email sent");

      await firebase.database().ref(`users/${userCredential.user.uid}`).set({
        firstName,
        lastName,
        email,
      });

      navigation.navigate("Feed");
    } catch (error) {
      console.log("Error:", error.message);
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Password</Text>

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={handleSignup} style={styles.signupButton}>
        <Text style={styles.signupButtonText}>Signup</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    marginBottom: 15,
  },
  signupButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  signupButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default Password;
