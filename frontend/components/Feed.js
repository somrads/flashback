import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { COLORS } from "../constants/colors";


const Feed = () => {
  return (
    <View style={styles.container}>
      <Text style={{color: "red"}}>
        Feed
      </Text>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
});

export default Feed;