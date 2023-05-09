import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Profile from "./components/Profile";
import { COLORS } from "./constants/colors";

export default function App() {
  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>
        <Profile />
      </View>
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});
