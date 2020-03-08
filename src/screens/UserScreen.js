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
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import { connect } from 'react-redux';
import { Video } from 'expo-av';
import { Image } from 'react-native-expo-image-cache';

import Avatar from 'app/src/components/Avatar';
import FlatList from 'app/src/components/FlatList';
import Text from 'app/src/components/Text';

import firebase from 'app/src/firebase';
import { setMe } from 'app/src/actions/me';

class UserScreen extends React.Component {
  constructor(props) {
    super(props);

    // TODO: Firestoreから受け取る値と入れ替える
    // const me = {
    //   uid: 1,
    //   img: 'https://dummyimage.com/40x40/fff/000.png&text=User1',
    //   name: 'User1',
    // };

    const { route, me } = this.props;
    const uid = route.params?.uid ?? me.uid;
    // console.log(route.params);

    this.state = {
      self: me.uid === uid,
      user: {
        uid: 1,
        img: 'https://dummyimage.com/120x120/ccc/000.png&text=User1',
        name: 'User1',
      },
      posts: [
        {
          pid: 1,
          type: 'photo',
          thumbnail: 'https://dummyimage.com/400x400/ffd/000.png&text=Post1',
        },
        {
          pid: 2,
          type: 'photo',
          thumbnail: 'https://dummyimage.com/400x400/fdf/000.png&text=Post2',
        },
        {
          pid: 3,
          type: 'photo',
          thumbnail: 'https://dummyimage.com/400x400/dff/000.png&text=Post3',
        },
      ],
      cursor: null,
      fetching: false,
      loading: false,
    };
    console.log(me.uid === uid ? 'myprofile' : uid);
  }

  async componentDidMount() {
    const { self } = this.state;
    // TODO: Firestoreから受け取る値と入れ替える
    // const me = {
    //   uid: 1,
    //   img: 'https://dummyimage.com/120x120/fff/000.png&text=User1',
    //   name: 'User1',
    // };
    const { navigation, me } = this.props;

    if (self) {
      // 自分のプロファイル
      await this.setState({ user: me });
      // navigation.setParams({ title: '自分' });
    } else {
      // 自分以外のユーザ
      const user = {
        uid: null,
        name: 'username',
        img: null,
      };
      await this.setState({ user });
      // navigation.setParams({ title: user.name });
    }
  }

  componentDidUpdate(prevProps) {
    const { self } = this.state;
    const { me } = this.props;

    if (prevProps.me !== me && self) {
      this.setState({ user: me });
    }
  }

  onUserPress = async () => {
    // ここにユーザー画像変更の処理を書きます。
    const { me, dispatch, setMe } = this.props;

    const permissions = Permissions.CAMERA_ROLL;
    const { status } = await Permissions.askAsync(permissions);

    if (status) {
      // カメラロールから画像を選択
      const photo = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
      });
      console.log(photo);

      if (!photo.cancelled) {
        // firebaseのアップロード先を取得
        const response = await firebase.changeUserImg(photo);
        if (!response.error) {
          console.log(response);
          setMe({ ...me, img: response });
        }
      }
    }
  };

  onThumbnailPress = (item) => {
    const { navigation } = this.props;
    navigation.push('Post', { pid: item.pid });
  };

  render() {
    const { self, user, posts, fetching, loading } = this.state;

    return (
      <View style={styles.container}>
        <FlatList
          style={styles.thumbnails}
          numColumns={3}
          data={posts}
          keyExtractor={(item) => item.pid.toString()}
          ListHeaderComponent={() => (
            <View style={styles.header}>
              {!self && (
                <Avatar uri={user.img} size={60} style={styles.avatar} />
              )}
              {self && (
                <TouchableOpacity onPress={this.onUserPress}>
                  <Avatar uri={user.img} size={60} style={styles.avatar} />
                </TouchableOpacity>
              )}
              <Text font="noto-sans-medium" style={styles.name}>
                {user.name}
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
  avatar: {
    marginVertical: 12,
  },
  name: {
    textAlign: 'center',
    marginBottom: 12,
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

const mapStateToProps = (state) => {
  return {
    me: state.me,
  };
};

const mapDispatchToProps = {
  setMe,
};

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen);
