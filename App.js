import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import TabBar from './components/TabBar.js';
import QuestionView from './components/QuestionView.js';


export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.rootView}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <QuestionView />
        <TabBar />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  rootView: {
    flex: 1,
    backgroundColor: 'black',
    paddingTop: 20,
  },
});
