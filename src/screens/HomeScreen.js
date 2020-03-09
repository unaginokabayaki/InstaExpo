import * as React from 'react';
import {
  ScrollView,
  RefreshControl,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';

import FlatList from 'app/src/components/FlatList';
import Item from 'app/src/components/Item';

import firebase from 'app/src/firebase';

class HomeScreen extends React.Component {
  // navigationOptions = () => ({
  //   headerTitle: 'フィード',
  // });
  constructor(props) {
    super(props);
    this.state = {
      posts: [],
      // posts: [
      //   {
      //     pid: 1,
      //     text: '1つ目の投稿です。 #tag1',
      //     fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post1',
      //     user: {
      //       uid: 1,
      //       img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
      //       name: 'User1',
      //     },
      //   },
      //   {
      //     pid: 2,
      //     text: '2つ目の投稿です。 #tag2',
      //     fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post2',
      //     user: {
      //       uid: 1,
      //       img: 'https://dummyimage.com/40x40/fff/000.png&text=User2',
      //       name: 'User1',
      //     },
      //   },
      //   {
      //     pid: 3,
      //     text: '3つ目の投稿です。 #tag3',
      //     fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post3',
      //     user: {
      //       uid: 1,
      //       img: 'https://dummyimage.com/40x40/fff/000.png&text=User3',
      //       name: 'User1',
      //     },
      //   },
      // ],
      fetching: false,
      loading: false,
    };
  }

  async componentDidMount() {
    await this.getPosts();
  }

  getPosts = async (cursor = null) => {
    console.log('getPosts');
    this.setState({ fetching: true });

    const response = await firebase.getPosts(cursor);

    if (!response.error) {
      const { posts } = this.state;

      // dataにはデータが、cursorには最後尾が入ってくる
      // カーソルで続きを読んだ場合は結合する
      this.setState({
        posts: cursor ? posts.concat(response.data) : response.data,
        cursor: response.cursor,
      });
    }

    this.setState({ fetching: false });
  };

  // リストを最初から再取得
  onRefresh = async () => {};

  // リストの最後に来たら続きを読み込む
  onEndReached = async () => {
    console.log('onEndReached');
    const { cursor, loading } = this.state;
    console.log(loading);
    console.log(cursor);

    if (!loading && cursor) {
      this.setState({ loading: true });
      await this.getPosts(cursor);
      this.setState({ loading: false });
    }
  };

  onUserPress = (item) => {
    // ここにUserScreenに遷移する処理を書きます。
  };

  onMorePress = (item) => {
    // ここに投稿の共有をする処理を書きます。
  };

  onLikePress = (item) => {
    // ここにいいねの処理を書きます。
  };

  onLinkPress = (url, txt) => {
    const { navigation } = this.props;
    console.log(txt);

    switch (txt[0]) {
      case '#':
        navigation.push('Tag', { tag: txt });
        break;
      default:
        WebBrowser.openBrowserAsync(url);
        break;
    }
  };

  render() {
    const { posts, fetching, loading } = this.state;

    if (!fetching && posts.length === 0) {
      return (
        <ScrollView
          style={styles.container}
          contentContainerStyle={[styles.container, styles.empty]}
        >
          <Text>投稿はありません</Text>
        </ScrollView>
      );
    }

    return (
      <View style={styles.container} testID="Home">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.pid.toString()}
          refreshControl={
            <RefreshControl refreshing={fetching} onRefresh={this.onRefresh} />
          }
          onEndReachedThreshold={0.1}
          onEndReached={this.onEndReached}
          renderItem={({ item, index, separators }) => {
            // console.log(index);
            return (
              <Item
                {...item}
                // visible={viewableItemIndices.indexOf(index) > -1}
                onUserPress={this.onUserPress}
                onMorePress={this.onMorePress}
                onLikePress={this.onLikePress}
                onLinkPress={this.onLinkPress}
              />
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
  empty: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
  },
  loading: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
});

export default HomeScreen;
