import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  View,
  StatusBar,
} from 'react-native';
import TabBar from './components/TabBar.js';
import QuestionView from './components/QuestionView.js';
import Tts from 'react-native-tts';


export default class App extends Component<{}> {

  constructor(props) {
    super(props);

    // Set up speech output
    Tts.setDefaultLanguage('ru-RU');
    Tts.setDucking(true);
    Tts.addEventListener('tts-start', (event) => console.log("TTS: Start", event));
    Tts.addEventListener('tts-finish', (event) => console.log("TTS: Finish", event));
    Tts.addEventListener('tts-cancel', (event) => console.log("TTS: Cancel", event));
  }

  render() {
    return (
      <View style={styles.rootView}>
        <StatusBar backgroundColor="black" barStyle="light-content" />
        <TabBar>
          <QuestionView key='practice' mode='practice' />
          <QuestionView key='learn' mode='learn' />
          <View style={{flex:1,backgroundColor:'green'}} />
          <View style={{flex:1,backgroundColor:'blue'}} />
        </TabBar>
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
