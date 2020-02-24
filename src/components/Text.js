import * as React from 'react';
import { Text as RNText } from 'react-native';
import Constants from 'expo-constants';

const defaultProps = {
  font: 'noto-sans-regular',
};

class Text extends React.Component {
  render() {
    const { font, style } = this.props;

    const textStyle = {
      fontFamily: font,
      color: Constants.manifest.extra.textColor,
    };

    return <RNText {...this.props} style={[textStyle, style]} />;
  }
}

Text.defaultProps = defaultProps;

export default Text;
