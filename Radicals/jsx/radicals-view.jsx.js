(function () {
    'use strict';

    var React = require('react-native'),
        ProgressViewExample = require('./progress-view.jsx.js'),
        NavigationBar = require('react-native-navbar'),
        styles = require('../stylesheets/styles.js'),
        { View, WebView } = React;

    module.exports = React.createClass({

        render: function () {
            var leftButtonConfig = {
                    title: 'Back',
                    handler: function onNext() {
                        alert('hello!');
                    }
                },
                titleConfig = {
                    title: 'Basic Characters'
                };

            return (
                <View style={styles.container}>
                    <NavigationBar
                        title={titleConfig}
                        leftButton={leftButtonConfig}
                        style={styles.navBar}/>
                    <ProgressViewExample/>
                    <WebView
                        style={styles.webView}
                        url={"writer.html"}
                    />
                </View>
            );
        }
    });
})();
