import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../db/firebase";
import { COLORS } from "../constants/colors";
import tinycolor from "tinycolor2";
import { useNavigation } from "@react-navigation/native";

const Post = ({
  postData,
  userPhotoURL,
  initials,
  color,
  isCurrentUserPost,
}) => {
  const { userId, userName, role, userPostPhoto, timestamp } = postData;
  const [postImageURL, setPostImageURL] = useState(userPostPhoto);
  const [isVisible, setIsVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const visibilityTimestamp = getVisibilityTimestamp(); // Set the desired visibility timestamp

    const intervalId = setInterval(() => {
      const currentTime = new Date();
      const visibilityTime = new Date(visibilityTimestamp);

      if (currentTime >= visibilityTime && currentTime < getEndTime()) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 1000); // checks every second

    // cleanup function
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (userPostPhoto) {
      const storageRef = ref(storage, userPostPhoto);
      getDownloadURL(storageRef)
        .then((url) => {
          setPostImageURL(url);
        })
        .catch((error) => {
          console.error("Error retrieving post image URL:", error);
        });
    }
  }, [userPostPhoto]);

  const convertTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Timestamp not available";
    }

    const currentDate = new Date();
    const postDate = new Date(timestamp);
    const currentDateStr = currentDate.toISOString().slice(0, 10);
    const postDateStr = postDate.toISOString().slice(0, 10);

    if (postDateStr === currentDateStr) {
      // Post is from today
      let hours = postDate.getHours();
      let minutes = "0" + postDate.getMinutes();
      let formattedTime = hours + ":" + minutes.substr(-2);
      return "Today at " + formattedTime;
    } else if (postDateStr === getPreviousDate(currentDateStr)) {
      // Post is from yesterday
      let hours = postDate.getHours();
      let minutes = "0" + postDate.getMinutes();
      let formattedTime = hours + ":" + minutes.substr(-2);
      return "Yesterday at " + formattedTime;
    } else {
      // Post is from a different day
      let day = postDate.getDate();
      let month = postDate.getMonth() + 1;
      let year = postDate.getFullYear();
      let hours = postDate.getHours();
      let minutes = "0" + postDate.getMinutes();
      let formattedTime = hours + ":" + minutes.substr(-2);
      let formattedDate = day + "/" + month + "/" + year;
      return `${formattedDate} at ${formattedTime}`;
    }
  };

  // Helper function to get the previous date in YYYY-MM-DD format
  const getPreviousDate = (dateStr) => {
    const currentDate = new Date(dateStr);
    const previousDate = new Date(currentDate);
    previousDate.setDate(previousDate.getDate() - 1);
    return previousDate.toISOString().slice(0, 10);
  };

  const darkenColor = (color) => {
    let colorObj = tinycolor(color);
    let { r, g, b } = colorObj.toRgb();

    r = Math.floor(r / 2);
    g = Math.floor(g / 2);
    b = Math.floor(b / 2);

    return tinycolor({ r, g, b }).toString();
  };

  const initialsStyle = {
    color: darkenColor(color),
  };

  const navigateToProfile = () => {
    console.log("userId:", userId);
    console.log("userName:", userName);
    navigation.navigate("Profile", {
      user: { uid: userId, userName: userName },
    });
  };

  // Helper function to get the visibility timestamp (today at 16:13)
  const getVisibilityTimestamp = () => {
    const currentDate = new Date();
    currentDate.setHours(16);
    currentDate.setMinutes(13);
    return currentDate.toISOString();
  };

  // Helper function to get the end time for visibility (18:00)
  const getEndTime = () => {
    const currentTime = new Date();
    currentTime.setHours(16);
    currentTime.setMinutes(16);
    currentTime.setSeconds(0);
    return currentTime;
  };

  return (
    isVisible && (
      <View style={styles.postContainer}>
        <TouchableOpacity onPress={navigateToProfile}>
          <View style={styles.postHeader}>
            {!userPhotoURL ? (
              <View style={[styles.profilePic, { backgroundColor: color }]}>
                <Text style={[styles.initials, initialsStyle]}>{initials}</Text>
              </View>
            ) : (
              <Image style={styles.profilePic} source={{ uri: userPhotoURL }} />
            )}

            <View style={styles.headerText}>
              <View style={styles.roleContainer}>
                <TouchableOpacity onPress={navigateToProfile}>
                  <Text style={styles.userRole}>{role}</Text>
                </TouchableOpacity>
                {isCurrentUserPost && (
                  <View style={styles.currentUserBox}>
                    <Text style={styles.currentUserLabel}>Your Flashback</Text>
                  </View>
                )}
              </View>
              <TouchableOpacity onPress={navigateToProfile}>
                <Text style={styles.userName}>{userName}</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.postTime}>{convertTimestamp(timestamp)}</Text>
          </View>
        </TouchableOpacity>
        {postImageURL && <Image style={styles.postImage} source={{ uri: postImageURL }} />}
      </View>
    )
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    marginTop: 20,
    overflow: "hidden",
  },
  postHeader: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerText: {
    flexDirection: "column",
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  initials: {
    fontSize: 18,
    textAlign: "center",
    lineHeight: 40,
    fontFamily: "Nunito-Black",
  },
  userRole: {
    fontSize: 15,
    fontFamily: "Nunito-Black",
    color: COLORS.grayWhite,
  },
  userName: {
    marginRight: 190,
    fontSize: 12,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
  },
  postTime: {
    fontSize: 11,
    color: COLORS.grayBlack,
    fontFamily: "Nunito-Regular",
    marginTop: 20,
    marginLeft: -10,
  },
  postImage: {
    width: 530,
    height: 530,
    marginTop: 5,
    width: "100%",
    borderRadius: 8,
  },
  currentUserLabel: {
    fontFamily: "Nunito-Regular",
    fontSize: 12,
    color: COLORS.mainDarker,
  },
  currentUserBox: {
    marginLeft: 10,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});

export default Post;
