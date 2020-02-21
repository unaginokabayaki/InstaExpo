import * as React from 'react';
import { View, Text } from 'react-native';
import { Constants } from 'expo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from 'app/src/screens/HomeScreen';
import SearchScreen from 'app/src/screens/SearchScreen';
import NotificationScreen from 'app/src/screens/NotificationScreen';
import UserScreen from 'app/src/screens/UserScreen';

import {
  HomeTabIcon,
  SearchTabIcon,
  TakeTabIcon,
  NotificationTabIcon,
  MeTabIcon,
  // TabBar,
} from 'app/src/components/TabBarIcon';

// const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const tabBarOptions = {};

function OpenTakeStack({ navigation }) {
  navigation.addListener('tabPress', (e) => {
    // Prevent default behavior
    e.preventDefault();
    navigation.navigate('TakeStack');
  });
  return null;
}

function MainTabNavigator({ navigation, route }) {
  const routeName = route.state
    ? route.state.routes[route.state.index].name
    : route.params?.screen || 'HomeTab';
  navigation.setOptions({ headerTitle: routeName });

  return (
    <Tab.Navigator
      initialRouteName="Home"
      tabBarOptions={{
        showLabel: true,
        activeTintColor: '#333',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: HomeTabIcon,
          // tabBarIcon: ({ focused }) => (
          //   <TabBarIcon focused={focused} name="md-home" />
          // ),
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: SearchTabIcon,
        }}
      />
      <Tab.Screen
        name="TakeTab"
        component={OpenTakeStack}
        options={() => ({
          tabBarLabel: 'Take',
          tabBarIcon: TakeTabIcon,
        })}
      />
      <Tab.Screen
        name="NotificationTab"
        component={NotificationScreen}
        options={{
          tabBarLabel: 'Notification',
          tabBarIcon: NotificationTabIcon,
        }}
      />
      <Tab.Screen
        name="MeTab"
        component={UserScreen}
        options={{
          tabBarLabel: 'Me',
          tabBarIcon: MeTabIcon,
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
