import * as React from 'react';

interface PopupProps {
	isPopupVisible: boolean;
	top: number;
	left: number;
}

export default class Popup extends React.Component <PopupProps> {

    render() {
		return <div className={`popup-option ${this.props.isPopupVisible ? '' : 'u-hide'}`} style={{top: this.props.top, left: this.props.left}}>
			{this.props.children}
		</div>
    }
}