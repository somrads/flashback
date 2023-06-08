import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import { auth, database } from "../db/firebase";
import { ref, onValue, set, get } from "firebase/database";
import {
  getStorage,
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { Dimensions } from "react-native";
import { COLORS } from "../constants/colors";
import Add from "../assets/icons/addIcon.svg";
import tinycolor from "tinycolor2";
import { Camera } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import Icon from "react-native-vector-icons/Ionicons";
import Post from "./Post";

import CameraButton from "./CameraButton";

function darkenColor(color) {
  let colorObj = tinycolor(color);
  let { r, g, b } = colorObj.toRgb();

  r = Math.floor(r / 2);
  g = Math.floor(g / 2);
  b = Math.floor(b / 2);

  return tinycolor({ r, g, b }).toString();
}

const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
const squareWidth = 530;
const squareHeight = 530;

const overlayVerticalHeight = (windowHeight - squareHeight) / 2;
const overlayHorizontalWidth = (windowWidth - squareWidth) / 2;

const Feed = ({ navigation }) => {
  const [userData, setUserData] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  let cameraRef = useRef();

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userRef = ref(database, `users/${currentUser.uid}`);
      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          const userData = snapshot.val();
          if (userData) {
            const initials = userData.initials;
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

  useEffect(() => {
    fetchPostsFromDB();
  }, []);

  const navigateToProfile = () => {
    navigation.navigate("Profile", { updatedData: Date.now() });
  };

  const navigateToAddScreen = () => {
    navigation.navigate("Add");
  };

  const takePhoto = async () => {
    if (cameraRef) {
      setIsLoading(true);
      let photo = await cameraRef.current.takePictureAsync();

      // Resize the photo
      const manipResult = await ImageManipulator.manipulateAsync(
        photo.uri,
        [],
        { compress: 0.5, format: ImageManipulator.SaveFormat.JPEG }
      );

      setPhoto(manipResult);
      setIsCameraVisible(false);
      setTimeout(() => {
        setShowPhotoModal(true);
        setIsLoading(false);
      }, 300);
    }
  };

  const postPhoto = async () => {
    if (photo) {
      setIsLoading(true);

      try {
        const storage = getStorage();
        const timestamp = Date.now();

        // Use a specific filename for the photo
        const filename = `current_post_photo.png`;

        // Create a reference to the storage location for the photo
        const storagePath = `users/${auth.currentUser.uid}/${filename}`;
        const storageReference = storageRef(storage, storagePath);

        // Convert the photo to a blob
        const response = await fetch(photo.uri);
        const blob = await response.blob();

        // Upload the photo to Firebase Storage
        await uploadBytes(storageReference, blob);

        // Get the download URL of the uploaded photo
        const downloadURL = await getDownloadURL(storageReference);

        // Update the user's data in the real-time database with the merged data
        const userRef = ref(database, `users/${auth.currentUser.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        // Merge the new photo URL and the timestamp with the existing data
        const updatedData = {
          ...userData,
          postPhotoURL: downloadURL,
          timestamp: timestamp,
        };

        await set(userRef, updatedData);
        Alert.alert("Success", "Flashback posted!");

        setIsLoading(false);
        setShowPhotoModal(false);
        setPhoto(null);
      } catch (error) {
        console.error("Error uploading photo:", error);
        setIsLoading(false);
      }
    }
  };

  const discardPhoto = () => {
    setIsLoading(false);
    setShowPhotoModal(false);
    setPhoto(null);
    setIsCameraVisible(true);
  };

  const fetchPostsFromDB = async () => {
    const usersRef = ref(database, `users`);

    // Fetch all users
    const usersSnapshot = await get(usersRef);

    if (usersSnapshot.exists()) {
      const usersData = usersSnapshot.val();
      let postsArray = [];

      // Go through each user and construct a post
      for (const userId in usersData) {
        let userData = usersData[userId];

        if (userData.postPhotoURL) {
          let post = {
            userName: userData.firstName + " " + userData.lastName,
            userPostPhoto: userData.postPhotoURL,
            userProfilePicture: userData.profilePicture,
            role: userData.role,
            timestamp: userData.timestamp,
            key: "currentPost",
          };

          postsArray.push(post);
        }
      }

      setPosts(postsArray);
    } else {
      console.log("No users data available");
    }
  };

  const renderItem = ({ item }) => (
    <Post postData={item} userPhotoURL={userData.profilePicture} />
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.logo}>flashback</Text>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={navigateToAddScreen}
          >
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
            <Modal visible={isCameraVisible} transparent={true}>
              <View style={styles.cameraContainer}>
                <Camera style={styles.camera} type={type} ref={cameraRef}>
                  <Text style={styles.logoOverlay}>flashback</Text>

                  <View
                    style={[
                      styles.blackOverlay,
                      { height: overlayVerticalHeight, width: windowWidth },
                    ]}
                  />
                  <View
                    style={[
                      styles.blackOverlay,
                      {
                        width: overlayHorizontalWidth,
                        height: squareHeight,
                        top: overlayVerticalHeight,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.blackOverlay,
                      {
                        width: overlayHorizontalWidth,
                        height: squareHeight,
                        top: overlayVerticalHeight,
                        right: 0,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.blackOverlay,
                      {
                        height: overlayVerticalHeight,
                        width: windowWidth,
                        bottom: 0,
                      },
                    ]}
                  />

                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setIsCameraVisible(false)}
                    >
                      <Icon name="close" size={30} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.captureButtonContainer}>
                      <TouchableOpacity
                        style={styles.takePhotoButton}
                        onPress={takePhoto}
                      >
                        <Icon name="camera-outline" size={30} color="#fff" />
                      </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                      style={styles.flipButton}
                      onPress={() => {
                        setType(
                          type === Camera.Constants.Type.back
                            ? Camera.Constants.Type.front
                            : Camera.Constants.Type.back
                        );
                      }}
                    >
                      <Icon
                        name="camera-reverse-outline"
                        size={30}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </Camera>
              </View>
            </Modal>

            {userData && userData.profilePicture ? (
              <Image
                style={styles.profilePic}
                source={{ uri: userData.profilePicture }}
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
        <CameraButton onCameraOpen={() => setIsCameraVisible(true)} />

        {photo && (
          <Modal visible={showPhotoModal} transparent={true}>
            <View style={styles.modalPhotoContainer}>
              <Image
                source={{ uri: photo.uri }}
                style={[styles.modalImage, { borderRadius: 8 }]}
              />
            </View>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButtonDiscard}
                onPress={discardPhoto}
              >
                <Text style={styles.modalButtonTextDiscard}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={postPhoto}>
                <Text style={styles.modalButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.logoOverlay}>flashback</Text>

            <View
              style={[
                styles.blackOverlay,
                { height: overlayVerticalHeight, width: windowWidth },
              ]}
            />
            <View
              style={[
                styles.blackOverlay,
                {
                  width: overlayHorizontalWidth,
                  height: squareHeight,
                  top: overlayVerticalHeight,
                },
              ]}
            />
            <View
              style={[
                styles.blackOverlay,
                {
                  width: overlayHorizontalWidth,
                  height: squareHeight,
                  top: overlayVerticalHeight,
                  right: 0,
                },
              ]}
            />
            <View
              style={[
                styles.blackOverlay,
                {
                  height: overlayVerticalHeight,
                  width: windowWidth,
                  bottom: 0,
                },
              ]}
            />
          </Modal>
        )}

        <View>
          {posts.map((item) => (
            <Post
              key={item.key}
              postData={item}
              userPhotoURL={userData.profilePicture}
            />
          ))}
        </View>

        {isLoading && (
          <View style={styles.loadingScreen}>
            <ActivityIndicator size="large" color={COLORS.main} />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
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
    marginLeft: 20,
  },
  iconButton: {
    marginRight: -150,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 20,
  },
  profileInitials: {
    fontSize: 18,
    color: COLORS.black,
    fontFamily: "Nunito-Black",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
    justifyContent: "space-between",
    zIndex: 3,
  },

  flipButton: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    bottom: 60,
    justifyContent: "center",
  },

  takePhotoButton: {
    alignSelf: "center",
    backgroundColor: COLORS.main,
    padding: 20,
    borderRadius: 90,
  },
  captureButtonContainer: {
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
    bottom: 50,
    alignItems: "center",
  },
  closeButton: {
    flex: 0.1,
    alignSelf: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
    marginTop: 50,
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: 20,
  },
  openCameraButton: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 20,
  },
  modalPhotoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },
  modalImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  modalButtonContainer: {
    flexDirection: "row",
    zIndex: 5,
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    bottom: 80,
  },
  modalButton: {
    backgroundColor: COLORS.main,
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    borderColor: COLORS.main,
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: "Nunito-Medium",
  },

  modalButtonDiscard: {
    backgroundColor: "transparent",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 8,
    borderColor: COLORS.main,
    borderWidth: 1,
    marginRight: 25,
  },
  modalButtonTextDiscard: {
    color: COLORS.grayWhite,
    fontSize: 18,
    fontFamily: "Nunito-Medium",
  },

  loadingScreen: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  cameraContainer: {
    flex: 1,
    position: "relative",
  },

  blackOverlay: {
    position: "absolute",
    backgroundColor: "black",
    zIndex: 2,
  },
  logoOverlay: {
    position: "absolute",
    color: COLORS.grayWhite,
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "Ubuntu-Regular",
    top: 80,
    alignSelf: "center",
    zIndex: 3,
  },
});

export default Feed;
