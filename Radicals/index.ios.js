/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  WebView,
  ProgressViewIOS
} = React;

var TimerMixin = require('react-timer-mixin');


var ProgressViewExample = React.createClass({
  mixins: [TimerMixin],

  getInitialState() {
    return {
      progress: 0,
    };
  },

  componentDidMount() {
    this.updateProgress();
  },

  updateProgress() {
    var progress = this.state.progress + 0.01;
    this.setState({ progress });
    this.requestAnimationFrame(() => this.updateProgress());
  },

  getProgress(offset) {
    var progress = this.state.progress + offset;
    return Math.sin(progress % Math.PI) % 1;
  },

  render() {
    return (
      <View style={styles.container}>
        <ProgressViewIOS style={styles.progressView} progressTintColor="red" progress={this.getProgress(0.4)}/>
      </View>
    );
  },
});


var Radicals = React.createClass({

  render: function() {
    return (
    <View style={styles.container}>

      <ProgressViewExample/>
      <WebView
          style={styles.webView}
          url={"writer.html"}
      />
    </View>      
    );
  }
});

var styles = StyleSheet.create({
  container: {
    marginTop: 10,
    backgroundColor: 'transparent',
  },
  progressView: {
    marginTop: 0
  },
  webView: {
    height: 412,
    width: 412
  }
});

AppRegistry.registerComponent('Radicals', () => Radicals);
