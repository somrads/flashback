import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from "react-native";
import { COLORS } from "../constants/colors";

const windowWidth = Dimensions.get("window").width;

const Options = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");

  const handleSaveChanges = () => {};

  const handleDeleteAccount = () => {};

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={{ backgroundColor: COLORS.background }}
    >
      <View style={styles.profileImageContainer}>
        <View style={styles.profileImage}></View>
        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.buttonText}>Edit Picture</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
          placeholderTextColor={COLORS.grayWhite}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
          placeholderTextColor={COLORS.grayWhite}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          value={bio}
          onChangeText={setBio}
          placeholder="Enter your bio"
          placeholderTextColor={COLORS.grayWhite}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Role</Text>
        <TextInput
          style={styles.input}
          value={role}
          onChangeText={setRole}
          placeholder="Enter your role"
          placeholderTextColor={COLORS.grayWhite}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Birthday</Text>
        <TextInput
          style={styles.input}
          value={birthday}
          onChangeText={setBirthday}
          placeholder="Enter your birthday"
          placeholderTextColor={COLORS.grayWhite}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor={COLORS.grayWhite}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteAccount}
      >
        <Text style={styles.buttonText2}>Delete Account</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.background,
  },
  profileImageContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  profileImage: {
    width: 120,
    height: 116,
    borderRadius: 100,
    backgroundColor: COLORS.grayWhite,
    marginBottom: 10,
  },
  formContainer: {
    width: windowWidth * 0.8,
  },
  label: {
    fontSize: 16,
    color: COLORS.grayWhite,
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: 20,
  },
  input: {
    backgroundColor: "#303030",
    borderRadius: 8,
    color: COLORS.grayWhite,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    fontSize: 16,
    width: "90%",
    alignSelf: "center",
  },
  saveButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: COLORS.main,
    borderWidth: 1,
    alignSelf: "center",
  },
  deleteButton: {
    backgroundColor: COLORS.red,
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 8,
    marginBottom: 20,
    borderColor: COLORS.red,
    borderWidth: 1,
    alignSelf: "center",
  },
  buttonText: {
    color: COLORS.main,
    fontSize: 15,
    fontFamily: "Nunito-Medium",
  },
  buttonText2: {
    color: "#580020",
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
  editButton: {
    alignItems: "center",
  },
});

export default Options;
