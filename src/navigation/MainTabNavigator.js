import * as React from 'react';
import { Constants } from 'expo';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from 'app/src/screens/HomeScreen';
import SearchScreen from 'app/src/screens/SearchScreen';
import TakeScreen from 'app/src/screens/TakeScreen';
import NotificationScreen from 'app/src/screens/NotificationScreen';
import UserScreen from 'app/src/screens/UserScreen';

import {
  HomeTabIcon,
  SearchTabIcon,
  TakeTabIcon,
  NotificationTabIcon,
  MeTabIcon,
  TabBar,
} from 'app/src/components/TabBarIcon';

// const Stack = createStackNavigator();

const Tab = createBottomTabNavigator();

const tabBarOptions = {};

function MainTabNavigator() {
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
        component={TakeScreen}
        options={{
          tabBarLabel: 'Take',
          tabBarIcon: TakeTabIcon,
        }}
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

// function MyStack() {
//   return (
//     <Stack.Navigator>
//       <Stack.Screen name="Home" component={Home} />
//       <Stack.Screen name="Notifications" component={Notifications} />
//       <Stack.Screen name="Profile" component={Profile} />
//       <Stack.Screen name="Settings" component={Settings} />
//     </Stack.Navigator>
//   );
// }

export default MainTabNavigator;
