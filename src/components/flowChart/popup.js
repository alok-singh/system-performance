import React, { Component } from 'react';

export default class Popup extends Component {

    render() {
		return <div className={`popup-option ${this.props.isPopupVisible ? '' : 'u-hide'}`} style={{top: this.props.top, left: this.props.left}}>
			this is a Popup to set options
		</div>
    }
}