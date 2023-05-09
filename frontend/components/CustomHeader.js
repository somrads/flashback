import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

const CustomHeader = ({ title }) => (
  <View style={styles.header}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    height: 120,
    justifyContent: "center",
    alignItems: "center",

  },
  title: {
    fontFamily:"Nunito-Bold",
    color: COLORS.grayWhite,
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default CustomHeader;
