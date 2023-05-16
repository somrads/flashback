import React, { useState, useEffect } from "react";
import CustomHeader from "./CustomHeader";
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
import Arrow from "../assets/icons/arrow.svg";
import EditIcon from "../assets/icons/edit.svg";
import { database } from "../db/firebase";
import { ref, onValue } from "firebase/database";

const fetchAllUsers = async () => {
  const usersRef = ref(database, "users");
  return new Promise((resolve) => {
    onValue(usersRef, (snapshot) => {
       const data = snapshot.val();
      if (data) {
        const usersArray = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        resolve(usersArray);
      } else {
        resolve([]);
      }
    });
  });
};

//Birthday count calculator
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

export default function Profile() {
  const [usersData, setUsersData] = useState([]);

  useEffect(() => {
    fetchAllUsers().then((users) => {
      setUsersData(users);
    });
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {usersData.map((user) => (
        <View style={styles.wrapper} key={user.id}>
          <TouchableOpacity style={styles.arrowButton} onPress={() => {}}>
            <Arrow width={30} height={20} fill={COLORS.grayWhite} />
          </TouchableOpacity>
          <CustomHeader title="Profile" />
          <TouchableOpacity style={styles.editButton} onPress={() => {}}>
            <EditIcon width={30} height={20} />
          </TouchableOpacity>
          <Image
            style={styles.pfp}
            source={require("../assets/img/image1.png")}
          />
          <Text style={styles.userName}>{user.name}</Text>
          {/* Birthday and Role */}
          <View style={styles.bioSection}>
            <View style={styles.icons}>
              <View style={styles.statsSection}>
                <RoleIcon />
                <View style={styles.text}>
                  <Text style={styles.statsTitle}>{user.role}</Text>
                  <Text style={styles.statsPlaceHolder}>Role</Text>
                </View>
              </View>

              <View style={styles.statsSection}>
                <BirthdayIcon />
                <View style={styles.text}>
                  <Text style={styles.statsTitle}>
                    In {daysUntilBirthday(user.birthday)} days
                  </Text>
                  <Text style={styles.statsPlaceHolder}>{user.birthday}</Text>
                </View>
              </View>
            </View>
          </View>
          <View style={styles.greenLine} />

          {/* Description */}
          <View style={styles.description}>
            <Text style={styles.descriptionText}>{user.description}</Text>
          </View>
        </View>
      ))}

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
      <TouchableOpacity style={styles.logoutButton} onPress={() => {}}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
  },
  wrapper: {
    marginTop: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  pfp: {
    width: 209,
    height: 203,
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

  editButton: {
    position: "absolute",
    top: 35,
    right: 25,
  },
  logoutButton: {
    backgroundColor: COLORS.mainDarker,
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
    marginBottom: 20,
    marginTop: 15,
  },
  buttonText: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Bold",
    fontSize: 15,
  },

  arrowButton: {
    position: "absolute",
    top: 35,
    left: 25,
    transform: [{ rotate: "-180deg" }],
  },
});
