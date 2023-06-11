import React, { useState, useEffect } from "react";
import { TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { COLORS } from "../constants/colors";

const CameraButton = ({ onCameraOpen, disabled }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [buttonActive, setButtonActive] = useState(false);

  const START_HOUR = 10;
  const START_MINUTE = 38;
  const END_HOUR = 23;
  const END_MINUTE = 22;

  const isWithinTimeRange = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    return (
      (currentHour > START_HOUR ||
        (currentHour === START_HOUR && currentMinute >= START_MINUTE)) &&
      (currentHour < END_HOUR ||
        (currentHour === END_HOUR && currentMinute <= END_MINUTE))
    );
  };

  const calculateTimeDifference = () => {
    const now = new Date();
    let difference;

    if (isWithinTimeRange()) {
      difference =
        (END_HOUR - now.getHours()) * 3600 +
        (END_MINUTE - now.getMinutes()) * 60 -
        now.getSeconds();
    } else {
      const nextStartTime = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + (now.getHours() < START_HOUR ? 0 : 1),
        START_HOUR,
        START_MINUTE
      );

      difference = Math.floor((nextStartTime - now) / 1000);
    }
    return difference;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const withinTimeRange = isWithinTimeRange();
      setButtonActive(withinTimeRange);

      const difference = calculateTimeDifference();

      if (difference <= 0) {
        setTimeLeft("00:00:00");
        setButtonActive(false);
      } else {
        const hours = Math.floor(difference / 3600);
        const minutes = Math.floor((difference % 3600) / 60);
        const seconds = difference % 60;
        setTimeLeft(
          `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
        );
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handlePress = () => {
    if (!buttonActive || disabled) {
      Alert.alert("You can take a picture when it's time for a flashback!");
    } else {
      onCameraOpen();
    }
  };

  return (
    <>
      <TouchableOpacity
        style={!buttonActive || disabled ? styles.disabledCameraButton : styles.openCameraButton}
        onPress={handlePress}
        disabled={!buttonActive || disabled}
      >
        <Text style={styles.buttonText}>
          {buttonActive && !disabled ? "Open Camera" : "Camera Disabled"}
        </Text>
      </TouchableOpacity>
      <Text style={styles.timerText}>
        {buttonActive && !disabled ? timeLeft : "Until the next flashback!"}
      </Text>
    </>
  );
};

const styles = StyleSheet.create({
  openCameraButton: {
    width: "91%",
    height: 50,
    backgroundColor: COLORS.main,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
  },
  disabledCameraButton: {
    width: "91%",
    height: 50,
    backgroundColor: "#0B4039",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Nunito-Black",
    color: COLORS.background,
  },
  timerText: {
    fontSize: 16,
    color: COLORS.placeHolder,
    fontFamily: "Nunito-Regular",
    textAlign: "center",
    marginTop: 10,
  },
});

export default CameraButton;
