import * as React from 'react';
import { View, Text } from 'react-native';
import Constants from 'expo-constants';
import {
  NavigationContainer,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
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

class MainTabNavigator extends React.Component {
  // function MainTabNavigator({ navigation, route }) {

  render() {
    const { navigation, route } = this.props;
    const routeName = route.state
      ? route.state.routes[route.state.index].name
      : route.params?.screen || 'HomeTab';
    const headerShown = !['SearchTab'].includes(routeName);

    let headerName = '';
    switch (routeName) {
      case 'HomeTab':
        headerName = 'Home';
        break;
      case 'NotificationTab':
        headerName = 'Notification';
        break;
      default:
        headerName = routeName;
    }

    navigation.setOptions({ headerTitle: headerName, headerShown });

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
            headerShown: false,
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
}

export default function(props) {
  const navigation = useNavigation();
  const route = useRoute();
  return <MainTabNavigator {...props} navigation={navigation} route={route} />;
}
// export default MainTabNavigator;
