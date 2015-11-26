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
  ProgressViewIOS,
  Dimensions,
  Navigator
} = React;

var NavigationBar = require('react-native-navbar');

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
    var progress = this.state.progress + 0.001;
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
        <ProgressViewIOS style={styles.progressView} progressTintColor="red" progress={this.getProgress(0)}/>
      </View>
    );
  },
});


var Radicals = React.createClass({

  render: function() {
    // return (
    // <View style={styles.container}>

    //   <ProgressViewExample/>
    //   <WebView
    //       style={styles.webView}
    //       url={"writer.html"}
    //   />
    // </View>      
    // );
    var leftButtonConfig = {
      title: 'Back',
      handler: function onNext() {
        alert('hello!');
      }
    };

    var titleConfig = {
      title: 'Basic Characters',
    };

    return (
          <View style={styles.container}>
            <NavigationBar
              title={titleConfig}
              leftButton={leftButtonConfig}
              style={styles.navBar} />
            <ProgressViewExample/>
            <WebView
                style={styles.webView}
                url={"writer.html"}
            />
          </View>
        

    )
  }
});

var styles = StyleSheet.create({
  container: {
    // marginTop: 10,
    // flex: 1,
    backgroundColor: 'transparent',
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
  navBar: {
    // height: 60,
    // backgroundColor: 'red'
  }

});

AppRegistry.registerComponent('Radicals', () => Radicals);
