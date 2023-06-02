import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const Post = ({ postData, userPhotoURL }) => {
  const { userName, role, userPostPhoto, timestamp } =
    postData;

    const convertTimestamp = (timestamp) => {
      if (!timestamp) {
        return "Timestamp not available";
      }
    
      const currentDate = new Date();
      const postDate = new Date(timestamp);
      const dayDifference = Math.floor(
        (currentDate - postDate) / (1000 * 60 * 60 * 24)
      );
    
      let day = postDate.getDate();
      let month = postDate.getMonth() + 1;
      let year = postDate.getFullYear();
      let hours = postDate.getHours();
      let minutes = "0" + postDate.getMinutes();
      let formattedTime = hours + ":" + minutes.substr(-2);
      let formattedDate = day + "/" + month + "/" + year;
    
      if (dayDifference === 0) {
        return "Today at " + formattedTime;
      } else if (dayDifference === 1) {
        return "Yesterday at " + formattedTime;
      } else {
        return `${formattedDate} at ${formattedTime}`;
      }
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
  userRole: {
    fontSize: 15,
    fontFamily: "Nunito-Black",
    color: COLORS.grayWhite,
  },
  userName: {
    marginRight: 145,
    fontSize: 12,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
  },
  postTime: {
    fontSize: 11.5,
    color: COLORS.grayBlack,
    fontFamily: "Nunito-Regular",
    marginTop: 20,
  },
  postImage: {
    width: "100%",
    height: 371,
    borderRadius: 8,
    marginTop: 5,
  },
});

export default Post;
