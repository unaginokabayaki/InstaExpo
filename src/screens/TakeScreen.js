import * as React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

function TakeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Pub');
        }}
      >
        <Text>Take Screen</Text>
      </TouchableOpacity>
    </View>
  );
}

export default TakeScreen;
