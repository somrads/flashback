import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";

const isAndroid = Platform.OS === "android";

const RoleAndDob = ({ route, navigation }) => {
  const { firstName, lastName, email } = route.params;
  const [role, setRole] = useState("");
  const [dob, setDob] = useState("");

  const handleNext = () => {
    if (role && dob) {
      navigation.navigate("Password", {
        firstName,
        lastName,
        email,
        role,
        dob,
      });
    } else {
      alert("Please fill in all fields");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Role and Date of Birth</Text>

      <Text style={styles.label}>Role</Text>
      <View style={styles.dropdownWrapper}>
        <DropDownPicker
          items={[
            { label: "Role 1", value: "Role 1" },
            { label: "Role 2", value: "Role 2" },
            { label: "Role 3", value: "Role 3" },
          ]}
          defaultValue={role}
          containerStyle={styles.dropdownContainer}
          style={styles.dropdown}
          itemStyle={styles.dropdownItem}
          dropDownStyle={styles.dropdownDropDown}
          onChangeItem={(item) => setRole(item.value)}
        />
      </View>

      <Text style={styles.label}>Date of Birth</Text>
      <TextInput
        style={styles.input}
        onChangeText={setDob}
        value={dob}
        placeholder="YYYY-MM-DD"
        keyboardType="numbers-and-punctuation"
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

  dropdownContainer: {
    height: 40,
    marginBottom: 15,
  },
  dropdown: {
    backgroundColor: "#fafafa",
  },
  dropdownItem: {
    justifyContent: "flex-start",
  },
  dropdownDropDown: {
    backgroundColor: "#fafafa",
  },
  dropdownWrapper: {
    zIndex: isAndroid ? undefined : 1000,
    elevation: isAndroid ? 1000 : undefined,
  },
});

export default RoleAndDob;
