import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { COLORS } from "../constants/colors";
import tinycolor from "tinycolor2";
import { acceptFriendRequest } from "../db/firebase";

const darkenColor = (color) => {
  let colorObj = tinycolor(color);
  let { r, g, b } = colorObj.toRgb();

  r = Math.floor(r / 2);
  g = Math.floor(g / 2);
  b = Math.floor(b / 2);

  return tinycolor({ r, g, b }).toString();
};

const FriendRequest = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [friendRequests, setFriendRequests] = useState([]);
  const [usersData, setUsersData] = useState({});

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

      const usersRef = ref(db, "users");
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        setUsersData(data);
      });
    }
  }, [currentUser]);

  const acceptFriendRequest = (friendId) => {
    // Implement the logic to accept the friend request
  };

  return (
    <View style={styles.container}>
      {friendRequests.map((friendId) => (
        <View key={friendId} style={styles.friendContainer}>
          {usersData[friendId] && usersData[friendId].profilePicture ? (
            <Image
              source={{ uri: usersData[friendId].profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <View
              style={[
                styles.initialsContainer,
                { backgroundColor: usersData[friendId]?.color },
              ]}
            >
              <Text
                style={[
                  styles.initialsText,
                  { color: darkenColor(usersData[friendId]?.color) },
                ]}
              >
                {usersData[friendId]?.firstName[0] +
                  usersData[friendId]?.lastName[0]}
              </Text>
            </View>
          )}
          <Text style={styles.userName}>
            {usersData[friendId]?.firstName} {usersData[friendId]?.lastName}
          </Text>
          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => acceptFriendRequest(friendId)}
          >
            <Text style={styles.acceptButtonText}>Accept</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
  },
  friendContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  initialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  initialsText: {
    color: COLORS.grayWhite,
    fontSize: 20,
    fontFamily: "Nunito-Black",
  },
  userName: {
    fontSize: 17,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
    marginLeft: 10,
  },
  acceptButton: {
    backgroundColor: COLORS.grayBlack,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginLeft: "auto",
  },
  acceptButtonText: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
    fontSize: 14,
  },
});

export default FriendRequest;
