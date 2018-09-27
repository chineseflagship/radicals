import React, { Component } from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { Navigator } from "react-native-deprecated-custom-components"

import DeckList from './DeckList';
import Quiz from './Quiz';
import WordList from './WordList';
import Learn from './Learn';

class App extends Component {
  renderScene(route, nav) {
    switch (route.id) {
      case 'decks':
        return <DeckList navigator={nav} />;
      case 'quiz':
        var deck = route.passProps.deck;
        return <Quiz navigator={nav} deck={deck} />;
      case 'wordlist':
        var deck = route.passProps.deck;
        return <WordList navigator={nav} deck={deck} />;
      case 'learn':
        var character = route.passProps.character;
        var deck = route.passProps.deck;
        return <Learn navigator={nav} character={character} deck={deck}/>;
      default:
        return <DeckList navigator={nav} />;
    }
  }

  render() {
    StatusBar.setBarStyle('light-content');
    return (
      <Navigator
        initialRoute={{ name: 'Decks', index: 0, id: 'decks' }}
        renderScene={this.renderScene}
        configureScene = {(route) => {
          if (route.id == 'learn')
            return Navigator.SceneConfigs.FloatFromBottom
          return Navigator.SceneConfigs.PushFromRight
        }}
      />
    )
  }
}

module.exports = App;
