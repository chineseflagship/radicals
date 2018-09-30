import React, { Component } from 'react'
import { StyleSheet,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  Dimensions,
  NativeModules } from 'react-native';

import NavigationBar from 'react-native-navbar';
import Sound from 'react-native-sound';

import CharacterView from 'react-native-character-view-2'
const CharacterViewManager = NativeModules.RNCharacterViewManager;

import Icon from 'react-native-vector-icons/FontAwesome';

var DeckStore = require('../stores/DeckStore');
var ProgressBar = require('./ProgressBar');


class Question extends Component {
  constructor(props) {
    super(props);
    this._playRecording = this._playRecording.bind(this);
    this._onComplete = this._onComplete.bind(this);
    const { rawPinyin, tone } = this.props.question.character;
    this.sound = new Sound(rawPinyin+tone+'.mp3', Sound.MAIN_BUNDLE);
    this.state = { character: this.props.question.character, selected: null };
  }

  componentWillReceiveProps(nextProps) {
    const { rawPinyin, tone } = nextProps.question.character;
    this.sound = new Sound(rawPinyin+tone+'.mp3', Sound.MAIN_BUNDLE);
  }

  _playRecording() {
    this.sound.play();
  }

  _onComplete(event) {
    this._playRecording();
    if (event.nativeEvent.totalMistakes <= 1) {
      this.props.onCorrect();
    }
    else {
      this.props.onWrong();
    }
  }

  render() {
    const { meaning, pinyin, character } = this.state.character;
    const { deck, question, onWrong, onCorrect, showAnswer } = this.props;

    let progress = DeckStore.getProgressOfDeck(this.props.deck.name);
		let color;
    if (progress < 20)
    	color = '#aaa';
    else if (progress < 70)
    	color = '#de4e51';
		else if (progress < 90)
				color = '#fbb72f';
		else if (progress < 100)
				color = '#5ebd56';
		else
				color = '#00ee00';

    var rightButtonConfig = {
      title: progress + '%',
      tintColor: color
    };

    var titleConfig = {
      title: deck.name+' ('+character.rank+'/'+deck.total+')',
      tintColor: '#000'
    };

    let choiceButtons = question.choices.map(function(choice, key) {


      var onPress = (() => {
        if(showAnswer)
          return
        this.setState({choice: choice});
        (choice.correct) ? onCorrect() : onWrong();
        this._playRecording();
      })

      // Apply correct style for language
      var language = (question.type == "character") ? 'chinese' : 'english';

      let style = styles.choiceButton;
      if (showAnswer && choice == this.state.choice && choice.correct) {
        style = styles.correctChoiceButton
      }

      if (showAnswer && choice == this.state.choice && !choice.correct) {
        style = styles.incorrectChoiceButton
      }

      if (showAnswer) {
        return (
            <View style={style} key={key}>
              <Text style={styles[language]}>{choice.text}</Text>
            </View>
        )
      }
      return (
        <TouchableHighlight
          onPress={onPress.bind(this)}
          style={style}
          key={key}
          underlayColor={'transparent'}
          activeOpacity={1}
          delayPressIn={0}>
          <View>
            <Text style={styles[language]}>{choice.text}</Text>
          </View>
        </TouchableHighlight>
      )
    }, this)

    return (
      <View style={styles.container} >

        <View style={styles.questionView}>

        { this.props.showAnswer ?
        <Text style={{fontSize: 50, padding: 15, color:'transparent'}}>{'❮'}</Text>
        : null }
          <QuestionText
            character={question.character}
            type={question.type}
            showAnswer={showAnswer}
          />
          { this.props.showAnswer ?
          <TouchableHighlight onPress={this.props.onNext} underlayColor='transparent'>
            <Text style={{fontSize: 50, padding: 15, color:'#333'}}>{'❯'}</Text>
          </TouchableHighlight> : null
        }
        </View>

        { (question.type == 'character') ?
            <View style={styles.wordView}>
              <CharacterView
                quiz={true}
                character={question.character.character}
                ref="characterView"
                style={styles.wordView}
                onComplete={this._onComplete}
              />
            </View> :
          <View style={styles.choicesView}>
            { choiceButtons }
          </View>
        }

			</View>
    )
  }
}



const createQuestionRow = (question, i) => <QuestionText
  key={i}
  character={question.character}
  type={question.type}
   />;

class QuestionText extends Component {

  render() {
    const { character, pinyin, meaning } = this.props.character;
    const { type, showAnswer } = this.props;

    return (
      <View style={styles.meaningView}>
        { (type == 'meaning' || type == 'tone' || type == 'pinyin' || showAnswer) ?
          <Text style={styles.character}>
            { character }
          </Text> : null
        }

        {
          (showAnswer) ?
          <Text style={styles.pinyin}>
            { pinyin }
          </Text> : null
        }

        { (type == 'character' || showAnswer) ?
          <Text style={styles.meaning}>
             { meaning }
          </Text> : null
        }
      </View>
    )
  }
}

var screen = Dimensions.get('window');
const NAV_BAR_COLOR = '#F4F4F4';
const CHOICE_FONT_SIZE = 25;
const CHARACTER_CHOICE_FONT_SIZE = 30;

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
  },
  navBar: {
    backgroundColor: NAV_BAR_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  questionView: {
    backgroundColor: '#fff',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'center'
  },
  meaningView: {
    flex: 1,
    justifyContent: 'center',
  },
  wordView: {
    // flex: 1,
    borderTopWidth: 1,
    borderColor: '#e5e5e5',
    height: screen.width,
    backgroundColor: 'transparent'
  },
  character: {
    fontSize: 80,
    padding: 5,
    textAlign: 'center',
    fontFamily: 'UKaiCN',
    color: '#111111'
  },
  pinyin: {
    fontSize: 25,
    padding: 5,
    textAlign: 'center',
    color: '#555'
  },
  meaning: {
    fontSize: 25,
    padding: 5,
    textAlign: 'center',
    color: '#555'
  },
  choicesView: {
    height: screen.width,
    flexDirection: 'column',
    // alignItems: 'flex-end',
    backgroundColor: '#eee'
  },
  choiceButton: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#f4f4f4',
    borderTopWidth: 1,
    padding: 0,
    alignItems: 'center',
    borderColor: '#e5e5e5',
    justifyContent: 'center'
  },
  correctChoiceButton: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#8BF577',
    borderTopWidth: 1,
    padding: 0,
    alignItems: 'center',
    borderColor: '#e5e5e5',
    justifyContent: 'center'
  },
  incorrectChoiceButton: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#D33F3F',
    borderTopWidth: 1,
    padding: 0,
    alignItems: 'center',
    borderColor: '#e5e5e5',
    justifyContent: 'center'
  },
  chinese : {
    // flex: 1,
    fontFamily: "UKaiCN",
    fontSize: CHARACTER_CHOICE_FONT_SIZE,
    color: "#000",
    // textAlign: 'center'
  },

  english : {
    // flex: 1,
    flexDirection: 'column',
    fontSize: CHOICE_FONT_SIZE,
    color: "#111",
    textAlign: 'center'
  },
})

module.exports = Question;
