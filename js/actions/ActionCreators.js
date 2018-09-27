var AppDispatcher = require('../dispatcher/AppDispatcher');
var Constants = require('../constants/Constants');

var ActionTypes = Constants.ActionTypes;

module.exports = {

  correctAnswer: function(deckName, rank, questionType) {
    AppDispatcher.dispatch({
      type: ActionTypes.CORRECT_ANSWER,
      deckName: deckName,
      rank: rank,
      questionType: questionType
    });
  },

  incorrectAnswer: function(deckName, rank, questionType) {
    AppDispatcher.dispatch({
      type: ActionTypes.INCORRECT_ANSWER,
      deckName: deckName,
      rank: rank,
      questionType: questionType
    });
  },

  incorrectAnswer: function(deckName, rank, questionType) {
    AppDispatcher.dispatch({
      type: ActionTypes.INCORRECT_ANSWER,
      deckName: deckName,
      rank: rank,
      questionType: questionType
    });
  }

}
