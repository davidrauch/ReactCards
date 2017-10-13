import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  StatusBar,
  TextInput
} from 'react-native';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import TabBar from './TabBar.js';
import DB from './DB.js';
import Tts from 'react-native-tts';


class QuestionView extends Component {

  constructor(props) {
    super(props);

    // Set default state
    this.state = {
      currentWord: null,
      answerShown: false,
      sourceLanguage: 'ru',
      targetLanguage: 'en',
      textInputVisible: false,
    };

    // Open database connection
    this.db = new DB();

    // Load first word
    this.nextWord();

    // Prepare language
    Tts.setDefaultLanguage('ru-RU');
    Tts.setDucking(true);
    Tts.addEventListener('tts-start', (event) => console.log("TTS: Start", event));
    Tts.addEventListener('tts-finish', (event) => console.log("TTS: Finish", event));
    Tts.addEventListener('tts-cancel', (event) => console.log("TTS: Cancel", event));
  }

  render() {
    if(this.state.currentWord) {

      let textInput = null;
      if(this.state.textInputVisible) {
        textInput =
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              autoFocus={true}
              autoCorrect={false}
              autoCapitalize={'none'}
              onSubmitEditing={this.onTextSubmit}
            />
          </View>
      }

      return (
        <View style={styles.questionContainer}>
          <StatusBar
             backgroundColor="black"
             barStyle="light-content"
          />

          <View style={styles.markAddButtonContainer}>

            <Button
              style={styles.topButton}
              onPress={this.onMarkWord}
            >
              <Icon
                name='exclamation-triangle'
                color={this.state.currentWord.marked ? 'yellow' : "#ddd"}
                size={30}
                iconStyle={{marginRight: 0}}
              />
            </Button>

            <Text style={styles.topText}>Cards</Text>

            <Button
              style={styles.topButton}
              onPress={this.onAddWord}
            >
              <Icon
                name='plus-circle'
                color='#ddd'
                size={30}
                iconStyle={{marginRight: 0}}
              />
            </Button>

          </View>

          {textInput}

          <View style={styles.cardContainer}>
            <View style={[styles.card, styles.questionCard]}>
              <Text style={styles.cardText}>
                {this.state.currentWord[this.state.sourceLanguage]}
              </Text>
              <Text style={styles.cardComment}>
                {this.getCommentForWord(this.state.currentWord)}
              </Text>
            </View>
            <View style={styles.card}>
              <Text style={[styles.cardText, {color: this.state.answerShown ? '#eee' : 'rgb(30, 30, 30)'}]}>
                {this.state.currentWord[this.state.targetLanguage]}
              </Text>
            </View>
          </View>

          <View style={styles.bottomButtonContainer}>

            <Button
              style={styles.bottomButton}
              isDisabled={!this.state.answerShown}
              onPress={this.onWrongAnswer}
            >
              <Icon
                name='times-circle'
                color='#da4453'
                size={40}
                iconStyle={{marginRight: 0}}
              />
            </Button>

            <Button
              style={styles.bottomButton}
              isDisabled={this.state.answerShown}
              onPress={this.onShowAnswer}
            >
              <Icon
                name='info-circle'
                color='#ddd'
                size={50}
                iconStyle={{marginRight: 0}}
              />
            </Button>

            <Button
              style={styles.bottomButton}
              isDisabled={!this.state.answerShown}
              onPress={this.onCorrectAnswer}
            >
              <Icon
                name='check-circle'
                color='#37bc9b'
                size={40}
                iconStyle={{marginRight: 0}}
              />
            </Button>
          </View>

        </View>
      );
    } else {
      return (
        <View style={styles.questionContainer}>
          <StatusBar
             backgroundColor="black"
             barStyle="light-content"
          />
        </View>
      );
    }
  }

  getCommentForWord = (word) => {
    comment = []
    if(word.type) {
      comment.push(word.type);
    }
    if(word.gender) {
      genders = ['male', 'female', 'neuter'];
      comment.push(genders[word.gender-1]);
    }
    if(word.aspect) {
      aspects = ['imperfective', 'perfective'];
      comment.push(aspects[word.aspect-1]);
    }
    return comment.join(", ");
  }

  onShowAnswer = () => {
    // Show the answer
    this.setState(previousState => {
      return { answerShown: true };
    });

    // Speak the answer if it is Russian
    if(this.state.targetLanguage == 'ru') {
      Tts.speak(this.state.currentWord.ru);
    }
  }

  onMarkWord = () => {
    this.db.markWord(this.state.currentWord, () => {
      this.state.currentWord.marked = true;
      this.forceUpdate();
    })
  }

  onAddWord = () => {
    this.setState(previousState => {
      return {
        textInputVisible: !previousState.textInputVisible,
      };
    });
  }

  onTextSubmit = (event) => {
    this.db.addWord(event.nativeEvent.text, () => {
      this.setState(previousState => {
        return {
          textInputVisible: false,
        };
      });
    });
  }

  onWrongAnswer = () => {
    this.db.registerWordWrong(this.state.currentWord, () => {
      this.nextWord();
    });
  }

  onCorrectAnswer = () => {
    this.db.registerWordCorrect(this.state.currentWord, () => {
      this.nextWord();
    });
  }

  nextWord = () => {
    this.db.getNextWord((word) => {
      let source_language = 'ru';
      let target_language = 'en';

      if(Math.random() > 0.5) {
        source_language = 'en';
        target_language = 'ru';
      }

      this.setState(previousState => {
        return {
          currentWord: word,
          answerShown: false,
          sourceLanguage: source_language,
          targetLanguage: target_language,
        };
      });

      if(this.state.sourceLanguage == 'ru') {
        Tts.speak(this.state.currentWord.ru);
      }
    });
  }
}


export default class App extends Component<{}> {
  render() {
    return (
      <View style={styles.rootView}>
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
  markAddButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'rgb(60, 60, 60)',
    borderBottomWidth: 1,
    backgroundColor: 'rgb(60, 60, 60)',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  topButton: {
    borderWidth: 0,
    backgroundColor: 'transparent',
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 0,
    marginTop: 0,
  },
  topText: {
    fontSize: 20,
    color: '#eee',
    padding: 10,
    fontWeight: '600',
    letterSpacing: .5,
  },
  textInputContainer: {
    backgroundColor: 'rgb(60, 60, 60)',
  },
  textInput: {
    height: 40,
    backgroundColor: 'rgb(20, 20, 20)',
    margin: 5,
    color: '#ddd',
    padding: 3,
    borderRadius: 10
  },
  questionContainer: {
    flex: 2,
    backgroundColor: 'black',
  },
  cardContainer: {
    flex: 1,
    backgroundColor: 'rgb(30, 30, 30)',
  },
  card: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  questionCard : {
    borderColor: 'black',
    borderBottomWidth: 1,
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
  bottomButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderColor: 'rgb(60, 60, 60)',
    borderTopWidth: 1,
    backgroundColor: 'rgb(60, 60, 60)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  bottomButton: {
    flex: 1,
    borderWidth: 0,
    backgroundColor: 'transparent',
    margin: 5,
    marginBottom: 5,
    marginTop: 5,
  },
});
