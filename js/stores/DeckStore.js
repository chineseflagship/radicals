var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');
var EventEmitter = require('EventEmitter');
var assign = require('object-assign');

var store = require('react-native-simple-store');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var emitter = new EventEmitter();



/* Question types:
Character - pinyin, meaning
Pinyin - character
Tone - character, choices are same pinyin, different tones
Meaning - character
*/
var DeckData = {};
store.get('decks').then((decks) => {
  if (!decks) {
    console.log('yerr')
    decks = require('./DeckData');
  }
  DeckData = decks;
  if (DeckData["Adjectives"] &&
    DeckData["Adjectives"].questions &&
    DeckData["Adjectives"].questions[0] &&
    DeckData["Adjectives"].questions[0].character == 'ㄙ') {
      DeckData["Adjectives"].questions[0].character = '厶';
  }

  if (DeckData["Adjectives"] &&
    DeckData["Adjectives"].questions &&
    DeckData["Adjectives"].questions[2] &&
    DeckData["Adjectives"].questions[2].pinyin == 'xiao3') {
      DeckData["Adjectives"].questions[2].pinyin = 'xiǎo';
  }

  if (DeckData["Adjectives"] &&
    DeckData["Adjectives"].questions &&
    DeckData["Adjectives"].questions[21] &&
    DeckData["Adjectives"].questions[21].meaning == 'Green, blue') {
      DeckData["Adjectives"].questions[21].meaning = 'green, blue';
  }

  if (DeckData["Adjectives"] &&
    DeckData["Adjectives"].questions &&
    DeckData["Adjectives"].questions[0] &&
    DeckData["Adjectives"].questions[0].tone == 4) {
      DeckData["Adjectives"].questions[0].tone = 1;
  }

  if (DeckData["Adjectives"] &&
    DeckData["Adjectives"].questions &&
    DeckData["Adjectives"].questions[11] &&
    DeckData["Adjectives"].questions[11].tone == 3) {
      DeckData["Adjectives"].questions[11].tone = 4;
      DeckData["Adjectives"].questions[11].pinyin = 'gèn';
  }

  if (DeckData["People"] &&
    DeckData["People"].questions &&
    DeckData["People"].questions[1] &&
    DeckData["People"].questions[1].character == 'ㄦ') {
      DeckData["People"].questions[1].character = '儿';
      DeckData["People"].questions[1].meaning = 'son, child';
  }

  if (DeckData["Objects"] &&
    DeckData["Objects"].questions &&
    DeckData["Objects"].questions[0]) {
      DeckData["Objects"].questions[0].character = '冖';
  }

  if (DeckData["Animals"] &&
    DeckData["Animals"].questions &&
    DeckData["Animals"].questions[8] &&
    DeckData["Animals"].questions[8].meaning == 'Snake, insects') {
      DeckData["Animals"].questions[8].character = '虫';
      DeckData["Animals"].questions[8].meaning = 'snake, insects';
  }

  if (DeckData["Strokes"] &&
    DeckData["Strokes"].questions &&
    DeckData["Strokes"].questions[4] &&
    DeckData["Strokes"].questions[4].character == '⼇') {
      DeckData["Strokes"].questions[4].character = '亠';
  }

  if (DeckData["Actions"] &&
    DeckData["Actions"].questions &&
    DeckData["Actions"].questions[8] &&
    DeckData["Actions"].questions[8].character == '攴') {
      DeckData["Actions"].questions[8].tone = 1;
  }

  if (DeckData["Spring Festival"]) {
    delete DeckData["Spring Festival"];
  }

  saveDecks()
  DeckStore.emitChange("decks");
});


// if (DeckData["Adjectives"].questions[1].character == 'ㄙ')
//   DeckData["Adjectives"].questions[1].character == '厶';

var ToneData = require('./ToneData');

function saveDecks() {
  store.save('decks', DeckData).then(() => {
    // console.log('saved decks')
  }).catch((err) => {
    //console.log(err)
  })
}


var previousCharacter;

