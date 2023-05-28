import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { COLORS } from "../constants/colors";
import { firebase, database } from "../db/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getDatabase, ref, onValue, update } from "firebase/database";
import RNPickerSelect from "react-native-picker-select";
import DateTimePicker from "@react-native-community/datetimepicker";
import tinycolor from "tinycolor2";

const windowWidth = Dimensions.get("window").width;

const auth = firebase.auth();

const Options = () => {
  const [user] = useAuthState(auth);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [bio, setBio] = useState("");
  const [role, setRole] = useState("");
  const [birthday, setBirthday] = useState("");
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(new Date());
  const [color, setColor] = useState("");
  const [initials, setInitials] = useState("");
  const [darkerColor, setDarkerColor] = useState("");

  const toggleDatePicker = () => {
    setShow(!show);
  };

  const handleSelectDate = (selectedDate) => {
    setTempDate(selectedDate || tempDate);
  };

  const handleConfirmDate = () => {
    setShow(false);
    setBirthday(tempDate);
  };

  const handleCancelDate = () => {
    setShow(false);
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `0${date.getMonth() + 1}`.slice(-2);
    const day = `0${date.getDate()}`.slice(-2);
    return `${year}-${month}-${day}`;
  };

  function darkenColor(color) {
    let colorObj = tinycolor(color);
    let { r, g, b } = colorObj.toRgb();

    r = Math.floor(r / 2);
    g = Math.floor(g / 2);
    b = Math.floor(b / 2);

    return tinycolor({ r, g, b }).toString();
  }

  useEffect(() => {
    if (user) {
      const dbRef = ref(database, `users/${user.uid}`);
      onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        setFirstName(data.firstName);
        setLastName(data.lastName);
        setBio(data.bio);
        setRole(data.role);
        setBirthday(data.dob);
        setEmail(data.email);

        const userInitials = data.firstName[0] + data.lastName[0];
        setInitials(userInitials.toUpperCase());
        setColor(data.color);
        setDarkerColor(darkenColor(data.color));
      });
    }
  }, [user]);

  const handleSaveChanges = () => {
    if (user) {
      const dbRef = ref(database, `users/${user.uid}`);
      update(dbRef, {
        firstName: firstName,
        lastName: lastName,
        bio: bio,
        role: role,
        dob: birthday,
        email: email,
      });
    }
  };

  const handleDeleteAccount = () => {};

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        style={{ backgroundColor: COLORS.background }}
      >
        <View style={styles.profileImageContainer}>
          <View style={[styles.profileImage, { backgroundColor: color }]}>
            <Text style={{ color: darkerColor, fontSize: 50, fontFamily:'Nunito-Black' }}>{initials}</Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editText}>Edit Picture</Text>
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

          <RNPickerSelect
            onValueChange={(value) => setRole(value)}
            items={[
              { label: "Dad", value: "Dad" },
              { label: "Mom", value: "Mom" },
              { label: "Son", value: "Son" },
              { label: "Daughter", value: "Daughter" },
              { label: "Grandpa", value: "Grandpa" },
              { label: "Grandma", value: "Grandma" },
              { label: "Uncle", value: "Uncle" },
              { label: "Auntie", value: "Auntie" },
              { label: "Cousin", value: "Cousin" },
              { label: "Other", value: "Other" },
            ]}
            placeholder={{ label: role || "Role", value: role || null }}
            value={role}
            style={pickerSelectStyles}
          />

          <Text style={styles.label}>Birthday</Text>
          <View style={styles.dateInputContainer}>
            <TouchableOpacity
              onPress={toggleDatePicker}
              style={styles.datePicker}
            >
              <Text style={styles.datePickerText}>
                {birthday ? formatDate(new Date(birthday)) : "Birthday"}
              </Text>
            </TouchableOpacity>
          </View>
          {show && (
            <DateTimePicker
              value={tempDate}
              mode="date"
              display="spinner"
              onChange={(event, selectedDate) => handleSelectDate(selectedDate)}
              maximumDate={new Date()}
              textColor={COLORS.main}
            />
          )}

          {show && (
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
          )}
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
    </KeyboardAvoidingView>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    backgroundColor: "#303030",
    borderRadius: 8,
    color: COLORS.grayWhite,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    fontSize: 16,
    width: "90%",
    alignSelf: "center",
    paddingRight: 30,
  },
  inputAndroid: {
    backgroundColor: "#303030",
    borderRadius: 8,
    color: COLORS.grayWhite,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    fontSize: 16,
    width: "90%",
    alignSelf: "center",
    paddingRight: 30,
  },
});

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
    marginBottom: 10,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: COLORS.grayWhite,
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',  
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
    marginTop: 20,
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

  datePicker: {
    backgroundColor: "#303030",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    width: "90%",
    alignSelf: "center",
  },
  datePickerText: {
    color: COLORS.grayWhite,
    fontSize: 16,
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
  editText: {
    fontSize: 15,
    color: COLORS.main,
    fontFamily: "Nunito-Medium",
  },
});

export default Options;
