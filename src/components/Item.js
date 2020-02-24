import * as React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  // Text,
} from 'react-native';
import { Video } from 'expo-av';
import Constants from 'expo-constants';

/* node_modules */
import { Image } from 'react-native-expo-image-cache';
import Hyperlink from 'react-native-hyperlink';
// import LinkifyIt from 'linkify-it';

/* from app */
import Avatar from 'app/src/components/Avatar';
import IconButton from 'app/src/components/IconButton';
import Text from 'app/src/components/Text';

const defaultProps = {
  type: 'photo',
  text: '',
  fileUri: null,
  fileWidth: null,
  fileHeight: null,
  user: {
    uid: null,
    img: null,
    name: null,
  },
  timestamp: null,
  visible: true,
  onUserPress: () => {},
  onMorePress: () => {},
  onLikePress: () => {},
};

class Item extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: 0,
    };
  }

  onLayout = ({ nativeEvent }) => {
    const { height } = nativeEvent.layout;
    this.setState({ height });
  };

  getRelativeTime = (timestamp) => {
    const created = new Date(timestamp);
    const diff = Math.floor((new Date().getTime() - created.getTime()) / 1000);

    if (diff < 60) {
      return `${diff}s`;
    }
    if (diff < 3600) {
      return `${Math.floor(diff / 60)}m`;
    }
    if (diff < 86400) {
      return `${Math.floor(diff / 3600)}h`;
    }

    return `${created.getFullYear()}/${`00${created.getMonth() + 1}`.slice(
      -2
    )}/${`00${created.getDate()}`.slice(-2)}`;
  };

  render() {
    const {
      type,
      text,
      fileUri,
      user,
      timestamp,
      liked,
      visible,
      onUserPress,
      onMorePress,
      onLikePress,
      onLinkPress,
    } = this.props;
    const { height = 0 } = this.state;

    if (!visible && height > 0) {
      return <View style={{ height }} />;
    }

    return (
      <View style={styles.container} onLayout={this.onLayout}>
        <View style={styles.header}>
          <View style={styles.headerUser}>
            <TouchableOpacity
              style={styles.avatar}
              onPress={() => onUserPress(this.props)}
            >
              <Avatar uri={user.img} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onUserPress(this.props)}>
              <Text font="noto-sans-medium">{user.name}</Text>
            </TouchableOpacity>
          </View>
          <View>
            <IconButton
              name="ios-more"
              size={26}
              style={styles.icon}
              onPress={() => onMorePress(this.props)}
            />
          </View>
        </View>

        {type === 'photo' && <Image uri={fileUri} style={styles.file} />}

        {type === 'movie' && (
          <Video
            source={{ uri: fileUri }}
            resizeMode="cover"
            useNativeControls
            style={styles.file}
          />
        )}

        <View style={styles.buttons}>
          <IconButton
            name={liked ? 'ios-heart' : 'ios-heart-empty'}
            size={26}
            style={styles.icon}
            color={liked ? '#ed4956' : Constants.manifest.extra.textColor}
            onPress={() => onLikePress(this.props)}
          />
        </View>

        {text !== '' && (
          <Hyperlink onPress={onLinkPress} linkStyle={{ color: '#2980b9' }}>
            <Text style={styles.text}>{text}</Text>
          </Hyperlink>
        )}
        <Text style={styles.time}>{this.getRelativeTime(timestamp)}</Text>
      </View>
    );
  }
}

Item.defaultProps = defaultProps;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
  },
  headerUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    marginRight: 8,
  },
  file: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
  },
  buttons: {
    padding: 12,
    paddingBottom: 4,
  },
  icon: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  text: {
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  time: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    fontSize: 12,
    color: '#999',
  },
});

export default Item;
