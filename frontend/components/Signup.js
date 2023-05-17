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
import { Picker } from "@react-native-picker/picker";

const Signup = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [role, setRole] = useState("");

  const handleSignup = () => {
    navigation.navigate("Name", { signupUser });
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    console.log("handleSignup called");

    signupUser(
      email,
      password,
      firstName,
      lastName,
      dateOfBirth,
      role,
      navigation
    );
  };

  async function signupUser(
    email,
    password,
    firstName,
    lastName,
    dateOfBirth,
    role,
    navigation
  ) {
    try {
      console.log("signupUser called");
      const userCredential = await firebase
        .auth()
        .createUserWithEmailAndPassword(email, password);

      console.log("userCredential:", userCredential);

      console.log("before sendEmailVerification");
      await userCredential.user.sendEmailVerification();
      console.log("after sendEmailVerification");

      alert("Verification email sent");

      await firebase.database().ref(`users/${userCredential.user.uid}`).set({
        firstName,
        lastName,
        email,
        dateOfBirth,
        role,
      });

      navigation.navigate("Feed");
    } catch (error) {
      console.log("Error:", error.message);
      alert(error.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Signup</Text>

      <Text style={styles.label}>First Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="First Name"
      />

      <Text style={styles.label}>Last Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Last Name"
      />

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDateOfBirth}
        value={dateOfBirth}
        placeholder="YYYY-MM-DD"
      />

      <Text style={styles.label}>Role</Text>
      <Picker
        selectedValue={role}
        style={styles.input}
        onValueChange={(itemValue) => setRole(itemValue)}
      >
        <Picker.Item label="Mom" value="mom" />
        <Picker.Item label="Dad" value="dad" />
        <Picker.Item label="Daughter" value="daughter" />
        <Picker.Item label="Son" value="son" />
        <Picker.Item label="Grandfather" value="grandfather" />
        <Picker.Item label="Grandmother" value="grandmother" />
        <Picker.Item label="Uncle" value="uncle" />
        <Picker.Item label="Auntie" value="auntie" />
        <Picker.Item label="Cousin" value="cousin" />
      </Picker>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="Password"
        secureTextEntry={true}
        autoCapitalize="none"
      />

      <Text style={styles.label}>Confirm Password</Text>
      <TextInput
        style={styles.input}
        onChangeText={setConfirmPassword}
        value={confirmPassword}
        placeholder="Re-enter Password"
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

export default Signup;
