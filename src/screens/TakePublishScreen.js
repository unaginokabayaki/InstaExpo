import * as React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  ScrollView,
  Image,
  Keyboard,
  Alert,
  TextInput,
} from 'react-native';
import { Video } from 'expo-av';
// import { Image } from 'react-native-expo-image-cache';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';

import IconButton from '../components/IconButton';

class TakePublishScreen extends React.Component {
  constructor(props) {
    super(props);

    const { route } = this.props;
    this.state = {
      mode: route.params?.mode ?? 'photo',
      photo: route.params?.photo ?? {},
      movie: route.params?.movie ?? {},
      text: '',
    };
  }

  componentDidMount() {
    const { photo = {}, movie = {} } = this.state;
    const { navigation } = this.props;

    if (!photo.uri && !movie.uri) {
      navigation.goBack();
    }

    navigation.setParams({
      headerRight: <IconButton name="ios-send" onPress={this.onPublish} />,
    });
  }

  onChangeText = (text) => {
    this.setState({ text });
  };

  onPublish = async (item) => {
    // ここに投稿の処理を書きます。
  };

  render() {
    const { navigation, route } = this.props;
    const { mode, photo, movie, text } = this.state;

    navigation.setOptions({
      headerTitle: '投稿する',
      headerLeft: () => (
        <IconButton name="ios-arrow-back" onPress={() => navigation.goBack()} />
      ),
      headerRight: () => route.params?.headerRight ?? null,
    });

    return (
      <ScrollView
        scrollEnabled={false}
        style={styles.container}
        contentContainerstyle={styles.container}
      >
        <View style={styles.row}>
          {mode === 'photo' && (
            <Image source={{ uri: photo.uri }} style={styles.photo} />
          )}
          {mode === 'movie' && (
            <Video
              source={{ uri: movie.uri }}
              style={styles.photo}
              resizeMode="cover"
              shouldPlay
              isLooping
            />
          )}
          <TextInput
            multiline
            style={styles.textInput}
            placeholder="テキストを入力してください"
            underlineColorAndroid="transparent"
            textAlignVertical="top"
            value={text}
            onChangeText={this.onChangeText}
          />
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.manifest.extra.backgroundColor,
  },
  row: {
    flexDirection: 'row',
    padding: 8,
  },
  photo: {
    width: 100,
    height: 100,
  },
  textInput: {
    padding: 8,
    flex: 1,
    fontFamily: 'noto-sans-regular',
    fontSize: 16,
    maxHeight: 16 * 8,
    backgroundColor: '#eee',
    marginLeft: 8,
    borderRadius: 8,
  },
});

export default TakePublishScreen;
