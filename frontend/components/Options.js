import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import { COLORS } from "../constants/colors";

const Options = () => {
  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState("");
  const [bio, setBio] = useState("");

  const handleSaveChanges = () => {
    // Handle saving changes to the database
    // For example, update the user's name, birthday, and bio
  };

  return (
    <View style={styles.container}>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Birthday</Text>
        <TextInput
          style={styles.input}
          value={birthday}
          onChangeText={setBirthday}
          placeholder="Enter your birthday"
        />
      </View>
      
      <View style={styles.formGroup}>
        <Text style={styles.label}>Bio</Text>
        <TextInput
          style={styles.input}
          value={bio}
          onChangeText={setBio}
          placeholder="Enter your bio"
          multiline
        />
      </View>
      
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: COLORS.grayWhite,
    marginBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: COLORS.grayWhite,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.grayWhite,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: COLORS.grayWhite,
  },
  saveButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.grayWhite,
  },
});

export default Options;
