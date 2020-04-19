import React, { Component } from 'react'
import { StyleSheet,
  View,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
  Text,
  Dimensions,
  NativeModules } from 'react-native';

import NavigationBar from 'react-native-navbar';
import Sound from 'react-native-sound';

// import CharacterView from 'react-native-character-view-2'
// const CharacterViewManager = NativeModules.RNCharacterViewManager;

var DeckStore = require('../stores/DeckStore');
var ProgressBar = require('./ProgressBar');


class Learn extends Component {
  constructor(props) {
    super(props);
    // this._animateStrokes = this._animateStrokes.bind(this);
    this._playRecording = this._playRecording.bind(this);
    this.onScrollAnimationEnd = this.onScrollAnimationEnd.bind(this);
    const { rawPinyin, tone } = this.props.character;
    this.sound = new Sound(rawPinyin+tone+'.mp3', Sound.MAIN_BUNDLE);
    this.state = { character: this.props.character };
  }

  componentDidMount() {
    setTimeout(this._playRecording, 400);
    // setTimeout(() => { this._animateStrokes() }, 400);
    this._isMounted = true; //sort of an antipattern
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  // _animateStrokes() {
  //   CharacterViewManager.animateStrokes();
  // }

  _playRecording() {
    // this.sound.stop();
    if (this.state.playing) return
    this.setState({ playing: true })
    this.sound.play((success) => {
      if (this._isMounted)
        this.setState({ playing: false })
    });
  }

  onScrollAnimationEnd(e) {
    e.stopPropagation();
    const { contentOffset, layoutMeasurement } = e.nativeEvent;
    const i = Math.max(0, Math.floor(contentOffset.x/layoutMeasurement.width));
    if (this.props.deck.questions[i] == this.state.character)
      return;
    this.setState({
      character: this.props.deck.questions[i]
    }, () => {
      // setTimeout(() => { this._animateStrokes() }, 100);
      const { rawPinyin, tone } = this.state.character;
      this.sound = new Sound(rawPinyin+tone+'.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
        } else { // loaded successfully
          setTimeout(this._playRecording, 100);
          this._isMounted = true; //sort of an antipattern
        }
      });
    })
  }

  render() {
    const { meaning, pinyin, character } = this.state.character;

    let leftButton = <TouchableHighlight
      onPress={() => this.props.navigator.pop()}
      underlayColor={'transparent'}>
      <View style={styles.closeButton}>
          <Text style={{ fontSize: 25, color: '#333' }}>
            ✕
          </Text>
      </View>
    </TouchableHighlight>


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
    let rightButton =
    <View style={styles.percentageView}>
        <Text style={{
          color: color,
          fontSize: 16,
          fontWeight: '500',
          alignSelf: 'center'
        }}>{progress + '%'}</Text>
    </View>

    var titleConfig = {
      title: this.props.deck.name+' ('+this.state.character.rank+'/'+this.props.deck.total+')',
      tintColor: '#000'
    };

    let deck = this.props.deck;

    const offset = (this.state.character.rank-1)*screen.width;

    return (
      <View style={styles.container} >
          <NavigationBar
            title={titleConfig}
            leftButton={leftButton}
            rightButton={rightButton}
            tintColor={'#f5f5f5'}
            style={styles.navBar} />
          <ProgressBar progress={progress} />

          <ScrollView
            horizontal={true}
            contentOffset={{x: offset}}
            showsHorizontalScrollIndicator={false}
            pagingEnabled={true}
            onMomentumScrollEnd={this.onScrollAnimationEnd}
            style={styles.scrollView}>
            {deck.questions.map(createDefinitionRow)}
          </ScrollView>
          <View style={styles.wordView}>

          </View>

			</View>
    )
  }
}



const createDefinitionRow = (character, i) => <Definition key={i} character={character} />;

class Definition extends Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }

  render() {
    const { character, pinyin, meaning } = this.props.character;
    return (
      <View style={styles.meaningView}>
        <Text style={styles.character}>
          {character}
        </Text>
        <Text style={styles.pinyin}>
          {pinyin}
        </Text>
        <Text style={styles.meaning}>
          {meaning}
        </Text>
      </View>
    )
  }
}

var screen = Dimensions.get('window');
const NAV_BAR_COLOR = '#F4F4F4';

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
  scrollView: {
    backgroundColor: '#fff',
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#e5e5e5'
  },
  meaningView: {
    flex: 1,
    width: screen.width,
    justifyContent: 'center',
    backgroundColor: '#fff',
    // backgroundColor: '#ddd'
  },
  wordView: {
    height: screen.width,
    // backgroundColor: '#ddd',
    // marginVertical: 10,
  },
  character: {
    fontSize: 80,
    textAlign: 'center',
    fontFamily: 'UKaiCN',
    color: '#111111'
  },
  pinyin: {
    fontSize: 25,
    padding: 10,
    textAlign: 'center',
    color: '#555'
  },
  meaning: {
    fontSize: 25,
    textAlign: 'center',
    color: '#555'
  },
  closeButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: 44,
    flex: 1
  },
  percentageView: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10
  },
  percentage: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 22
    // width: 44,
    // flex: 1
  }
})

module.exports = Learn;
