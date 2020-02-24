import * as React from 'react';
import { View, StyleSheet } from 'react-native';
/* node_modules */
import { Image } from 'react-native-expo-image-cache';

const defaultProps = {
  uri: null,
  style: null,
  size: 36,
};

class Avatar extends React.Component {
  render() {
    const { uri, style, size } = this.props;

    const avatarStyle = [
      styles.image,
      {
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: '#eee',
      },
      style,
    ];

    if (!uri) {
      return <View style={avatarStyle} />;
    }

    return <Image uri={uri} style={avatarStyle} resizeMode="cover" />;
  }
}

Avatar.defaultProps = defaultProps;

const styles = StyleSheet.create({
  image: {
    aspectRatio: 1,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#ababab',
    borderRadius: 10,
  },
});

export default Avatar;
