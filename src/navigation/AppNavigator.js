import * as React from 'react';
import { Alert } from 'react-native';
import {
  NavigationContainer,
  CommonActions,
  useNavigation,
} from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';

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
  const ref = React.useRef(null);
  // const [me, setMe] = React.useState({ uid: '', name: '', image: '' });
  React.useEffect(() => {
    (async () => {
      const user = await firebase.getUser();
      console.log(user);
      props.setMe(user);
    })();
  }, []);

  React.useEffect(() => {
    (async () => {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      console.log(finalStatus);
      // パーミッションダイアログ表示
      if (existingStatus !== 'granted') {
        const { stuatus } = await Permissions.askAsync(
          Permissions.NOTIFICATIONS
        );
        finalStatus = stuatus;
      }

      if (finalStatus !== 'granted') {
        return;
      }

      // デバイストークン取得してfirebaseに保存
      const deviceToken = await Notifications.getExpoPushTokenAsync();
      if (deviceToken) {
        firebase.updateUserToken(deviceToken);
      }
    })();
  }, []);

  React.useEffect(() => {
    (() => {
      const subscribeNotification = (notification) => {
        // const { dispatch, navigation } = props;
        const { data = {} } = notification;
        const { screen = null } = data;
        console.log('tap notification');
        console.log(notification);
        console.log(props);
        console.log(ref.current);

        if (notification.origin === 'selected') {
          if (screen) {
            // アプリがバックグラウンドまたは、開かれていない状態で通知を開いた場合
            ref.current?.navigate(screen);
            // navigation.navigate({}});
          } else if (notification.origin === 'received') {
            // アプリが開かれている場合
            Alert.alert('新しい通知があります', '今すぐ確認しますか？', [
              { text: 'No', style: 'cancel' },
              {
                text: 'Yes',
                onPress: () => {
                  if (screen) {
                    ref.current?.navigate(screen);
                    // navigation.navigate({ routeName: screen });
                  }
                },
              },
            ]);
          }
        }
      };

      Notifications.addListener(subscribeNotification);
    })();
  }, []);

  return (
    <NavigationContainer onStateChange={(state) => {}}>
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

// const mapDispatchToProps = (dispatch) => {
//   return {
//     dispatchSetMe: (user) => dispatch(setMe(user)),
//   };
// };
const mapDispatchToProps = {
  setMe,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
// export default AppNavigator;
