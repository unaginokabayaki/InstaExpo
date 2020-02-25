import * as React from 'react';
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import Constants from 'expo-constants';

import FlatList from 'app/src/components/FlatList';
import Item from 'app/src/components/Item';

class HomeScreen extends React.Component {
  // navigationOptions = () => ({
  //   headerTitle: 'フィード',
  // });
  constructor(props) {
    super(props);
    this.state = {
      posts: [
        {
          text: '1つ目の投稿です。 #tag1',
          fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post1',
          user: {
            uid: 1,
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
            name: 'User1',
          },
        },
        {
          text: '1つ目の投稿です。 #tag2',
          fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post2',
          user: {
            uid: 1,
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User2',
            name: 'User1',
          },
        },
        {
          text: '1つ目の投稿です。 #tag3',
          fileUri: 'https://dummyimage.com/400x400/000/fff.png&text=Post3',
          user: {
            uid: 1,
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User3',
            name: 'User1',
          },
        },
      ],
      fetching: false,
      loading: false,
    };
  }

  onUserPress = (item) => {
    // ここにUserScreenに遷移する処理を書きます。
  };

  onMorePress = (item) => {
    // ここに投稿の共有をする処理を書きます。
  };

  onLikePress = (item) => {
    // ここにいいねの処理を書きます。
  };

  onLinkPress = (url, txt) => {};

  render() {
    const { posts, fetching, loading } = this.state;

    if (posts.length === 0) {
      return (
        <ScrollView
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text>投稿はありません</Text>
        </ScrollView>
      );
    }

    return (
      <View style={styles.container} testID="Home">
        <FlatList
          data={posts}
          keyExtractor={(item) => item.key}
          renderItem={({ item, index, separators }) => {
            console.log(index);
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
