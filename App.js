import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  TransitionPresets,
} from '@react-navigation/stack';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import fonts from 'app/src/fonts';
import images from 'app/src/images';

import AppNavigator from 'app/src/navigation/AppNavigator';
import firebase from 'app/src/firebase';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
    };
  }

  loadResourceAsync = async () => {
    let uid = await firebase.init();
    // console.log(uid);
    await Asset.loadAsync(Object.keys(images).map((key) => images[key]));
    await Font.loadAsync(fonts);
    return true;
  };

  render() {
    const { isLoadingComplete } = this.state;
    const { skipLoadingScreen } = this.props;

    if (!isLoadingComplete && !skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this.loadResourceAsync}
          onError={(error) => console.warn(error)}
          onFinish={() => this.setState({ isLoadingComplete: true })}
        />
      );
    }

    return <AppNavigator />;
  }
}

App.defaultProps = {
  skipLoadingScreen: false,
};

export default App;
