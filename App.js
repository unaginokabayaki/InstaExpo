import * as React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

import fonts from 'app/src/fonts';
import images from 'app/src/images';

import MainTabNavigator from 'app/src/navigation/MainTabNavigator';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoadingComplete: false,
    };
  }

  loadResourceAsync = async () => {
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

    return (
      <NavigationContainer>
        <MainTabNavigator />
      </NavigationContainer>
    );
  }
}

App.defaultProps = {
  skipLoadingScreen: false,
};

export default App;
