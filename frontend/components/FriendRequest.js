import React, { useEffect, useState } from "react";
import { View, Text } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";

const FriendRequest = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  useEffect(() => {
    if (currentUser) {
      const db = getDatabase();
      const friendRequestsRef = ref(
        db,
        `users/${currentUser.uid}/friendRequests`
      );

      onValue(friendRequestsRef, (snapshot) => {
        const data = snapshot.val();
        const requests = [];

        for (const key in data) {
          if (data[key] === true) {
            requests.push(key);
          }
        }

        setFriendRequests(requests);
      });
    }
  }, [currentUser]);

  return (
    <View>
      <Text>Friend Requests:</Text>
      {friendRequests.map((request) => (
        <Text key={request}>{request}</Text>
      ))}
    </View>
  );
};

export default FriendRequest;
