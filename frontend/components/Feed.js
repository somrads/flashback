import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { firebase } from "../db/firebase";
import { COLORS } from "../constants/colors";
import Add from "../assets/icons/addIcon.svg";

const Feed = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  const navigateToProfile = () => {
    navigation.navigate("Profile");
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>flashback</Text>
        <TouchableOpacity style={styles.iconButton}>
          <Add />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={navigateToProfile}
          style={styles.profilePic}
        />
      </View>

      
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 90,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#DCDCDC",
    fontFamily: "Ubuntu-Regular",
  },
  iconButton: {
    marginRight: -100,
  },

  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    fontSize: 18,
    color: "#fff",
  },
});

export default Feed;
