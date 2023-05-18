import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { firebase } from "../../db/firebase";
import { COLORS } from "../../constants/colors";

const Name = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleNext = () => {
    if (firstName && lastName) {
      navigation.navigate("Email", {
        firstName,
        lastName,
      });
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Personal Info</Text>
      </View>

      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="First Name"
        placeholderTextColor={COLORS.grayWhite}
      />

      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Last Name"
        placeholderTextColor={COLORS.grayWhite}
      />

      <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
        <Text style={styles.nextButtonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  titleContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  title: {
    fontSize: 50,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "Nunito-Bold",
    color: COLORS.grayWhite,
  },
  input: {
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.grayBlack,
    fontSize: 30,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    marginBottom: 40, // Increase marginBottom for more spacing between inputs
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

export default Name;
