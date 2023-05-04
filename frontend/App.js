import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Profile from "./components/Profile";

export default function App() {
  return (
    <View style={styles.container}>
      {/* <Text>Hello World!</Text>
      <StatusBar style="auto" /> */}
      <Profile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#151515",
  },
});
