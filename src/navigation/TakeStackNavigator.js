import * as React from 'react';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TakeScreen from 'app/src/screens/TakeScreen';
import TakePublishScreen from 'app/src/screens/TakePublishScreen';

const TakeStack = createStackNavigator();

function TakeStackNavigator() {
  return (
    <TakeStack.Navigator initialRouteName="Take">
      <TakeStack.Screen
        name="Take"
        component={TakeScreen}
        // options={{
        //   title: 'Take',
        // }}
      />
      <TakeStack.Screen
        name="Pub"
        component={TakePublishScreen}
        // options={{
        //   title: 'TakePub',
        // }}
      />
    </TakeStack.Navigator>
  );
}

export default TakeStackNavigator;
