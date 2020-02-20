import * as React from 'react';
import { View, Text } from 'react-native';

function TakeScreen({ navigation }) {
  navigation.addListener('tabPress', (e) => {
    e.preventDefault();
    alert('Take photo!');
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Take Screen</Text>
    </View>
  );
}

export default TakeScreen;
