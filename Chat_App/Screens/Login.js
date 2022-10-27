import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  Alert,
  ActivityIndicator,
} from 'react-native';

import React, {useState} from 'react';
import CustomInput from './CustomInput';
import CustomButton from './CustomButton';
import auth from '@react-native-firebase/auth';
import {TextInput} from 'react-native-paper';

export default function Login({navigation}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }

  const onHandleLogin = async () => {
    setLoading(true);
    if (!email || !password) {
      alert('please add all the field');
      return;
    }
    try {
      const result = await auth().signInWithEmailAndPassword(email, password);
      setLoading(false);
    } catch (err) {
      alert('something went wrong');
    }
  };
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/logoChat.png')} />

      <TextInput
        placeholder="email"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="password"
        onChangeText={text => setPassword(text)}
        secureTextEntry={true}
        style={styles.input}
      />

      <CustomButton
        title="login"
        onPress={() => onHandleLogin()}
        disabled={!email || !password}
        type="PRIMARY"
      />
      <CustomButton
        title="Register"
        type="GRAY"
        onPress={() => navigation.navigate('Register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffff',
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    width: '70%',
    maxHeight: 200,
    maxWidth: 300,
  },
  button: {
    width: '100%',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 5,
    borderColor: '#e8e8e8',
  },
});
