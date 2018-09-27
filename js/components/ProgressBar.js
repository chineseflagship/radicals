import React, { Component } from 'react';
import { ProgressViewIOS } from 'react-native'

class ProgressBar extends Component {

  render() {

    const { progress } = this.props;
    let color;
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

    return (
      // WARNING - MUST ADD PROGRESS BAR ANDROID
        <ProgressViewIOS
        	progressTintColor={color}
	        trackTintColor={'#eee'}
        	progress={progress/100}
        />
    );
  }
}

module.exports = ProgressBar;
