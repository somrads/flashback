import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { COLORS } from "../constants/colors";


const Add = () => {
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <AntDesign name="search1" size={24} color={COLORS.grayWhite} style={styles.searchIcon} />
        <TextInput
          style={styles.input}
          placeholder="Search for family members"
          placeholderTextColor="lightgray"
        />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Add</Text>
        <Text style={styles.title}>Requests</Text>
      </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.grayBlack,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: COLORS.grayWhite,
    fontFamily: "Nunito-Regular"
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.grayWhite,
    marginRight: 10,
    fontFamily: "Nunito-Regular"

  },
});

export default Add;
