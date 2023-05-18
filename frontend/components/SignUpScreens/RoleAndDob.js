import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DatePicker from "react-native-datepicker";

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
      <RNPickerSelect
        onValueChange={(value) => setRole(value)}
        items={[
          { label: "Daddy", value: "Daddy" },
          { label: "Mommy", value: "Mommy" },
          { label: "Son", value: "Son" },
          { label: "Daughter", value: "Daughter" },
          { label: "Grandpa", value: "Grandpa" },
          { label: "Grandma", value: "Grandmother" },
          { label: "Uncle", value: "Uncle" },
          { label: "Auntie", value: "Auntie" },
          { label: "Cousin", value: "Cousin" },
          { label: "Other", value: "Other" },
        ]}
        placeholder={{ label: "Select a Role", value: null }}
        style={pickerSelectStyles}
      />
      <DatePicker
        style={styles.datePicker}
        date={dob}
        mode="date"
        placeholder="Select date"
        format="YYYY-MM-DD"
        minDate="1900-01-01"
        maxDate={new Date()} // Today's date
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        showIcon={true}
        customStyles={{
          dateIcon: {
            width: 20,
            height: 20,
            tintColor: "#3498db",
          },
          dateInput: {
            marginLeft: 36,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
            alignItems: "flex-start",
            padding: 10,
          },
          placeholderText: {
            color: "#999",
            fontSize: 16,
          },
          dateText: {
            fontSize: 16,
            color: "#000",
          },
        }}
        onDateChange={(date) => setDob(date)}
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
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "black",
    paddingRight: 30,
    marginBottom: 15,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: "purple",
    borderRadius: 8,
    color: "black",
    paddingRight: 30,
    marginBottom: 15,
  },
});

export default RoleAndDob;
