import React from "react";
import CustomHeader from "./CustomHeader";
import { StyleSheet, Text, View, Image } from "react-native";
import { COLORS } from "../constants/colors";
import BirthdayIcon from "../assets/icons/birthday.svg";
import RoleIcon from "../assets/icons/role.svg";

export default function Profile() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <CustomHeader title="Profile" />
        <View style={styles.circle} />
        <Text style={styles.userName}>Somrad Sharma</Text>

        {/* Birthday and Role */}
        <View style={styles.bioSection}>
          <View style={styles.icons}>
            <View style={styles.statsSection}>
              <RoleIcon />
              <View style={styles.text}>
                <Text style={styles.statsTitle}>Dad</Text>
                <Text style={styles.statsPlaceHolder}>Role</Text>
              </View>
            </View>

            <View style={styles.statsSection}>
              <BirthdayIcon />
              <View style={styles.text}>
                <Text style={styles.statsTitle}>In 80 days</Text>
                <Text style={styles.statsPlaceHolder}>1998-11-17</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.greenLine} />

        {/* Description */}
        <View style={styles.description}>
          <Text style={styles.descriptionText}>
            Im the alpha of my wolfpack
          </Text>
        </View>

        {/* Todays Posts */}
        <View></View>
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
  icons: {
    flexDirection: "row",
  },
  bioSection: {
    alignItems: "center",
  },

  bio: {
    margin: 20,
  },

  statsSection: {
    flexDirection: "row",
    marginRight: 30,
    marginLeft: 30,
    marginTop: 20,
  },
  statsTitle: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Black",
    fontSize: 15,
  },

  statsPlaceHolder: {
    color: COLORS.placeHolder,
    fontFamily: "Nunito-Light",
    fontSize: 15,
  },

  text: {
    marginLeft: 10,
  },

  greenLine: {
    marginTop: 30,
    width: "70%",
    height: 0.5,
    backgroundColor: COLORS.mainDarker,
  },

  description: {
    alignItems: "flex-start",
  },

  descriptionText: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    fontSize: 20,
    marginTop: 10,
  },
});
