(function () {
    'use strict';

    var React = require('react-native'),
        { StyleSheet, Dimensions } = React;

    module.exports = StyleSheet.create({
        container: {
            backgroundColor: 'transparent'
        },
        progressView: {
            marginTop: 0,
            backgroundColor: 'blue'
        },
        webView: {
            height: Dimensions.get('window').height,
            width: Dimensions.get('window').width,
            backgroundColor: 'red'
        },
        navBar: {}
    });
})();
