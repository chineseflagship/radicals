(function () {
    'use strict';

    var React = require('react-native'),
        TimerMixin = require('react-timer-mixin'),
        styles = require('../stylesheets/styles.js'),
        { View, ProgressViewIOS } = React;

    module.exports = React.createClass({
        mixins: [TimerMixin],

        getInitialState() {
            return {
                progress: 0
            };
        },

        componentDidMount() {
            this.updateProgress();
        },

        updateProgress() {
            var progress = this.state.progress + 0.001;
            this.setState({progress});
            this.requestAnimationFrame(() => this.updateProgress());
        },

        getProgress(offset) {
            var progress = this.state.progress + offset;
            return Math.sin(progress % Math.PI) % 1;
        },

        render() {
            return (
                <View style={styles.container}>
                    <ProgressViewIOS style={styles.progressView} progressTintColor="red"
                                     progress={this.getProgress(0)}/>
                </View>
            );
        }
    });
})();
