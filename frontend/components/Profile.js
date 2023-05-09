import React from "react";
import CustomHeader from "./CustomHeader";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <CustomHeader title="Profile" />
        <View style={styles.circle}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 209,
    height: 203,
    backgroundColor: COLORS.grayWhite,
    borderRadius: 100,
  },
});
