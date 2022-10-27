import {View, Text, TextInput, StyleSheet} from 'react-native';
import React from 'react';

const CustomInput = ({value, setValue, placeholder, secureTextEntry}) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onchangeText={text => setValue(text)}
        secureTextEntry={secureTextEntry}
        style={StyleSheet.input}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffff',
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderColor: '#e8e8e8',
    padding: 10,
  },
  input: {},
});
export default CustomInput;
