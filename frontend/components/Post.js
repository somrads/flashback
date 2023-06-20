import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { getDownloadURL, ref } from "firebase/storage";
import { ref as dbRef, set, get, push, child, update } from "firebase/database";
import { storage, auth, database } from "../db/firebase";
import { COLORS } from "../constants/colors";
import tinycolor from "tinycolor2";
import { useNavigation } from "@react-navigation/native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";

const Post = ({
  postData,
  userPhotoURL,
  initials,
  color,
  isCurrentUserPost,
  postId,
}) => {
  const { userId, userName, role, userPostPhoto, timestamp } = postData;
  const [postImageURL, setPostImageURL] = useState(userPostPhoto);
  const [isBlurred, setIsBlurred] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(postData.likeCount || 0);
  const navigation = useNavigation();

  useEffect(() => {
    const visibilityTimestamp = getVisibilityTimestamp();
    const endTime = getEndTime();

    const intervalId = setInterval(() => {
      const currentTime = Date.now();

      if (currentTime < visibilityTimestamp) {
        setIsBlurred(true);
        setIsVisible(true);
      } else if (currentTime >= visibilityTimestamp && currentTime <= endTime) {
        setIsBlurred(false);
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

  const handleLike = () => {
    const currentUser = auth.currentUser;
    get(child(dbRef(database), `users/${currentUser.uid}/likedPosts`))
      .then((snapshot) => {
        let likedPosts = snapshot.exists() ? snapshot.val() : [];
        if (isLiked) {
          // Unlike the post
          likedPosts = likedPosts.filter((id) => id !== postId);
          setLikeCount((prevLikeCount) => prevLikeCount - 1);
        } else {
          // Like the post
          likedPosts.push(postId);
          setLikeCount((prevLikeCount) => prevLikeCount + 1);
        }
        setIsLiked(!isLiked);

        // Update likedPosts in Firebase
        set(dbRef(database, `users/${currentUser.uid}/likedPosts`), likedPosts);

        // Update likeCount in Firebase
        get(child(dbRef(database), `posts/${postId}`))
          .then((postSnapshot) => {
            if (postSnapshot.exists()) {
              const post = postSnapshot.val();
              update(dbRef(database), {
                [`posts/${postId}/likeCount`]: post.likeCount ? likeCount : 0,
              });
            }
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
  };

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

  // Updated getVisibilityTimestamp function
  const getVisibilityTimestamp = () => {
    const currentDate = new Date();
    currentDate.setHours(15);
    currentDate.setMinutes(10);
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

  if (!isVisible) return null;

  return (
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
        {isBlurred && (
          <BlurView intensity={70} style={styles.absolute}>
            <Text style={styles.placeholderText}>flashback made!</Text>
          </BlurView>
        )}
        {!isBlurred && (
          <TouchableOpacity style={styles.likeButton} onPress={handleLike}>
            <Ionicons
              name={isLiked ? "heart" : "heart-outline"}
              size={24}
              color={isLiked ? "red" : COLORS.grayWhite}
            />
            <Text style={styles.likeText}>{likeCount}</Text>
          </TouchableOpacity>
        )}
      </View>
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
    alignItems: "center",
    position: "relative"
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

    right: 0 
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
    position: "absolute", 
    right: -75, 
    top: 0

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
  likeButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 8,
    padding: 8,
  },
  likeText: {
    color: COLORS.grayWhite,
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "Nunito-Bold",
  },
});

export default Post;
