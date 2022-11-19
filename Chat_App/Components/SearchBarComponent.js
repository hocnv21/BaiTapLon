import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {SearchBar} from '@rneui/themed';

export default function SearchBarComponent({search, setSearch, keyPress}) {
  const navigation = useNavigation();
  return (
    <View style={styles.view}>
      <SearchBar
        platform="android"
        containerStyle={{
          borderRadius: 20,
          marginHorizontal: 20,
          height: 50,
          justifyContent: 'center',
        }}
        inputContainerStyle={{}}
        inputStyle={{fontSize: 16}}
        leftIconContainerStyle={{}}
        rightIconContainerStyle={{}}
        loadingProps={{}}
        onChangeText={setSearch}
        onKeyPress={() => keyPress()}
        onClearText={{}}
        placeholder="Search..."
        placeholderTextColor="#888"
        cancelButtonTitle="Cancel"
        cancelButtonProps={{}}
        onCancel={() => navigation.goBack()}
        value={search}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    marginVertical: 10,
  },
});