var DeckStore = assign({}, EventEmitter.prototype, {


  emitChange: function(name) {
    emitter.emit(CHANGE_EVENT+name,);
  },

  addChangeListener: function(name, callback) {
    emitter.addListener(CHANGE_EVENT+name, callback);
  },

  removeChangeListener: function(name) {
    emitter.removeAllListeners(CHANGE_EVENT+name);
  },

  getDecks: function() {
    // Super hack right here
    var arrayOfDecks = [];
    for (var deckName in DeckData) {
      arrayOfDecks.push(DeckData[deckName])
    }
    return arrayOfDecks;
  },

  getDecksObject: function() {
    var decksMap = {};
    Object.keys(DeckData).forEach((deckName) => {
      var deck = DeckData[deckName]
      decksMap[deckName] = deck.questions;
    })
    return decksMap;
  },

  getProgressOfDeck: function(deckName) {
    var deck = DeckData[deckName];
    if (!deck) {
      return 0
    }
    var progress = deck.progress;
    return progress
  },

  // Make this more sophisticated
  questionFromDeck: function(deckName) {
    var question = {};

    var allQuestions = DeckData[deckName].questions;
    var character = allQuestions[Math.floor(Math.random() * allQuestions.length)];
    if (character == previousCharacter)
      return this.questionFromDeck(deckName);
    question.character = character;

    // if (character.new) {
    //   question.type = 'learn'
    // }
    //
    // else {
      var questionTypes = ['character', 'pinyin', 'meaning', 'tone'];
      question.type = questionTypes[Math.floor(Math.random() * questionTypes.length)]

      // Prefer unknown characters
      if (question.type == 'character' && question.character.knowsCharacter) {
        if (Math.random() < .90)
          return this.questionFromDeck(deckName);
      }
      else if (question.type == 'pinyin' && question.character.knowsPinyin) {
        if (Math.random() < .90)
          return this.questionFromDeck(deckName);
      }
      else if (question.type == 'meaning' && question.character.knowsMeaning) {
        if (Math.random() < .90)
          return this.questionFromDeck(deckName);
      }
      else if (question.type == 'tone' && question.character.knowsTone) {
        if (Math.random() < .90)
          return this.questionFromDeck(deckName);
      }

      // if (previousFive.indexOf(question.character.character) != -1)
      //   if (Math.random() < .9)
      //     return this.questionFromDeck(deckName);

      // previousFive

      // Should skip previous five? characters

      var choices = this.generateAnswersForQuestion(question, deckName);
      question.choices = choices.map(function(choice, key) {
        var correct = (choice == question.character) ? true : false;
        if (question.type == 'tone') {
          correct = (key == question.character.tone-1);
          return { text: ToneData[question.character.rawPinyin][key], correct:  correct}
        }
        return { text: choice[question.type], correct: correct }
      })
    // }
    previousCharacter = character;
    return question;
  },

  getWordsOfDeck: function(deckName) {
    // Super hack right here
    var allQuestions = DeckData[deckName].questions;
    return allQuestions;
  },

  // Returns five random answers
  generateAnswersForQuestion: function(question, deckName) {
    var choices = [];

    var random = Math.floor(Math.random()*5); //random between 0 and 4
    var chosen = {}
    var i = 0;
    while (i < 5) {

      if (i == random) {
        choices[i] = question.character;
        i++;
        continue
      }

      var allQuestions = DeckData[deckName].questions;
      var choice = allQuestions[Math.floor(Math.random() * allQuestions.length)];

      if (choice.character == question.character) {
        continue
      }

      if (choice.pinyin != question.character.pinyin && !chosen[choice.pinyin]) {
        choices[i] = choice;
        chosen[choice.pinyin] = true;
        i++;
      }
    }

    return choices;
  }
})

function _onAnswer(deckName, rank, type, correct, cb) {
  var deck = DeckData[deckName];
  var question = deck.questions[rank-1];
  if (!question) {
    //console.log("error, null question", question)
    return;
  }
  if (type == "pinyin") {
    question.knowsPinyin = correct;
  }
  if (type == "tone") {
    question.knowsTone = correct;
  }
  if (type == "meaning") {
    question.knowsMeaning = correct;
  }
  if (type == "character") {
    question.knowsCharacter = correct;
  }
  if (type == "learn") {
    if (question.new) {
      question.new = false;
    }
  }

  if (question.knowsPinyin
    && question.knowsTone
    && question.knowsMeaning
    && question.knowsCharacter) {
      question.knowsAll = true;
  }

  if (!question.knowsPinyin
    || !question.knowsTone
    || !question.knowsMeaning
    || !question.knowsCharacter) {
      question.knowsAll = false;
  }

  let known = 0;
  for (q in deck.questions) {
    if (deck.questions[q].knowsPinyin)
      known++;
    if (deck.questions[q].knowsTone)
      known++;
    if (deck.questions[q].knowsMeaning)
      known++;
    if (deck.questions[q].knowsCharacter)
      known++;
  }
  deck.progress = Math.floor(known/(deck.total*4)*100);
  deck.questions[rank-1] = question;
  DeckData[deckName] = deck;

  if (deck.progress == 100) {
    // so ridiculously hacky
    const nextRank = Object.keys(DeckData).indexOf(deckName)+1;
    const nextDeckName = Object.keys(DeckData)[nextRank];
    if (DeckData[nextDeckName] && !DeckData[nextDeckName].unlocked)
      DeckData[nextDeckName].unlocked = true;
    if (!deck.completed) {
      deck.completed = true;
      DeckStore.emitChange();
    }

  }


  saveDecks()
  cb()
};

DeckStore.dispatchToken = AppDispatcher.register(function(action) {
  switch(action.type) {
    case ActionTypes.CORRECT_ANSWER:
      var deckName = action.deckName;
      var rank = action.rank;
      var questionType = action.questionType;
      var correct = true;
      _onAnswer(deckName, rank, questionType, correct, function() {
          DeckStore.emitChange();
      })
      break;
    case ActionTypes.INCORRECT_ANSWER:
      var deckName = action.deckName;
      var rank = action.rank;
      var questionType = action.questionType;
      var correct = false;
      _onAnswer(deckName, rank, questionType, correct, function() {
          DeckStore.emitChange();
      })
      break;
    case ActionTypes.SEEN_CHARACTER:
      var deckName = action.deckName;
      var rank = action.rank;
      _onSeen(deckName, rank)
      break;

    default:
      // Do nothing.
  }
})

module.exports = DeckStore;
