import React, { Component } from 'react';
import { Platform, ProgressViewIOS , ProgressBarAndroid } from 'react-native'

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


    if ( Platform.OS === 'android') {
      return (
        <ProgressBarAndroid
             styleAttr="Horizontal"
             indeterminate={false}
             color={color}
             progress={progress/100}
           />
         );
       }

    return (
      <ProgressViewIOS
           progressTintColor={color}
           trackTintColor={'#eee'}
           progress={progress/100}
         />

    );

    // return (
    //   // WARNING - MUST ADD PROGRESS BAR ANDROID
    //
    //   {
    //     ( Platform.OS === 'android' )
    //        ?
    //      ( <ProgressBarAndroid
    //        progressTintColor={color}
    //        trackTintColor={'#eee'}
    //        progress={progress/100}
    //      /> )
    //      :
    //      ( <ProgressViewIOS
    //        progressTintColor={color}
    //        trackTintColor={'#eee'}
    //        progress={progress/100}
    //      /> )
    //   }
    //
    //
    // );
  }
}

module.exports = ProgressBar;
