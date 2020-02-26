import * as React from 'react';
import { StyleSheet, View, ScrollView, Share } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import Constants from 'expo-constants';

import Item from 'app/src/components/Item';
import Text from 'app/src/components/Text';

class PostScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      error: false,
      fetching: false,
    };
  }

  onUserPress = (item) => {
    const { navigation } = this.props;
    navigation.push('User', { uid: item.uid });
  };

  onMorePress = (item) => {
    Share.share({
      message: item.fileUri,
    });
  };

  onLikePress = async (item) => {
    // ここにいいねの処理を書きます。
  };

  // onLinkPress = (url, txt) => {
  //   const { navigation } = this.props;

  //   switch (txt[0]) {
  //     case '#':
  //       navigation.push('Tag', { tag: txt });
  //       break;
  //     default:
  //       WebBrowser.openBrowserAsync(url);
  //       break;
  //   }
  // }

  render() {
    const { error, fetching } = this.state;

    if (error || fetching) {
      return (
        <View style={[styles.container, styles.empty]}>
          <Text font="noto-sans-bold" style={styles.emptyText}>
            {error && '投稿はありません'}
            {fetching && '読み込み中'}
          </Text>
        </View>
      );
    }

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.container}
      >
        <Item
          // TODO: Firestoreから受け取る値と入れ替える
          // {...this.state}
          text="投稿です。"
          fileUri="https://dummyimage.com/400x400/000/fff.png&text=Post1"
          user={{
            uid: 1,
            img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
            name: 'User1',
          }}
          onUserPress={this.onUserPress}
          onMorePress={this.onMorePress}
          onLikePress={this.onLikePress}
          onLinkPress={this.onLinkPress}
        />
      </ScrollView>
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
});

export default PostScreen;
