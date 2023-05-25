import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet, Text } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import { COLORS } from "../../constants/colors";

const RoleAndDob = ({ route, navigation }) => {
  const { firstName, lastName, email } = route.params;
  const [role, setRole] = useState("");
  const [dob, setDob] = useState(null);
  const [tempDate, setTempDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const toggleDatePicker = () => {
    setShow(!show);
  };

  const handleSelectDate = (selectedDate) => {
    setTempDate(selectedDate || tempDate);
  };

  const handleConfirmDate = () => {
    setShow(false);
    setDob(tempDate);
  };

  const handleCancelDate = () => {
    setShow(false);
  };

  const handleNext = () => {
    if (role && dob) {
      const dobUTC = new Date(dob.getTime() - dob.getTimezoneOffset() * 60000);
      navigation.navigate("Password", {
        firstName,
        lastName,
        email,
        role,
        dob: dobUTC.toISOString().split("T")[0],
      });
    } else {
      alert("Please fill in all fields");
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <View style={styles.rolePickerContainer}></View>
        <RNPickerSelect
          onValueChange={(value) => setRole(value)}
          items={[
            { label: "Dad", value: "Daddy" },
            { label: "Mom", value: "Mommy" },
            { label: "Son", value: "Son" },
            { label: "Daughter", value: "Daughter" },
            { label: "Grandpa", value: "Grandpa" },
            { label: "Grandma", value: "Grandmother" },
            { label: "Uncle", value: "Uncle" },
            { label: "Auntie", value: "Auntie" },
            { label: "Cousin", value: "Cousin" },
            { label: "Other", value: "Other" },
          ]}
          placeholder={{ label: "Role", value: null }}
          style={pickerSelectStyles}
        />
        <View style={styles.datePickerContainer}>
          <View style={styles.dateInputContainer}>
            <TouchableOpacity onPress={toggleDatePicker}>
              <Text style={styles.dateInput}>
                {dob ? formatDate(dob) : "Birthday"}
              </Text>
            </TouchableOpacity>
          </View>
          {show && (
            <View>
              <DateTimePicker
                value={tempDate}
                mode="date"
                display="spinner"
                onChange={(event, selectedDate) =>
                  handleSelectDate(selectedDate)
                }
                maximumDate={new Date()}
                textColor={COLORS.main}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={handleCancelDate}
                  style={styles.cancelButton}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleConfirmDate}
                  style={styles.confirmButton}
                >
                  <Text style={styles.buttonText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        {!show && (
          <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 25,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.grayBlack,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    paddingRight: 30,
    marginBottom: 60,
  },
  inputAndroid: {
    fontSize: 25,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0,
    borderBottomWidth: 3,
    borderBottomColor: COLORS.grayBlack,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    paddingRight: 30,
    marginBottom: 60,
  },
});

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
  datePickerContainer: {
    width: "100%",
    marginBottom: 60,
    alignSelf: "flex-start",
  },
  dateInputContainer: {
    borderBottomWidth: 3,
    borderBottomColor: COLORS.grayBlack,
  },
  dateInput: {
    fontSize: 25,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    marginBottom: -10,
  },
  nextButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 75,
    borderRadius: 8,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
  cancelButton: {
    borderColor: COLORS.main,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  confirmButton: {
    backgroundColor: COLORS.main,
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
  },
});

export default RoleAndDob;
