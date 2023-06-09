import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { COLORS } from "../constants/colors";
import tinycolor from "tinycolor2";
import { FontAwesome5 } from "@expo/vector-icons";

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

  const acceptFriendRequest = async (friendId) => {
    const db = getDatabase();
    const currentUserRef = ref(db, `users/${currentUser.uid}`);
    const friendRef = ref(db, `users/${friendId}`);
  
    try {
      // Update the friendRequests and friends nodes of the current user
      await update(currentUserRef, {
        [`friendRequests/${friendId}`]: null,
        [`friends/${friendId}`]: true,
      });
  
      // Update the friends node of the friend
      await update(friendRef, {
        [`friends/${currentUser.uid}`]: true,
      });
  
      Alert.alert("Friend request accepted");
    } catch (error) {
      Alert.alert("Error accepting friend request");
    }
  };
  

  const declineFriendRequest = async (friendId) => {
    const db = getDatabase();
    const currentUserRef = ref(db, `users/${currentUser.uid}`);
  
    try {
      // Update the friendRequests node of the current user
      await update(currentUserRef, {
        [`friendRequests/${friendId}`]: null,
      });
  
      Alert.alert("Friend request declined");
    } catch (error) {
      Alert.alert("Error declining friend request");
    }
  };
  

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Amount ({friendRequests.length})</Text>
      </View>
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
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => acceptFriendRequest(friendId)}
            >
              <FontAwesome5 name="check" size={22} color={COLORS.main} solid />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => declineFriendRequest(friendId)}
            >
              <FontAwesome5 name="times" size={22} color={COLORS.red} solid />
            </TouchableOpacity>
          </View>
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
  titleContainer: {
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Bold",
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
  buttonContainer: {
    flexDirection: "row",
    marginLeft: "auto",
  },
  iconButton: {
    marginHorizontal: 5,
    marginLeft: 30,
  },
});

export default FriendRequest;
