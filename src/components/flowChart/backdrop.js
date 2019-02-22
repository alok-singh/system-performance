import React, { Component } from 'react';

export default class BackDrop extends Component {

    render() {
		return <rect fill="url(#circles)" fillOpacity="0.1" x="0" y="0" height="100%" width="100%"></rect>
    }
}