import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { firebase } from "../db/firebase";

const Feed = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await firebase.auth().signOut();
      navigation.navigate("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Feed</Text>

      {/* Your Feed content here */}

      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Logout</Text>
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
