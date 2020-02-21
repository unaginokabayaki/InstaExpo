import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';

import MainTabNavigator from 'app/src/navigation/MainTabNavigator';
import UserScreen from 'app/src/screens/UserScreen';
import TagScreen from 'app/src/screens/TagScreen';
import PostScreen from 'app/src/screens/PostScreen';

import TakeScreen from 'app/src/screens/TakeScreen';
import TakePublishScreen from 'app/src/screens/TakePublishScreen';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const TakeStack = createStackNavigator();

export function TakeStackNavigator() {
  return (
    <TakeStack.Navigator initialRouteName="Take">
      <TakeStack.Screen name="Take" component={TakeScreen} />
      <TakeStack.Screen name="Pub" component={TakePublishScreen} />
    </TakeStack.Navigator>
  );
}

export function MainStackNavigator() {
  return (
    <MainStack.Navigator initialRouteName="Main">
      <MainStack.Screen name="Main" component={MainTabNavigator} />
      <MainStack.Screen name="User" component={UserScreen} />
      <MainStack.Screen name="Tag" component={TagScreen} />
      <MainStack.Screen name="Post" component={PostScreen} />
    </MainStack.Navigator>
  );
}

function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        initialRouteName="MainStack"
        screenOptions={{
          gestureEnabled: true,
          cardOverlayEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        }}
        mode="modal"
        headerMode="none"
      >
        <RootStack.Screen name="MainStack" component={MainStackNavigator} />
        <RootStack.Screen name="TakeStack" component={TakeStackNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
