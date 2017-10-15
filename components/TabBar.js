import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class TabBar extends Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: 0
    };
  }

  render({ children } = this.props) {
    return (
      <View style={styles.container}>
        {children[this.state.activeTab]}
        <View style={styles.tabBar}>

          <Button
            style={styles.button}
            onPress={()=>{this.setState({ activeTab: 0 }) }}
          >
            <Icon
              name='refresh'
              color={this.state.activeTab == 0 ? activeColor : inactiveColor}
              size={25}
            />
          </Button>

          <Button
            style={styles.button}
            onPress={()=>{this.setState({ activeTab: 1 }) }}
          >
            <Icon
              name='lightbulb-o'
              color={this.state.activeTab == 1 ? activeColor : inactiveColor}
              size={25}
            />
          </Button>

          <Button
            style={styles.button}
            onPress={()=>{this.setState({ activeTab: 2 }) }}
          >
            <Icon
              name='bars'
              color={this.state.activeTab == 2 ? activeColor : inactiveColor}
              size={25}
            />
          </Button>

          <Button
            style={styles.button}
            onPress={()=>{this.setState({ activeTab: 3 }) }}
          >
            <Icon
              name='bar-chart'
              color={this.state.activeTab == 3 ? activeColor : inactiveColor}
              size={25}
            />
          </Button>

        </View>
      </View>
    );
  }
}

const inactiveColor = '#ccc';
const activeColor = 'rgb(0, 122, 255)';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 48,
    backgroundColor: 'transparent',
  },
  button: {
    paddingLeft: 25,
    paddingRight: 25,
  }
});
