import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight
} from 'react-native';

var Sound = require('react-native-sound');


class Question extends Component {

  constructor(props) {
    super();
    this.playRecording = this.playRecording.bind(this);
    this.state = { playing: false }
  }

  playRecording() {
		const { rawPinyin, tone } = this.props.question.character;
		var pronounciation = new Sound(rawPinyin+tone+'.mp3', Sound.MAIN_BUNDLE, (error) => {
			if (error) {
				//console.log('failed to load the sound', rawPinyin+tone+'.mp3', error);
			} else { // loaded successfully
				if (this.state.playing) return
				this.setState({ playing: true })
				pronounciation.play((success) => {
					this.setState({ playing: false })
				});
			}
		});
	}


  // map on choices to generate touchableHighlits
  render() {
    const { character, choices, type} = this.props.question;
    const { pinyin, meaning } = character;
    const hanzi = character.character
    var onCorrect = this.props.onCorrect;
    var onWrong = this.props.onWrong;
    var choiceButtons = choices.map(function(choice, key) {

      var onPress = (choice.correct) ? onCorrect : onWrong;

      // Apply correct style per language
      var language = (type == "character") ? 'chinese' : 'english';
      var text = choice.text;

      return (
        <TouchableHighlight
          onPress={onPress}
          style={styles.choiceButton}
          key={key}
          underlayColor={'#dddddd'}
          delayPressIn={0}>
          <View style={styles.choiceView}>
            <Text style={styles[language]}>{text}</Text>
          </View>
        </TouchableHighlight>
      )
    })

    var questionText;
    if (type == "meaning" || type == "pinyin" || type == "tone")
      questionText = <Text style={styles.character}>{hanzi}</Text>
    if (type == "character")
      questionText =
        <Text style={styles.pinyin}>
          {(Math.random() < .5) ? pinyin : meaning}
        </Text>

    return (
      <View style={styles.mainView}>
        <View style={styles.questionView}>
          {questionText}
        </View>
        <View style={styles.choicesView}>
          {choiceButtons}
        </View>
      </View>
    )
  }
}


// Sort of hacky, not sure else how to do this.
var windowHeight = Dimensions.get('window').height;
var characterFontSize = 150;
var choiceFontSize = 24;
var characterChoiceFontSize = 30;
var pinyinFontSize = 60;

if (windowHeight > 600) {
  characterFontSize = 250;
  choiceFontSize = 30
  characterChoiceFontSize = 40;
}


var styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: '#fff'
  },

  questionView : {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: '#fff'
  },

  character: {
    color: '#000',
    fontFamily: "UKaiCN",
    fontSize: characterFontSize,
    // lineHeight: characterFontSize,
    textAlign: 'center',
    alignSelf: 'center',
    // flex: 1
  },

  pinyin: {
    textAlign: 'center',
    paddingTop: 10,
    color: '#000',
    fontSize: pinyinFontSize,
    lineHeight: pinyinFontSize,
    // backgroundColor: 'blue'
  },

  choicesView: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-end',
    backgroundColor: '#eee'
  },

  choiceButton: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#f3f3f3',
    borderTopWidth: 1,
    padding: 0,
    borderColor: '#d5d5d5',
    justifyContent: 'center'
  },

  choiceView: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },

  chinese : {
    // flex: 1,
    fontFamily: "UKaiCN",
    fontSize: characterChoiceFontSize,
    color: "#000",
    // textAlign: 'center'
  },

  english : {
    // flex: 1,
    flexDirection: 'column',
    fontSize: choiceFontSize,
    color: "#000",
    textAlign: 'center'
  },

  tone : {
    flex: .5,
    fontSize: 40,
    backgroundColor: 'red'
  }

});

module.exports = Question;
