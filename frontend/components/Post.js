import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../db/firebase";
import { COLORS } from "../constants/colors";
import tinycolor from "tinycolor2";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";

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
    const visibilityTimestamp = getVisibilityTimestamp();

    const intervalId = setInterval(() => {
      const currentTime = Date.now();

      if (currentTime >= visibilityTimestamp && currentTime < getEndTime()) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }, 1000); // checks every second

    // Check if the current time is before the visibility timestamp
    if (Date.now() < visibilityTimestamp) {
      setIsVisible(false); // Show the placeholder if the current time is before visibility
    }

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

  const isPostTime = (currentTime, visibilityTime, endTime) => {
    return currentTime >= visibilityTime && currentTime <= endTime;
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

  // Updated getVisibilityTimestamp function
  const getVisibilityTimestamp = () => {
    const currentDate = new Date();
    currentDate.setHours(13);
    currentDate.setMinutes(13);
    return currentDate.getTime();
  };

  // Updated getEndTime function
  const getEndTime = () => {
    const currentTime = new Date();
    currentTime.setHours(23);
    currentTime.setMinutes(16);
    currentTime.setSeconds(0);
    return currentTime.getTime();
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

            <View style={[styles.headerText, styles.headerTextContainer]}>
              <View style={styles.roleContainer}>
                <TouchableOpacity onPress={navigateToProfile}>
                  <Text style={styles.userRole}>{role}</Text>
                </TouchableOpacity>
                {isCurrentUserPost && (
                  <View style={styles.currentUserBox}>
                    <Text style={styles.currentUserLabel}>Your flashback</Text>
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
        <View style={styles.imageContainer}>
          <Image style={styles.postImage} source={{ uri: postImageURL }} />
          {!isPostTime() && (
            <BlurView intensity={70} style={styles.absolute}>
              <Text style={styles.placeholderText}>flashback made!</Text>
            </BlurView>
          )}
        </View>
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
    fontFamily: "Nunito-Bold",
    fontSize: 12,
    color: COLORS.main,
    alignItems: "flex-end",
  },
  currentUserBox: {
    marginLeft: 10,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTextContainer: {
    flex: 1,
    marginLeft: 5,
  },

  placeholderImage: {
    width: "100%",
    height: 530,
    backgroundColor: COLORS.grayLight,
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 40,
    color: COLORS.background,
    fontFamily: "Nunito-Black",
  },
  imageContainer: {
    position: "relative",
  },

  absolute: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Post;
