import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { auth, database } from "../db/firebase";
import { ref, onValue } from "firebase/database";
import { COLORS } from "../constants/colors";
import Add from "../assets/icons/addIcon.svg";
import tinycolor from "tinycolor2";

function darkenColor(color) {
  let colorObj = tinycolor(color);
  let { r, g, b } = colorObj.toRgb();

  r = Math.floor(r / 2);
  g = Math.floor(g / 2);
  b = Math.floor(b / 2);

  return tinycolor({ r, g, b }).toString();
}

const Feed = ({ navigation }) => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            const initials = userData.firstName[0] + userData.lastName[0];
            userData.initials = initials.toUpperCase();
            userData.color = userData.color;
            userData.darkerColor = darkenColor(userData.color);
            setUserData(userData);
          } else {
            console.log("User data not found");
          }
        },
        (error) => {
          console.log(error);
        }
      );
      return () => {
        unsubscribe();
      };
    }
  }, []);

  const navigateToProfile = () => {
    navigation.navigate("Profile", { updatedData: Date.now() });
  };

  const getImageUrl = (profilePicture) => {
    const timestamp = Date.now();
    return `${profilePicture}?t=${timestamp}`;
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
          style={[
            styles.profilePic,
            userData &&
              !userData.profilePicture && {
                backgroundColor: userData.color,
                justifyContent: "center",
                alignItems: "center",
              },
          ]}
        >
          {userData && userData.profilePicture ? (
            <Image
              style={styles.profilePic}
              source={{ uri: getImageUrl(userData.profilePicture) }}
            />
          ) : (
            <Text
              style={[
                styles.profileInitials,
                { color: userData ? userData.darkerColor : COLORS.black },
              ]}
            >
              {userData ? userData.initials : ""}
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
    marginRight: -130,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
  },
  profileInitials: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: "Nunito-Black",
  },
});

export default Feed;
