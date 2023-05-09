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
        <Text style={styles.userName}>Somrad Sharma</Text>
        <View style={styles.bioWrapper}>
          <Text style={styles.role}>DAD</Text>
          <View style={styles.bio}>
            <Text style={styles.bioText}>
              Im the Dad of the fam and the alpha
            </Text>
          </View>
        </View>
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
    marginTop: 20,
    width: 209,
    height: 203,
    backgroundColor: COLORS.grayWhite,
    borderRadius: 100,
  },
  userName: {
    fontFamily: "Nunito-SemiBold",
    color: COLORS.grayWhite,
    fontSize: 30,
    margin: 20,
  },
  bioWrapper: {},
  bio: {
    margin: 20,
  },
  role:{
    fontFamily: "Nunito-Black",
    color: COLORS.grayWhite,
    fontSize: 30
  },
});
