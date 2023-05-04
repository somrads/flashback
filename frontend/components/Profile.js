import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const CustomHeader = ({ title, navigation }) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" type="material" />
      </TouchableOpacity>
      <Text style={{ fontSize: 20, marginLeft: 10 }}>{title}</Text>
    </View>
  );
};

const Profile = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <CustomHeader title="Profile" navigation={navigation} />
      <View style={styles.wrapper}>
        <View style={styles.circle}></View>
      </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  wrapper: {
    marginTop: 140,
    justifyContent: "center",
    alignItems: "center",
  },
  circle: {
    width: 209,
    height: 203,
    backgroundColor: "#DCDCDC",
    borderRadius: 100,
  },
});
