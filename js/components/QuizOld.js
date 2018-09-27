import React, { Component } from 'react'
import {
Dimensions,
StyleSheet,
View,
Text,
TouchableHighlight,
TouchableOpacity,
NativeModules
} from 'react-native'

import CharacterView from 'react-native-character-view'
const CharacterViewManager = NativeModules.RNCharacterViewManager;

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

var ActionCreators = require('../actions/ActionCreators');

var DeckStore = require('../stores/DeckStore');

var NavigationBar = require('react-native-navbar');
var ProgressBar = require('./ProgressBar');
var Question = require('./Question');

//import CharacterView from 'react-native-character-view';


var Sound = require('react-native-sound');

class Quiz extends Component {


	// This should all be in the progressBar
	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this.onLearned = this.onLearned.bind(this);
		this.onCorrect = this.onCorrect.bind(this);
		this.playRecording = this.playRecording.bind(this);
		this.onWrong = this.onWrong.bind(this);
		this.refreshQuestion = this.refreshQuestion.bind(this);
		this._animateStrokes = this._animateStrokes.bind(this);
    DeckStore.addChangeListener('quiz', this._onChange);
    DeckStore.addChangeListener('complete', this._onComplete);
		var progress = DeckStore.getProgressOfDeck(this.props.deck.name);
		this.state = {
			progress: progress
    }
  }

	componentDidMount() {
	 // Register the alert located on this master page
	 MessageBarManager.registerMessageBar(this.refs.alert);
 }

	componentWillUnmount() {
		DeckStore.removeChangeListener('quiz');
		MessageBarManager.unregisterMessageBar();
	}

	_onChange() {
		this.setState({
			progress: DeckStore.getProgressOfDeck(this.props.deck.name),
    })
	}

	_onComplete() {
		MessageBarManager.showAlert({
			title: 'Nice work!',
			message: 'You completed this section!',
			alertType: 'success',
			duration: 3000,
			viewTopInset: 10,
			stylesheetSuccess : { backgroundColor : '#007bff', strokeColor : 'transparent', opacity: 1 }, // Default are blue colors
		});
	}

  refreshQuestion() {
		var deckName = this.props.deck.name;
		var newQuestion = DeckStore.questionFromDeck(deckName)
    this.setState({
			question: newQuestion,
			showAnswer: false
		})
  }

	onCorrect() {
		var deckName = this.props.deck.name;
		var rank = this.state.question.character.rank;
		var type = this.state.question.type;
		ActionCreators.correctAnswer(deckName, rank, type);
		this.setState({
			correct: true,
			showAnswer: true,
			progress: DeckStore.getProgressOfDeck(this.props.deck.name)
		});
	}

	onWrong() {
		var deckName = this.props.deck.name;
		var rank = this.state.question.character.rank;
		var type = this.state.question.type;
		ActionCreators.incorrectAnswer(deckName, rank, type);
		this.setState({
			correct: null,
			showAnswer: true,
			progress: DeckStore.getProgressOfDeck(this.props.deck.name)
		});
	}

	onLearned() {
		var deckName = this.props.deck.name;
		var rank = this.state.question.character.rank;
		var type = this.state.question.type;
		ActionCreators.correctAnswer(deckName, rank, 'learn');
		this.refreshQuestion();
	}

  componentWillMount() {
    this.refreshQuestion();
  }

	playRecording() {
		const { rawPinyin, tone } = this.state.question.character;
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

  render() {
    var leftButtonConfig = {
      title: 'Back',
      tintColor: '#333',
      handler: () => this.props.navigator.pop()
    };

    var progress = this.state.progress;
		var color;
		if (progress < 20)
    	color = '#aaa';
    else if (progress < 80)
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
      title: this.props.deck.name,
      tintColor: '#000'
    };

		var question = this.state.question;
		var showAnswer = this.state.showAnswer;

		var main;
		var meaning = question.character.meaning;
		var character = question.character.character;
		var pinyin = question.character.pinyin;


		if (this.state.showAnswer) {
			var style = (this.state.correct) ? styles.correctAnswer : styles.wrongAnswer;
			main =
				<TouchableHighlight style={style} onPress={this.refreshQuestion}>
					<View style={style} >
						<View style={styles.meaningView}>
							<Text style={styles.meaning}>{meaning}</Text>
						</View>
						<View style={styles.characterView}>
							<Text style={styles.character}>{character}</Text>
						</View>
						<View style={styles.pinyinView}>
							<Text style={styles.pinyin}>{pinyin}</Text>
						</View>
					</View>
				</TouchableHighlight>
		}
		else {
			main = <Question
				question={question}
				onCorrect={this.onCorrect}
				onWrong={this.onWrong}
				showAnswer={showAnswer}/>
		}

    return (
      <View style={styles.quizContainer}>
				<NavigationBar
					title={titleConfig}
					leftButton={leftButtonConfig}
					rightButton={rightButtonConfig}
					tintColor={'#f5f5f5'} />
        <ProgressBar progress={progress} />
      	{main}
				<MessageBarAlert ref="alert" />
      </View>
    )
  }

	_animateStrokes() {
    CharacterViewManager.animateStrokes();
  }
}

var windowHeight = Dimensions.get('window').height;
var characterFontSize = 150;
var englishFontSize = 40;
if (windowHeight > 600) {
  characterFontSize = 250;
	englishFontSize = 50;
	characterChoiceFontSize = 40;
}

var styles = StyleSheet.create({
  quizContainer: {
    flex: 1,
    backgroundColor: '#eee',
  },

	learn: {
		flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#eee'
	},

	correctAnswer: {
		flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
		backgroundColor: '#66ff66'
	},

	wrongAnswer: {
		flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
		backgroundColor: '#ff0000'
	},

	meaningView: {
		flex: 25,
		justifyContent: 'center',
		alignItems: 'center',
		paddingHorizontal: 20
	},
	meaning: {
    fontSize: englishFontSize,
    textAlign: 'center',
    color: "#000",
	},
	characterView: {
    flex: 50,
    justifyContent: 'center',
    alignItems: 'center',
		width: Dimensions.get('window').width,
	},
	character: {
		fontFamily: "UKaiCN",
    fontSize: characterFontSize,
    color: "#000"
	},
	pinyinView: {
		flex: 25,
		justifyContent: 'center'
	},
	pinyin: {
		fontSize: englishFontSize,
    textAlign: 'center',
		color: "#000",
	},
	buttons: {
		flexDirection: 'row',
		margin: 10,
		marginBottom: 10,
	},
	buttonLeft: {
		backgroundColor: '#66ff66',
		height: 60,
		flex: 1,
		marginRight: 5,
		borderRadius: 8
	},
	buttonRight: {
		backgroundColor: '#ff6666',
		height: 60,
		flex: 1,
		marginLeft: 5,
		borderRadius: 8
	},
	buttonText: {
		lineHeight: 46,
		fontSize: 30,
		textAlign: 'center',
		alignSelf: 'center',
		flex: 1
	},
	wordView: {
    flex: 40,
    flexDirection: 'row',
    marginHorizontal: 20,
    justifyContent: 'center'
  },
})

module.exports = Quiz;
