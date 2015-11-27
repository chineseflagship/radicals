(function () {
    'use strict';

    document.onreadystatechange = function () {
        var woQuiz = new HanziWriter('wo-quiz', '能', {
            width: window.innerWidth,
            height: window.innerWidth,
            padding: 50,
            hintColor: '#EEE',
            showCharacter: false,
            showOutline: true,
            showHintAfterMisses: 1,

            charDataLoader: function (char) {
                return hanziData[char]
            }
        });
        woQuiz.quiz();
    };
})();