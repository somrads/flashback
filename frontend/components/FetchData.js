import { database } from "../db/firebase";
import { ref, onValue } from "firebase/database";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";

const FetchData = () => {
  const [usersData, setUsersData] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const usersRef = ref(database, "users");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const usersArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            ...value,
          }));
          setUsersData(usersArray);
        } else {
          setUsersData([]);
        }
      });
    } catch (error) {
      console.error(error);
      setUsersData([]);
    }
  };

  useEffect(() => {
    fetchAllUsers();
    console.log("loaded");
  }, []);

  return (
    <View style={styles.container}>
      <Text>Hellooooooo</Text>
      {usersData.map((user) => (
        <View key={user.id}>
          <Text>{user.name}</Text>
          <Text>{user.description}</Text>
        </View>
      ))}
    </View>
  );
};

export default FetchData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
