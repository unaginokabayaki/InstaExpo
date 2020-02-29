import * as React from 'react';
import {
  StyleSheet,
  Platform,
  View,
  // Text,
  TextInput,
  TouchableHighlight,
  SafeAreaView,
} from 'react-native';
import Constants from 'expo-constants';

import FlatList from 'app/src/components/FlatList';
import Text from 'app/src/components/Text';
import { render } from 'react-dom';

class SearchScreen extends React.Component {
  // static navigationOptions = {
  //   header: null,
  // };

  constructor(props) {
    super(props);

    this.state = {
      keyword: null,
      tags: [{ name: 'aaa' }, { name: 'bbb' }, { name: 'ccc' }],
      searching: false,
    };
  }

  onChangeText = (text) => {
    // ここに検索文字列が変化した際の処理を書きます。
  };

  onRowPress = (item) => {
    // ここにTagScreenを開く処理を記述します。
  };

  render() {
    const { keyword, tags, searching } = this.state;

    return (
      <SafeAreaView>
        <View>
          <FlatList
            data={tags}
            keyExtractor={(item) => item.name}
            ListHeaderComponent={() => (
              <View style={styles.header}>
                <TextInput
                  style={styles.search}
                  value={keyword}
                  placeholder="タグを入力して検索しましょう"
                  underlineColorAndroid="transparent"
                  onChangeText={this.onChangeText}
                  clearButtonMode="while-editing"
                />
              </View>
            )}
            renderItem={({ item }) => {
              if (searching) {
                return null;
              }
              return (
                <TouchableHighlight
                  underlayColor="rgba(0,0,0,0.1)"
                  style={styles.row}
                  onPress={() => this.onRowPress(item)}
                >
                  <Text font="noto-sans-medium" style={styles.rowText}>
                    #{item.name}
                  </Text>
                </TouchableHighlight>
              );
            }}
            ListFooterComponent={
              searching && keyword ? (
                <Text font="noto-sans-medium" style={styles.searching}>
                  #{keyword}を検索中
                </Text>
              ) : null
            }
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Constants.manifest.extra.backgroundColor,
  },
  header: {
    height: Platform.OS === 'ios' ? 44 : 56,
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: 'transparent',
    marginTop: Platform.OS === 'ios' ? 0 : 24,
  },
  search: {
    backgroundColor: '#e0e0e0',
    fontSize: 16,
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 6 : 10,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  row: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    padding: 12,
  },
  rowText: {
    fontSize: 16,
  },
  searching: {
    padding: 12,
    color: '#666',
    textAlign: 'center',
  },
});

export default SearchScreen;
