import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { COLORS } from "../constants/colors";
import tinycolor from "tinycolor2";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

// Function to darken colors
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
  const navigation = useNavigation();

  // Function to handle add friend requests
  const handleAdd = (user) => {
    // Don't allow to send friend request if already requested or already friends
    if (user.hasSentFriendRequest || user.isFriend || !currentUser) return;

    const db = getDatabase();
    const currentUserID = currentUser.uid;

    // Reference to recipient's friend requests in DB
    const recipientFriendRequestsRef = ref(
      db,
      `users/${user.key}/friendRequests/${currentUserID}`
    );

    // Send a friend request
    set(recipientFriendRequestsRef, true);

    // Update local state immediately after sending a friend request
    user.hasSentFriendRequest = true;
  };

  // Fetch users from the DB
  useEffect(() => {
    const db = getDatabase();
    const usersRef = ref(db, "users");

    const fetchUsers = () => {
      onValue(usersRef, (snapshot) => {
        const data = snapshot.val();
        const userList = [];

        for (const key in data) {
          // Exclude the current user from the list
          if (currentUser && key === currentUser.uid) continue;

          const {
            firstName,
            lastName,
            profilePicture,
            email,
            color,
            initials,
            friendRequests,
            friends,
          } = data[key];
          const fullName = `${firstName} ${lastName}`;

          // Check if current user has sent friend request or is already friends
          const hasSentFriendRequest =
            currentUser && friendRequests && friendRequests[currentUser.uid];
          const isFriend = currentUser && friends && friends[currentUser.uid];

          userList.push({
            key,
            fullName,
            profilePicture,
            email,
            color,
            initials,
            hasSentFriendRequest,
            isFriend,
          });
        }

        setUsers(userList);
      });
    };

    fetchUsers();

    // Track current user authentication state
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
  }, [currentUser]);

  // Function to determine button label based on user's relationship with current user
  const getButtonLabel = (user) => {
    if (user.isFriend) {
      return "Family";
    }
    if (user.hasSentFriendRequest) {
      return "Requested";
    }
    return "Add";
  };

  // Function to determine button color based on user's relationship with current user
  const getButtonColor = (user) => {
    if (user.isFriend) {
      return COLORS.grayBlack;
    }
    if (user.hasSentFriendRequest) {
      return tinycolor(COLORS.grayBlack).darken(20).toString();
    }
    return COLORS.grayBlack;
  };

  // Filter users based on search query
  const filteredUsers = searchQuery
    ? users.filter(
        (user) =>
          user.fullName &&
          user.fullName.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : [];

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

      <TouchableOpacity
        onPress={() => navigation.navigate("FriendRequest")}
        style={styles.titleContainer}
      >
        <Text style={styles.title}>Requests</Text>
      </TouchableOpacity>

      {searchQuery &&
        filteredUsers.map((user) => (
          <TouchableOpacity
            key={user.key}
            style={styles.userContainer}
            onPress={() =>
              navigation.navigate("Profile", {
                user: { ...user, uid: user.key },
              })
            }
          >
            <TouchableOpacity
              key={user.key}
              onPress={() =>
                navigation.navigate("Profile", {
                  user: { ...user, uid: user.key },
                })
              }
            >
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
            </TouchableOpacity>

            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.fullName}</Text>
              {currentUser && (
                <TouchableOpacity
                  style={[
                    styles.addButton,
                    { backgroundColor: getButtonColor(user) },
                  ]}
                  onPress={() => handleAdd(user)}
                >
                  <Text style={styles.addButtonLabel}>
                    {getButtonLabel(user)}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </TouchableOpacity>
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
    fontFamily: "Nunito-Bold",
    fontSize: 14,
  },
});

export default Add;
