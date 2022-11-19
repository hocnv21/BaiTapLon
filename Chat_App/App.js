import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import Navigator from './Navigator';

const Stack = createStackNavigator();

function App() {
  return (
    <View style={{flex: 1}}>
      <Navigator />
    </View>
  );
}

export default App;
