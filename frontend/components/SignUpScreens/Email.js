import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { firebase } from "../../db/firebase";

const EmailPage = ({ route, navigation }) => {
  const { firstName, lastName } = route.params;
  const [email, setEmail] = useState("");

  const checkEmailExists = async (email) => {
    const usersRef = firebase.database().ref("users");
    let emailExists = false;

    await usersRef.once("value", (snapshot) => {
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().email === email) {
          emailExists = true;
        }
      });
    });

    return emailExists;
  };

  const handleNext = async () => {
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (email && emailRegex.test(email)) {
      const emailExists = await checkEmailExists(email);
      if (!emailExists) {
        navigation.navigate("RoleAndDob", {
          firstName: route.params.firstName,
          lastName: route.params.lastName,
          email,
        });
      } else {
        alert("This email is already taken, please enter another one");
      }
    } else {
      alert("Please enter a valid email address");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Email</Text>

      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
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
  nextButton: {
    backgroundColor: "#3498db",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  nextButtonText: {
    fontSize: 18,
    color: "#fff",
  },
  backButton: {
    marginTop: 10,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#3498db",
  },
});

export default EmailPage;
