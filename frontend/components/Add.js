import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { COLORS } from "../constants/colors";
import tinycolor from "tinycolor2";
import { AntDesign } from "@expo/vector-icons";

const darkenColor = (color) => {
  let colorObj = tinycolor(color);
  let { r, g, b } = colorObj.toRgb();

  r = Math.floor(r / 2);
  g = Math.floor(g / 2);
  b = Math.floor(b / 2);

  return tinycolor({ r, g, b }).toString();
};

const Add = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    // Fetch users from the Realtime Database
    const fetchUsers = () => {
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const userList = [];

        for (const key in data) {
          const {
            firstName,
            lastName,
            profilePicture,
            email,
            color,
            initials,
          } = data[key];
          const fullName = `${firstName} ${lastName}`;
          userList.push({
            key,
            fullName,
            profilePicture,
            email,
            color,
            initials,
          });
        }

        setUsers(userList);
      });
    };

    fetchUsers();

    // Check if a user is logged in
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.fullName &&
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <AntDesign
          name="search1"
          size={24}
          color={COLORS.grayWhite}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder="Search for family members"
          placeholderTextColor="lightgray"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Add</Text>
        <Text style={styles.title}>Requests</Text>
      </View>

      {filteredUsers.map((user) => (
        <View key={user.key} style={styles.userContainer}>
          {user.profilePicture ? (
            <Image
              source={{ uri: user.profilePicture }}
              style={styles.profilePicture}
            />
          ) : (
            <View
              style={[
                styles.initialsContainer,
                { backgroundColor: user.color },
              ]}
            >
              <Text
                style={[
                  styles.initialsText,
                  { color: darkenColor(user.color) },
                ]}
              >
                {user.initials || ""}
              </Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.fullName}</Text>
            {currentUser && (
              <TouchableOpacity style={styles.addButton}>
                <Text style={styles.addButtonLabel}>Add</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.grayBlack,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 5,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular",
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.grayWhite,
    marginRight: 10,
    fontFamily: "Nunito-Regular",
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 15,
  },
  profilePicture: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 10,
  },
  initialsContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  initialsText: {
    color: COLORS.grayWhite,
    fontSize: 20,
    fontFamily: "Nunito-Black",
  },
  userName: {
    fontSize: 17,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
    marginLeft: 10,
  },
  userInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: COLORS.grayBlack,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 20,
    marginLeft: "auto",
  },
  addButtonLabel: {
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Medium",
    fontSize: 14,
  },
});

export default Add;
