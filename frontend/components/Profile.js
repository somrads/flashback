import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { COLORS } from "../constants/colors";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.wrapper}>
        <View style={styles.circle}></View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 209,
    height: 203,
    backgroundColor: COLORS.grayWhite,
    borderRadius: 100,
  },
  title: {
    justifyContent: "center",
    alignItems: "center",
    color: COLORS.grayWhite,
  },

  titleWrapper: {
    marginTop: 100,
    marginBottom: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
