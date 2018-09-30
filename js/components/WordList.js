import React, {
  Component,
} from 'react';

import {
  ListView,
  View,
  Text,
  Dimensions,
  TouchableHighlight
} from 'react-native'

var DeckStore = require('../stores/DeckStore');
import NavigationBar from 'react-native-navbar';
var ProgressBar = require('./ProgressBar');
var StyleSheet = require('StyleSheet');

import ParallaxScrollView from 'react-native-parallax-scroll-view';

export default class WordList extends Component {

  constructor(props) {
    super(props);

    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2,
      sectionHeaderHasChanged: (s1, s2) => s1 !== s2
    });
    this._renderRow = this._renderRow.bind(this)

    // DeckStore.getDecksObject(this.props.deck.name)
    this.state = {
      dataSource: ds.cloneWithRows(DeckStore.getWordsOfDeck(this.props.deck.name)),
      progress: DeckStore.getProgressOfDeck(this.props.deck.name)
    }
  }

  _selectCharacter(rowData) {
    this.props.navigator.push({
      title: rowData.character,
      id: 'learn',
      passProps: {character: rowData, deck: this.props.deck},
      _handleBackButtonPress: this._handleBackButtonPress
    });
  }

  _renderRow(rowData) {

    var progressText;

    // Subclass this
    return (
      <TouchableHighlight
        onPress={() => this._selectCharacter(rowData)}>
        <View>
          <View style={styles.row}>
            <Text style={styles.character}>
              {rowData.character}
            </Text>
            <Text style={styles.meaning}>
              {rowData.meaning}
            </Text>
            <Text style={styles.pinyin}>
              {rowData.pinyin}
            </Text>
          </View>
        </View>
      </TouchableHighlight>
    )
  }

  startStudying() {
    this.props.navigator.push({
      title: this.props.deck.name,
      id: 'quiz',
      passProps: {deck: this.props.deck},
      _handleBackButtonPress: this._handleBackButtonPress
    });
  }

  render() {
    var progress = DeckStore.getProgressOfDeck(this.props.deck.name)

    var leftButtonConfig = {
      title: 'Back',
      tintColor: '#333',
      handler: () => this.props.navigator.pop()
    };

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

    const rightButtonConfig = {
      title: progress + '%',
      tintColor: color,
      // title: "Quiz",
      // tintColor: "#A463F2",
      // handler: () => this.startStudying()
    };

    var titleConfig = {
      title: this.props.deck.name,
      tintColor: '#000'
    };

    return (
      <View style={styles.container}>
        <NavigationBar
              title={titleConfig}
              leftButton={leftButtonConfig}
              rightButton = {rightButtonConfig}
              style={styles.navBar}
              tintColor={'#f5f5f5'}
              statusBar={{
                tintColor: NAV_BAR_COLOR
              }} />
            <ProgressBar progress={progress} />
            {
              <ListView
                dataSource={this.state.dataSource}
                renderRow={this._renderRow}
                initialListSize={80}
                showsVerticalScrollIndicator={false}
                scrollsToTop={false}
                renderScrollComponent={props => (
                  <ParallaxScrollView

                    style={{zIndex: -1}}
                    backgroundColor={HEADER_COLOR}
                    headerBackgroundColor={HEADER_COLOR}
                    stickyHeaderHeight={ STICKY_HEADER_HEIGHT }
                    parallaxHeaderHeight={ parallaxWindowHeight }
                    backgroundSpeed={ 10 }
                    fadeOutForeground = { false }

                    renderForeground={() => (
                      <View style={styles.titleView}>

                        <Text style={styles.infoText}>
                          {this.props.deck.total} characters, {progress}% complete
                        </Text>
                        <TouchableHighlight
                          onPress={() => this.startStudying() }
                          underlayColor={'transparent'}>
                          <Text style={styles.buttonText}>
                            Start quiz >
                          </Text>
                        </TouchableHighlight>
                      </View>
                    )}

                    renderStickyHeader={() => (
                      <View key="sticky-header" style={styles.stickySection}>
                      <TouchableHighlight
                        onPress={() => this.startStudying() }
                        underlayColor={'transparent'}>
                        <Text style={styles.buttonText}>
                          Start quiz >
                        </Text>
                      </TouchableHighlight>
                      </View>
                    )}

                    />
                )}
              />
          }
      </View>
    )
  }
}

const STICKY_HEADER_HEIGHT = 80;
const HEADER_COLOR = '#357EDD';//'#112';
const NAV_BAR_COLOR = '#F4F4F4';

var windowHeight = Dimensions.get('window').height;
var infoFontSize = 25;
var infoPadding = 20;
var parallaxWindowHeight = 160;

if (windowHeight < 600) {
  // infoFontSize = 20;
  parallaxWindowHeight = 120;
}



var styles = StyleSheet.create({
  navBar: {
    backgroundColor: NAV_BAR_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  titleView: {
    flex: 1,
    backgroundColor: HEADER_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  infoText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: infoFontSize,
    fontStyle: 'italic',
    paddingVertical: infoPadding/2,
    color: "#FFF"
  },
  buttonText: {
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: infoFontSize,
    color: "#FFFFFF",
    fontWeight: '600',
    paddingVertical: infoPadding/2
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    height: 80,
    backgroundColor: '#fff',
    paddingLeft: 20,
    paddingRight: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  character: {
    fontFamily: 'UKaiCN',
    flex: 25,
    fontSize: 50,
    color: '#111',
    alignSelf: 'center',
    textAlign: 'left',
  },
  meaning: {
    fontSize: 25,
    flex: 50,
    alignSelf: 'center',
    textAlign: 'center',
    color: '#111'
  },
  pinyin: {
    fontSize: 25,
    flex: 25,
    alignSelf: 'center',
    textAlign: 'right',
    color: '#111'
  },
  stickySection: {
    backgroundColor: HEADER_COLOR,
    // flex: 1,
    justifyContent: 'center',
    height: STICKY_HEADER_HEIGHT
  },
});
