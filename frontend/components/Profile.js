import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { COLORS } from "../constants/colors";
import BirthdayIcon from "../assets/icons/birthday.svg";
import RoleIcon from "../assets/icons/role.svg";
import { auth, database } from "../db/firebase";
import { ref, onValue } from "firebase/database";
import tinycolor from "tinycolor2";

function darkenColor(color) {
  let colorObj = tinycolor(color);
  let { r, g, b } = colorObj.toRgb();

  r = Math.floor(r / 2);
  g = Math.floor(g / 2);
  b = Math.floor(b / 2);

  return tinycolor({ r, g, b }).toString();
}

const fetchUserData = async (userId) => {
  const userRef = ref(database, `users/${userId}`);
  return new Promise((resolve) => {
    onValue(userRef, (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        const initials = userData.firstName[0] + userData.lastName[0];
        userData.initials = initials.toUpperCase();
        userData.color = userData.color;
        userData.darkerColor = darkenColor(userData.color);
        resolve(userData);
      } else {
        resolve(null);
      }
    });
  });
};

// Birthday count calculator
const daysUntilBirthday = (birthday) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  birthDate.setFullYear(today.getFullYear());

  if (birthDate < today) {
    birthDate.setFullYear(today.getFullYear() + 1);
  }

  const oneDay = 24 * 60 * 60 * 1000;
  const daysUntil = Math.round(Math.abs((today - birthDate) / oneDay));
  return daysUntil;
};

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      fetchUserData(currentUser.uid).then((data) => {
        setUserData(data);
      });
    }
  }, []);

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const { firstName, lastName, role, dob, description } = userData;

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigation.navigate("Login");
    } catch (error) {
      alert(error.message);
    }
  };

  const pfpStyles = userData.profileImage
    ? styles.pfp
    : [
        styles.pfp,
        {
          backgroundColor: userData.color,
          justifyContent: "center",
          alignItems: "center",
        },
      ];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      style={styles.color}
    >
      <View style={styles.wrapper}>
        <View style={pfpStyles}>
          {userData.profileImage ? (
            <Image style={styles.pfp} source={{ uri: userData.profileImage }} />
          ) : (
            <Text style={[styles.initials, { color: userData.darkerColor }]}>
              {userData.initials}
            </Text>
          )}
        </View>
        <Text style={styles.userName}>
          {firstName} {lastName}
        </Text>
        {/* Birthday and Role */}
        <View style={styles.bioSection}>
          <View style={styles.icons}>
            <View style={styles.statsSection}>
              <RoleIcon />
              <View style={styles.text}>
                <Text style={styles.statsTitle}>{role}</Text>
                <Text style={styles.statsPlaceHolder}>Role</Text>
              </View>
            </View>

            <View style={styles.statsSection}>
              <BirthdayIcon />
              <View style={styles.text}>
                <Text style={styles.statsTitle}>
                  In {daysUntilBirthday(dob)} days
                </Text>
                <Text style={styles.statsPlaceHolder}>{dob}</Text>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.greenLine} />

        {/* Description */}
        <View style={styles.description}>
          {description ? (
            <Text style={styles.descriptionText}>{description}</Text>
          ) : (
            <Text style={styles.placeholderText}>No bio yet...</Text>
          )}
        </View>
      </View>

      {/* Todays Posts */}
      <View style={styles.postsWrapper}>
        <Text style={styles.title}>Today Post</Text>
        <View style={styles.todaysPhotoCentered}>
          <View style={styles.todaysPhotoWrapper}>
            <Image
              style={styles.todaysPhotoWrapper}
              source={require("../assets/img/image1.png")}
            ></Image>
          </View>
        </View>
      </View>

      {/* Family Members */}
      <View style={styles.familyMembersSection}>
        <Text style={styles.familyMembersTitle}>Family Members</Text>
        <View style={styles.membersInfo}>
          <Text style={styles.membersCount}>1</Text>
          <Text style={styles.membersText}>Members</Text>
        </View>
      </View>
      <View style={styles.membersWrapper}>
        <View style={styles.members}>
          <Image
            style={styles.memberPfp}
            source={require("../assets/img/image1.png")}
          ></Image>
          <Text style={styles.memberName}>Julie Laquez</Text>
          <TouchableOpacity style={styles.removeButton} onPress={() => {}}>
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  color: {
    backgroundColor: COLORS.background,
  },

  loadingText: {
    color: "white",
    fontFamily: "Nunito-Bold",
    fontSize: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
  },
  wrapper: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  pfp: {
    width: 161,
    height: 156,
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
    marginBottom: 20,
    marginTop: 10,
  },
  descriptionText: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
    fontSize: 20,
  },

  placeholderText: {
    color: COLORS.placeHolder,
    fontFamily: "Nunito-Regular",
    fontSize: 15,
    marginTop: 10,
  },

  title: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Bold",
    fontSize: 25,
    marginTop: 50,
    marginLeft: 50,
    alignSelf: "flex-start",
    marginBottom: 20,
  },
  postsWrapper: {
    marginTop: 10,
  },
  todaysPhotoCentered: {
    alignItems: "center",
  },
  todaysPhotoWrapper: {
    width: 346,
    height: 318,
    borderRadius: 5,
  },
  familyMembersSection: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingHorizontal: 20,
    marginTop: 50,
    marginBottom: 20,
  },
  familyMembersTitle: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Bold",
    fontSize: 25,
  },
  membersCount: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
    fontSize: 20,
    marginTop: 2,
  },
  membersInfo: {
    flexDirection: "row",
  },
  membersText: {
    color: COLORS.mainDarker,
    fontFamily: "Nunito-Bold",
    fontSize: 12,
    marginLeft: 6,
    marginTop: 10,
  },
  membersWrapper: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  members: {
    margin: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  memberPfp: {
    width: 59,
    height: 57,
    borderRadius: 70,
  },
  memberName: {
    marginLeft: 15,
    marginLeft: -15,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
    fontSize: 20,
  },
  removeButton: {
    marginLeft: 15,
    backgroundColor: COLORS.grayBlack,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
    fontSize: 14,
  },
  logoutButton: {
    backgroundColor: "#e74c3c",
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 100,
  },
  buttonText: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
    fontSize: 18,
    color: "#fff",
  },
  initials: {
    fontSize: 50,
    fontFamily: "Nunito-Black",
  },
});
