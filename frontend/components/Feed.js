import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { auth, database } from "../db/firebase";
import { ref, onValue } from "firebase/database";
import { COLORS } from "../constants/colors";
import Add from "../assets/icons/addIcon.svg";
import tinycolor from "tinycolor2";
import { Camera } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import Icon from "react-native-vector-icons/Ionicons";

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
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [photo, setPhoto] = useState(null);
  const [isCameraVisible, setIsCameraVisible] = useState(false);

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

  const takePhoto = async () => {
    if (cameraRef) {
      let photo = await cameraRef.current.takePictureAsync();
      setPhoto(photo);
      setIsCameraVisible(false);
    }
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
          <Modal visible={isCameraVisible} transparent={true}>
            <Camera style={styles.camera} type={type} ref={cameraRef}>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setIsCameraVisible(false)}
                >
                  <Icon name="close" size={30} color="#fff" />
                </TouchableOpacity>
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
                  <Icon name="camera-reverse-outline" size={30} color="#fff" />
                </TouchableOpacity>
                <View style={styles.captureButtonContainer}>
                  <TouchableOpacity
                    style={styles.takePhotoButton}
                    onPress={takePhoto}
                  >
                    <Icon name="camera-outline" size={30} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            </Camera>
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
      <TouchableOpacity
        style={styles.openCameraButton}
        onPress={() => setIsCameraVisible(true)}
      >
        <Text style={styles.buttonText}>Open Camera</Text>
      </TouchableOpacity>
      {photo && <Image source={{ uri: photo.uri }} style={styles.image} />}
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
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row-reverse",
    margin: 20,
    justifyContent: "space-between",
  },

  flipButton: {
    flex: 0.1,
    alignSelf: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    marginBottom: 20,
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
    alignItems: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 10,
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
});

export default Feed;
