import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const Post = ({ postData }) => {
  const { userName, role, userProfilePicture, userPostPhoto, timestamp } =
    postData;

  console.log(timestamp);

  const convertTimestamp = (timestamp) => {
    if (!timestamp) {
      return "Timestamp not available";
    }
    let date = new Date(timestamp);
    let day = date.getDate();
    let month = date.getMonth() + 1; //Month starts from 0
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    let formattedTime = hours + ":" + minutes.substr(-2);
    let formattedDate = day + "/" + month + "/" + year;

    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <View style={styles.postContainer}>
      <View style={styles.postHeader}>
        <Image style={styles.profilePic} source={{ uri: userProfilePicture }} />
        <View style={styles.headerText}>
          <Text style={styles.userName}>{userName}</Text>
          <Text style={styles.userRole}>{role}</Text>
        </View>
        <Text style={styles.postTime}>{convertTimestamp(timestamp)}</Text>
      </View>
      <Image style={styles.postImage} source={{ uri: userPostPhoto }} />
    </View>
  );
};

const styles = StyleSheet.create({
  postContainer: {
    marginBottom: 20,
    marginTop: 20,
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
  userName: {
    fontSize: 16,
    fontWeight: "bold",
    color: COLORS.grayWhite,
  },
  userRole: {
    fontSize: 14,
    color: "#777",
  },
  postTime: {
    fontSize: 12,
    color: "#aaa",
  },
  postImage: {
    width: "100%",
    height: 371,
    borderRadius: 8,
  },
});

export default Post;
