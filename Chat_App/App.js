import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, Text, View} from 'react-native';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Home from './Screens/Home';
import Account from './Screens/Account';
import Chat from './Screens/Chat';
import Login from './Screens/Login';
import Register from './Screens/Register';

const Stack = createStackNavigator();
const Navigation = () => {
  const [user, setuser] = useState('');
  useEffect(() => {
    const unregister = auth().onAuthStateChanged(userExist => {
      if (userExist) {
        firestore().collection('users').doc(userExist.uid).update({
          status: 'online',
        });
        setuser(userExist);
      } else setuser('');
    });

    return () => {
      unregister();
    };
  }, []);
  function Authstack() {
    <Stack.Navigator>
      <Stack.Screen
        name="login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="signup"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>;
  }
  function Chatstack() {
    return (
      <Stack.Navigator>
        <Stack.Screen name="Home">
          {props => <Home {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen
          name="Chat"
          options={({route}) => ({
            title: (
              <View>
                <Text>{route.params.name}</Text>
                <Text>{route.params.status}</Text>
              </View>
            ),
          })}>
          {props => <Chat {...props} user={user} />}
        </Stack.Screen>
        <Stack.Screen name="Account">
          {props => <Account {...props} user={user} />}
        </Stack.Screen>
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      {user ? <Chatstack /> : <Authstack />}
    </NavigationContainer>
  );
};

const App = () => {
  return (
    <>
      <PaperProvider>
        <StatusBar barStyle="light-content" backgroundColor="green" />
        <View style={styles.container}>
          <Navigation />
        </View>
      </PaperProvider>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
