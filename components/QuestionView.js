import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import Button from 'apsl-react-native-button';
import Icon from 'react-native-vector-icons/FontAwesome';
import DB from '../DB.js';
import CardView from './CardView.js';


export default class QuestionView extends Component {

  state= {
    currentWord: null,
    answerShown: false,
    sourceLanguage: 'ru',
    targetLanguage: 'en',
    textInputVisible: false,
    learnList: [],
  }

  componentWillMount() {
    // Open database connection
    this.db = new DB();

    if(this.props.mode === 'practice') {
      // Load first word
      this.nextWord();
    }
  }

  render() {
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
        <View style={styles.markAddButtonContainer}>

          <Button
            style={styles.topButton}
            onPress={this.onMarkWord}
          >
            <Icon
              name='exclamation-triangle'
              color={this.state.currentWord && this.state.currentWord.marked ? 'yellow' : "#ddd"}
              size={30}
              iconStyle={{marginRight: 0}}
            />
          </Button>

          <Text style={styles.topText}>{this.props.mode.charAt(0).toUpperCase() + this.props.mode.slice(1)}</Text>

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

        {this._getCardsContainer()}

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
            onPress={this.onCenterButton}
          >
            <Icon
              name={this.props.mode === 'practice' || this.state.learnList.length > 0 ? 'info-circle' : 'play-circle'}
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
  }

  _getCardsContainer() {
    if(this.state.currentWord) {
      return (
        <View style={styles.cardContainer}>
          <CardView ref='questionView' word={this.state.currentWord} language={this.state.sourceLanguage} hasBorder={true} />
          <CardView ref='answerView' word={this.state.currentWord} language={this.state.targetLanguage} />
        </View>
      );
    } else {
      return (
        <View style={styles.cardContainer}>
          <Text style={{color: '#ddd',fontSize: 20}}>Press play to start learning!</Text>
        </View>
      )
    }
  }

  onCenterButton = () => {
    if(this.props.mode === 'practice' || this.state.learnList.length > 0) {
      // Show the answer
      this.refs.answerView.flip();

      this.setState(previousState => {
        return { answerShown: true };
      });
    } else {
      if(this.state.learnList.length === 0) {
        // Load new words to learn
        this.db.getLearnWords((words) => {
          this.setState({ learnList: words }, ()=>{ this.nextWord() });
        })
      }
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
      if(this.props.mode === 'learn' && this.state.currentWord.level >= 3) {
        removeIndex = this.state.learnList.findIndex((word) => {
          return word.id == this.state.currentWord.id;
        });
        this.state.learnList.splice(removeIndex, 1);

        this.forceUpdate(() => {
          if (this.state.learnList.length > 0) {
            this.nextWord();
          } else {
            this.setState({
              currentWord: null,
              answerShown: false,
            });
          }
        });
      } else {
        this.nextWord();
      }
    });
  }

  nextWord = () => {
    // Turn both cards back over
    if(this.refs.questionView && this.refs.answerView) {
      this.refs.questionView.flip();
      this.refs.answerView.flip();
    }

    let applyNextWord = (word) => {
      let source_language = 'ru';
      let target_language = 'en';

      if(Math.random() > 0.5) {
        source_language = 'en';
        target_language = 'ru';
      }

      this.setState((previousState) => {
        return {
          currentWord: word,
          answerShown: false,
          sourceLanguage: source_language,
          targetLanguage: target_language,
        };
      }, () => {
        this.refs.questionView.flip();
      });
    };

    if(this.props.mode == 'practice') {
      // Get the new word
      this.db.getPracticeWord(applyNextWord);
    } else {
      nextWord = this.state.learnList[Math.floor(Math.random() * this.state.learnList.length)];
      applyNextWord(nextWord);
    }
  }
}

const styles = StyleSheet.create({
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
    display: 'flex',           /* establish flex container */
    flexDirection: 'column',  /* make main axis vertical */
    justifyContent: 'center', /* center items vertically, in this case */
    alignItems: 'center',
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
