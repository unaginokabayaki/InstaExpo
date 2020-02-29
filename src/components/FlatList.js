import * as React from 'react';
import { FlatList as RNFlatList, View } from 'react-native';

const defaultProps = {
  extraData: {},
  renderItem: () => {},
};

class FlatList extends React.Component {
  constructor(props) {
    super(props);

    this.viewabilityConfig = {
      minimumViewTime: 1,
      // waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 30,
      // itemVisiblePercentThreshold: 1,
    };

    this.state = {
      viewableItemIndices: [],
    };
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    // console.log(
    //   'Visible items are',
    //   viewableItems.map((item) => item.item.text)
    // );
    // console.log(
    //   'Changed in this iteration',
    //   changed.map((item) => item.item.text)
    // );
    if (viewableItems.length) {
      this.setState({
        viewableItemIndices: viewableItems.map((item) => item.index),
      });
    }
  };

  render() {
    const { viewableItemIndices } = this.state;
    const { renderItem, extraData } = this.props;
    // console.log(viewableItemIndices);
    // console.log(renderItem);

    return (
      <RNFlatList
        {...this.props}
        // renderItem={(props) => renderItem({ ...props, viewableItemIndices })}
        // extraData={{ ...extraData, viewableItemIndices }}
        viewabilityConfig={this.viewabilityConfig}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}

FlatList.defaultProps = defaultProps;

export default FlatList;
