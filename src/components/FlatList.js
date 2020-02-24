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
      viewAreaCoveragePercentThreshold: 0,
      // itemVisiblePercentThreshold: 0,
    };

    this.state = {
      viewableItemIndices: [],
    };
  }

  onViewableItemsChanged = ({ viewableItems, changed }) => {
    console.log('changed');
    // console.log(viewableItems);
    if (viewableItems.length) {
      this.setState({
        viewableItemIndices: viewableItems.map((item) => item.index),
      });
    }
  };

  render() {
    const { viewableItemIndices } = this.state;
    const { renderItem, extraData } = this.props;
    console.log(viewableItemIndices);
    // console.log(renderItem);

    return (
      <RNFlatList
        {...this.props}
        // renderItem={(props) => renderItem({ ...props, viewableItemIndices })}
        // extraData={{ ...extraData, viewableItemIndices }}
        // viewabilityConfig={this.viewabilityConfig}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}

FlatList.defaultProps = defaultProps;

export default FlatList;
