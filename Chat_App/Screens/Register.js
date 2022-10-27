import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
} from 'react-native';
import {Button} from 'react-native-paper';
import CustomButton from './CustomButton';
// import {MaterialCommunityIcons} from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default function Register({navigation}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [image, setImage] = useState(null);
  const [showNext, setShowNext] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <ActivityIndicator size="large" color="#00ff00" />;
  }
  const userSignup = async () => {
    setLoading(true);
    if (!email || !password || !image || !name) {
      alert('please add all the field');
      return;
    }
    try {
      const result = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      firestore().collection('users').doc(result.user.uid).set({
        name: name,
        email: result.user.email,
        uid: result.user.uid,
        pic: image,
        status: 'online',
      });
      setLoading(false);
    } catch (err) {
      alert('something went wrong');
    }
  };
  const pickImageAndUpload = () => {
    launchImageLibrary({quality: 0.5}, fileobj => {
      const uploadTask = storage()
        .ref()
        .child(`/userprofile/${Date.now()}`)
        .putFile(fileobj.uri);
      uploadTask.on(
        'state_changed',
        snapshot => {
          var progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (progress == 100) alert('image uploaded');
        },
        error => {
          alert('error uploading image');
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then(downloadURL => {
            setImage(downloadURL);
          });
        },
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={pickImageAndUpload}
        // eslint-disable-next-line react-native/no-inline-styles
        style={{
          marginTop: 30,
          borderRadius: 120,
          width: 120,
          height: 120,
          backgroundColor: '#ffff',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {/* {!image ? (
          <MaterialCommunityIcons
            name="camera-plus"
            // color={""}
            size={45}
          />
        ) : (
          <Image
            source={{uri: image}}
            style={{width: '100%', height: '100%', borderRadius: 120}}
          />
        )} */}
      </TouchableOpacity>

      <TextInput
        placeholder="Name Profile"
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="email"
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="password"
        onChangeText={setPassword}
        secureTextEntry={true}
        style={styles.input}
      />
      <TextInput
        placeholder="passwordConfirm"
        onChangeText={setPasswordConfirm}
        secureTextEntry={true}
        style={styles.input}
      />

      <CustomButton
        title="Register"
        type="PRIMARY"
        disabled={!email || !password || !name || !image || !passwordConfirm}
        onPress={() => userSignup()}
      />

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text>You have an account ?</Text>
      </TouchableOpacity>
      {/* <CustomButton
        title="Login"
        type="GRAY"
        onPress={() => navigation.navigate("Login")}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    padding: 10,
  },
});
