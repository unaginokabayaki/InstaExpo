import * as React from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  TouchableOpacity,
  Button,
} from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import { Camera } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';

import IconButton from 'app/src/components/IconButton';
import Text from 'app/src/components/Text';

class TakeScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      mode: 'photo',
      hasCameraPermission: null,
      cameraType: Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off,
      isRecording: false,
    };
  }

  async componentDidMount() {
    // const { status } = await Camera.requestPermissionsAsync();
    const { status } = await Permissions.getAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  onChangePress = () => {
    const { cameraType } = this.state;
    this.setState({
      cameraType:
        cameraType === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back,
      flashMode: Camera.Constants.FlashMode.off,
    });
  };

  onFlashPress = () => {
    const { flashMode } = this.state;
    this.setState({
      flashMode:
        flashMode === Camera.Constants.FlashMode.off
          ? Camera.Constants.FlashMode.on
          : Camera.Constants.FlashMode.off,
    });
  };

  onTakePress = async () => {
    const { mode, isRecording } = this.state;
    const { navigation } = this.props;

    if (this.camera && !isRecording) {
      this.setState({ isRecording: true });

      const photo = await this.camera.takePictureAsync({
        quality: 1.0,
        base64: false,
        exif: false,
      });
      // console.log(photo);

      this.setState({ isRecording: false });

      navigation.push('Pub', { mode, photo });
    }
  };

  onRecordPress = async () => {
    const { mode, isRecording } = this.state;
    const { navigation } = this.props;

    if (this.camera && !isRecording) {
      this.setState({ isRecording: true });

      this.movie = await this.camera.recordAsync({
        quality: '720p',
        maxDuration: 10,
      });

      this.setState({ isRecording: false });

      navigation.push('Pub', { mode, movie: this.movie });
    } else {
      this.setState({ isRecording: false });
      this.camera.stopRecording();
    }
  };

  onTabPress = async (mode = 'photo', headerTitle = '写真') => {
    const { flashMode } = this.state;
    const { navigation } = this.props;

    if (mode !== 'library') {
      this.setState({
        mode,
        flashMode:
          mode === 'photo' ? flashMode : Camera.Constants.FlashMode.off,
      });

      navigation.setParams({ headerTitle });
    } else {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);

      if (status) {
        const photo = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: true,
          aspect: [1, 1],
        });

        if (!photo.cancelled) {
          navigation.push('Pub', { mode: 'photo', photo });
        }
      }
    }
  };

  render() {
    const { navigation, route } = this.props;
    navigation.setOptions({
      headerTitle: route.params?.headerTitle ?? '写真',
      headerLeft: () => (
        <IconButton
          name="md-close"
          size={28}
          onPress={() => navigation.goBack()}
        />
      ),
      headerRight: () => (
        <Button
          title="Alert"
          onPress={() => {
            alert('Alert');
          }}
        />
      ),
    });

    const {
      mode,
      hasCameraPermission,
      cameraType,
      flashMode,
      isRecording,
    } = this.state;

    if (hasCameraPermission === null) {
      return <View style={styles.container} />;
    }
    if (hasCameraPermission === false) {
      return (
        <View style={[styles.container, styles.empty]}>
          <Text font="noto-sans-bold" style={styles.emptyText}>
            カメラのアクセス権限がありません
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Camera
          style={styles.camera}
          type={cameraType}
          ratio="1:1"
          flashMode={flashMode}
          ref={(ref) => {
            this.camera = ref;
          }}
        >
          <IconButton
            name="ios-reverse-camera"
            size={36}
            color="#ccc"
            style={styles.change}
            onPress={this.onChangePress}
          />
          {cameraType === Camera.Constants.Type.back && mode === 'photo' && (
            <IconButton
              name="ios-flash"
              size={36}
              color={
                flashMode === Camera.Constants.FlashMode.on ? '#ffff00' : '#fff'
              }
              style={styles.change}
              onPress={this.onFlashPress}
            />
          )}
        </Camera>
        <View style={styles.take}>
          {mode === 'photo' && (
            <TouchableOpacity
              style={styles.takeButton}
              onPress={this.onTakePress}
            />
          )}
          {mode === 'movie' && (
            <TouchableOpacity
              style={[
                styles.takeButton,
                isRecording ? styles.takeButtonRecording : null,
              ]}
              onPress={this.onRecordPress}
            />
          )}
        </View>
        <View style={styles.tabs}>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => this.onTabPress('library', 'ライブラリ')}
          >
            <Text
              font="noto-sans-bold"
              style={[
                styles.tabText,
                mode === 'library' ? styles.tabTextActive : null,
              ]}
            >
              ライブラリ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => this.onTabPress('photo', '写真')}
          >
            <Text
              font="noto-sans-bold"
              style={[
                styles.tabText,
                mode === 'photo' ? styles.tabTextActive : null,
              ]}
            >
              写真
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tab}
            onPress={() => this.onTabPress('movie', '動画')}
          >
            <Text
              font="noto-sans-bold"
              style={[
                styles.tabText,
                mode === 'movie' ? styles.tabTextActive : null,
              ]}
            >
              動画
            </Text>
          </TouchableOpacity>
        </View>
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
    alignItems: 'center',
    fontSize: 18,
  },
  camera: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').width,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  take: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  takeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 10,
    borderColor: '#ccc',
  },
  takeButtonRecording: {
    borderRadius: 4,
    width: 40,
    height: 40,
    borderWidth: 20,
    borderColor: '#f99',
    backgroundColor: '#fff',
  },
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
  },
  tabText: {
    textAlign: 'center',
    color: '#999',
  },
  tabTextActive: {
    color: Constants.manifest.extra.textColor,
  },
});

export default function(props) {
  return <TakeScreen {...props} navigation={useNavigation()} />;
}

// export default TakeScreen;
