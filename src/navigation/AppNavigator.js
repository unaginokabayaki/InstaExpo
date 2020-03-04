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

import firebase from 'app/src/firebase';

import { connect } from 'react-redux';
import { setMe } from 'app/src/actions/me';

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

function AppNavigator(props) {
  // const [me, setMe] = React.useState({ uid: '', name: '', image: '' });
  React.useEffect(() => {
    (async () => {
      const user = await firebase.getUser();
      console.log(user);
      props.dispatchSetMe(user);
    })();
  }, []);

  return (
    <NavigationContainer
      onStateChange={(state) => {
        // console.log('state is ' + state);
      }}
    >
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

const mapStateToProps = (state) => {
  return {
    me: state.me,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatchSetMe: (user) => dispatch(setMe(user)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
// export default AppNavigator;
