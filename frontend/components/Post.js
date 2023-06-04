import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../db/firebase";

const Post = ({ postData, userPhotoURL }) => {
  const { userName, role, userPostPhoto, timestamp } = postData;
  const [postImageURL, setPostImageURL] = useState(userPostPhoto);

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

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image style={styles.profilePic} source={{ uri: userPhotoURL }} />
        <View style={styles.headerText}>
          <Text style={styles.userRole}>{role}</Text>
          <Text style={styles.userName}>{userName}</Text>
        </View>
        <Text style={styles.postTime}>{convertTimestamp(timestamp)}</Text>
      </View>
      {postImageURL && (
        <Image style={styles.postImage} source={{ uri: postImageURL }} />
      )}
    </View>
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
  userRole: {
    fontSize: 15,
    fontFamily: "Nunito-Black",
    color: COLORS.grayWhite,
  },
  userName: {
    marginRight: 170,
    fontSize: 12,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
  },
  postTime: {
    fontSize: 11,
    color: COLORS.grayBlack,
    fontFamily: "Nunito-Regular",
    marginTop: 20,
  },
  postImage: {
    width: 530,
    height: 530,
    marginTop: 5,
    width: "100%",
    borderRadius: 8,
  },
});

export default Post;
