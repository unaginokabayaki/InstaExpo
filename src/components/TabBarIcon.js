import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

// import styles from '.styles';

export default function TabBarIcon(props) {
  return (
    <Ionicons
      name={props.name}
      size={30}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}

export const HomeTabIcon = ({ color, size }) => {
  return <Ionicons name="md-home" size={size} color={color} />;
};

export const SearchTabIcon = ({ color, size }) => {
  return <Ionicons name="md-search" size={size} color={color} />;
};

export const TakeTabIcon = ({ color, size }) => {
  // return <Ionicons name="md-add" size={size} color={color} />;
  return (
    <View style={styles.takeTab}>
      <View style={{ ...styles.takeTabRounded, borderColor: 'red' }}>
        <Ionicons name="md-add" size={18} color={'red'} />
      </View>
    </View>
  );
};

export const NotificationTabIcon = ({ color, size }) => {
  return <Ionicons name="md-heart" size={size} color={color} />;
};

export const MeTabIcon = ({ color, size }) => {
  return <Ionicons name="md-person" size={size} color={color} />;
};

const styles = StyleSheet.create({
  icon: {
    marginBottom: -3,
  },
  takeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  takeTabRounded: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderRadius: 6,
  },
});
