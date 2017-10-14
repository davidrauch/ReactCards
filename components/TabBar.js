import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';

export default class TabBar extends Component {
  render() {
    return (
      <View style={styles.tabBar}>

        <Button
          style={styles.button}
          onPress={()=>{}}
        >
          <Icon
            name='refresh'
            color='rgb(0, 122, 255)'
            size={25}
          />
        </Button>

        <Button
          style={styles.button}
          onPress={()=>{}}
        >
          <Icon
            name='lightbulb-o'
            color='#ccc'
            size={25}
          />
        </Button>

        <Button
          style={styles.button}
          onPress={()=>{}}
        >
          <Icon
            name='bars'
            color='#ccc'
            size={25}
          />
        </Button>

        <Button
          style={styles.button}
          onPress={()=>{}}
        >
          <Icon
            name='bar-chart'
            color='#ccc'
            size={25}
          />
        </Button>

      </View>
    );
  }
}

const styles = StyleSheet.create({
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
