import React from 'react'
import { requireNativeComponent } from 'react-native';
import PropTypes from 'prop-types';

class CharacterView extends React.Component {

  // constructor(props) {
  //   super(props);
  //   this._onChange = this._onChange.bind(this);
  // }

  // _onChange(event: Event) {
  //   if (!this.props.onChangeMessage) {
  //     console.log("onchange not called?");
  //     return;
  //   }
  //   console.log("onchange called");
  //   this.props.onChangeMessage(event.nativeEvent.message);
  // }

  _onEnd = (event) => {
      if (!this.props.onEnd) {
        return;
      }
      this.props.onEnd(event.nativeEvent)
  }

  render() {
    const nativeProps = {
      ...this.props,
      onEnd: this._onEnd,
    }
    return (
      <CharacterView
      {...nativeProps}
      />
    )
  }
}

CharacterView.propTypes = {
  data: PropTypes.string,
  onEnd: PropTypes.func,
};

// var viewProps = {
//   name: 'CharacterView',
//   propTypes : {
//     data: ViewPropTypes.string//,
//     // quiz: ViewPropTypes.bool
//   }
// }

// var viewProps = {
//   name: 'CharacterView',
//   propTypes : {
//     data: PropTypes.string,
//     onChangeMessage: PropTypes.func
//     // quiz: ViewPropTypes.bool
//   }
// }

// module.exports = requireNativeComponent('CharacterView', viewProps)
module.exports = requireNativeComponent('CharacterView', CharacterView)
