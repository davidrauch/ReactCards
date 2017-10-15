import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Tts from 'react-native-tts';


export default class CardView extends Component {

  constructor(props) {
    super(props);

    // Set default state
    this.state = {
      isFacingUp: false,
    };
  }

  render() {
    return(
      <View style={
        [
          styles.card,
          {
            borderColor: 'black',
            borderBottomWidth: this.props.hasBorder ? 1 : 0,
          }
        ]
      }>
        <Text style={styles.cardText}>
          {this.state.isFacingUp ? this.props.word[this.props.language] : ''}
        </Text>
        <Text style={styles.cardComment}>
          {this.state.isFacingUp ? this._generateComment() : ''}
        </Text>
      </View>
    )
  }

  _generateComment() {
    comment = []
    if(this.props.word.type) {
      comment.push(this.props.word.type);
    }
    if(this.props.word.gender) {
      genders = ['male', 'female', 'neuter'];
      comment.push(genders[this.props.word.gender-1]);
    }
    if(this.props.word.aspect) {
      aspects = ['imperfective', 'perfective'];
      comment.push(aspects[this.props.word.aspect-1]);
    }
    return comment.join(", ");
  }

  flip() {
    this.setState((previousState) => {
      return {
        isFacingUp: !previousState.isFacingUp,
      };
    }, () => {
      if(this.state.isFacingUp && this.props.language == 'ru') {
        Tts.speak(this.props.word.ru);
      }
    });
  }

}


const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    fontSize: 40,
    textAlign: 'center',
    color: '#eee'
  },
  cardComment: {
    fontSize: 20,
    textAlign: 'center',
    color: '#bbb'
  },
})
