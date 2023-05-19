import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Text,
} from "react-native";
import { firebase } from "../../db/firebase";
import { COLORS } from "../../constants/colors";

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
      <View style={styles.contentContainer}>
        <TextInput
          style={styles.input}
          onChangeText={setEmail}
          value={email}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor={COLORS.grayWhite}
        />
        <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
          <Text style={styles.nextButtonText}>Next</Text>
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
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.grayBlack,
    fontSize: 25,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    marginBottom: 60,  // Adjusted marginBottom
    width: "100%",
  },
  nextButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 15,
    marginBottom: 20,
    borderColor: COLORS.main,
    borderWidth: 1,
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Nunito-Medium",
    textAlign: "center",
  },
});

export default EmailPage;
