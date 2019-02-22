import React, { Component } from 'react';

export default class Defs extends Component {

    render() {
		return <defs>
		    <pattern id="circles" patternUnits="userSpaceOnUse" width="20" height="20">
		    	<rect width='10' height='10' fill='#fff' />
		    	<circle cx="1" cy="1" r="1" fill="#000"/>
		    </pattern>
		</defs>
    }
}