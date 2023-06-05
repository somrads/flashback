import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const CameraButton = ({ onCameraOpen }) => {
  const isWithinTimeRange = () => {
    const startTime = 11; 
    const endTime = 14 
    const currentHour = new Date().getHours();
    return currentHour >= startTime && currentHour <= endTime;
  };

  if (!isWithinTimeRange()) {
    return null; 
  }

  return (
    <TouchableOpacity
      style={styles.openCameraButton}
      onPress={onCameraOpen}
      disabled={!isWithinTimeRange()}
    >
      <Text style={styles.buttonText}>Open Camera</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  openCameraButton: {
    width: "90%",
    height: 50,
    backgroundColor: "#DCDCDC",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
    fontFamily: "Nunito-Black",
  },
});

export default CameraButton;
