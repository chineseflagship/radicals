import React, { Component } from 'react'
import {
Dimensions,
StyleSheet,
View,
Text,
TouchableOpacity,
NativeModules
} from 'react-native'

import CharacterView from 'react-native-character-view'
const CharacterViewManager = NativeModules.RNCharacterViewManager;

var MessageBarAlert = require('react-native-message-bar').MessageBar;
var MessageBarManager = require('react-native-message-bar').MessageBarManager;

var ActionCreators = require('../actions/ActionCreators');

var DeckStore = require('../stores/DeckStore');

import NavigationBar from 'react-native-navbar';
var ProgressBar = require('./ProgressBar');
var Question = require('./Question');

//import CharacterView from 'react-native-character-view';


var Sound = require('react-native-sound');

class Quiz extends Component {


	// This should all be in the progressBar
	constructor(props) {
		super(props);
		this._onChange = this._onChange.bind(this);
		this.onCorrect = this.onCorrect.bind(this);
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

  componentWillMount() {
    this.refreshQuestion();
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
      title: this.props.deck.name,
      tintColor: '#000'
    };

		const {question, showAnswer } = this.state;
		const { meaning, character, pinyin } = question.character;

    return (
      <View style={styles.quizContainer}>
				<NavigationBar
					title={titleConfig}
					leftButton={leftButtonConfig}
					rightButton={rightButtonConfig}
					style={styles.navBar}
					activeOpacity={1}
					statusBar={{
						tintColor: NAV_BAR_COLOR
					}} />
        <ProgressBar progress={progress} />

				<View style={{flex: 1}}>
					<Question
						question={question}
						deck={this.props.deck}
						onCorrect={this.onCorrect}
						onWrong={this.onWrong}
						onNext={this.refreshQuestion}
						showAnswer={showAnswer}/>
						</View>

				<MessageBarAlert ref="alert" />
      </View>
    )
  }

	_animateStrokes() {
    CharacterViewManager.animateStrokes();
  }
}

const NAV_BAR_COLOR = '#F4F4F4';

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
	navBar: {
		backgroundColor: NAV_BAR_COLOR,
		borderBottomWidth: 1,
		borderBottomColor: '#eee'
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
