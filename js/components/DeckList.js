import React, { Component } from 'react';

import {
  StyleSheet,
  Dimensions,
  ListView,
  TouchableHighlight,
  View,
  Text
} from 'react-native';

var DeckStore = require('../stores/DeckStore');

var ProgressBar = require('./ProgressBar');

import Icon from 'react-native-vector-icons/FontAwesome';
import NavigationBar from 'react-native-navbar';

export default class DeckList extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this._onChange = this._onChange.bind(this);
    this._renderRow = this._renderRow.bind(this)
    DeckStore.addChangeListener('decks', this._onChange);
		this.state = {
			dataSource: ds.cloneWithRows(DeckStore.getDecks())
    }
  }

  _onChange() {
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.setState({
			dataSource: ds.cloneWithRows(DeckStore.getDecks())
    })
  }

  _selectDeck(deck) {
    var deckData = this.state.dataSource.getRowData(0, deck); //super hacky
    this.props.navigator.push({
      title: deck,
      id: 'wordlist',
      passProps: {deck: deckData},
      _handleBackButtonPress: this._handleBackButtonPress
    });
  }

  _renderRow(rowData, sectionID, rowID, highlightRow) {
    var progress = DeckStore.getProgressOfDeck(rowData.name)

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

    var style = {
      color: color,
      fontSize: 30,
    }

    var progressText;
    // if (!rowData.unlocked && rowData.progress == 0)
    //   return (
    //       <View>
    //         <View style={styles.row}>
    //           <Text style={styles.lockedText}>
    //             {rowData.name}
    //           </Text>
    //           <Icon.Button
    //             color="#ccc"
    //             name="lock"
    //             size={30}
    //             backgroundColor="transparent"
    //             iconStyle={{marginRight: -8, marginTop: -4}}>
    //           </Icon.Button>
    //         </View>
    //         <ProgressBar progress={progress} />
    //       </View>
    //   )

    // Make a cell class
    return (
      <TouchableHighlight
        onPress={() => this._selectDeck(rowID) }
        underlayColor="transparent">
        <View>
          <View style={styles.row}>
            <Text style={styles.text}>
              {rowData.name}
            </Text>
            <Text style={style}>
              {progress}%
            </Text>
          </View>
          <ProgressBar progress={progress} />
        </View>
      </TouchableHighlight>
    )
  }


  render() {
    var titleConfig = {
      title: 'Radicals',
      tintColor: '#000'
    };

    return (
      <View style={styles.container}>
        <NavigationBar
          title={titleConfig}
          style={styles.navBar}
          tintColor={'#f5f5f5'}
          statusBar={{
            style: 'default',
            tintColor: NAV_BAR_COLOR
          }} />
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this._renderRow}
          showsVerticalScrollIndicator={false}
        />
      </View>
    )
  }
}

const NAV_BAR_COLOR = '#F4F4F4';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  navBar: {
    height : 70,
    backgroundColor: NAV_BAR_COLOR,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5'
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: Dimensions.get('window').height/20,
    backgroundColor: '#fff',
  },
  text: {
    flex: 1,
    fontSize: 30,
    color: '#000'
  },
  lockedText: {
    flex: 1,
    fontSize: 30,
    color: '#ccc'
  },
  rightButton: {
    // height: 60,
    marginRight: 16,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'r
  },
  rightButtonText: {
    fontSize: 40,
    fontWeight: '200',
    textAlign: 'center'
  }
});

module.exports = DeckList;
