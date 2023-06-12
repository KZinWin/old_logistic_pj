import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { bg_color } from "./common";

class Background extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: bg_color}}>
          {this.props.children}
      </View>
    );
  }
}

export default Background;
