import * as React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Constants from 'expo-constants';
import { Video } from 'expo-av';
import { Image } from 'react-native-expo-image-cache';

import FlatList from 'app/src/components/FlatList';
import Text from 'app/src/components/Text';

class TagScreen extends React.Component {
  constructor(props) {
    super(props);

    const { route } = this.props;
    const tag = route.params?.tag ?? null;

    this.state = {
      tag,
      // TODO: Firestoreから受け取る値と入れ替える
      posts: [
        {
          pid: 1,
          type: 'photo',
          text: 'tagの投稿です。',
          fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post1',
          thumbnail: 'https://dummyimage.com/400x400/000/fff.png&text=Post1',
          user: {
            uid: 1,
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
            name: 'User1',
          },
        },
      ],
      cursor: null,
      fetching: false,
      loading: false,
    };
  }

  onThumbnailPress = (item) => {
    const { navigation } = this.props;
    navigation.push('Post', { pid: item.pid });
  };

  render() {
    const { tag, posts, fetching, loading } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.thumbnails}
          numColumns={3}
          data={posts}
          keyExtractor={(item) => item.pid.toString()}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              <Text font="noto-sans-medium" style={styles.name}>
                {tag}の投稿一覧
              </Text>
            </View>
          )}
          renderItem={({ item, index, separators }) => {
            // if (viewableItemIndices.indexOf(index) === -1) {
            //   return <View style={styles.file} />;
            // }
            return (
              <TouchableOpacity onPress={() => this.onThumbnailPress(item)}>
                {item.type === 'photo' && (
                  <Image uri={item.thumbnail} style={styles.file} />
                )}
                {item.type === 'movie' && (
                  <Video
                    source={{ uri: item.thumbnail }}
                    resizeMode="cover"
                    shouldPlay
                    isLooping
                    style={styles.file}
                  />
                )}
              </TouchableOpacity>
            );
          }}
          ListFooterComponent={
            loading ? (
              <View style={styles.loading}>
                <ActivityIndicator size="small" />
              </View>
            ) : null
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.manifest.extra.backgroundColor,
  },
  header: {
    alignItems: 'center',
    padding: 12,
  },
  thumbnails: {
    flex: 1,
  },
  file: {
    flex: 1,
    width: Dimensions.get('window').width / 3,
    height: Dimensions.get('window').width / 3,
    marginRight: 1,
    marginBottom: 1,
    backgroundColor: '#efefef',
  },
});

export default TagScreen;
