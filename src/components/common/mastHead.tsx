import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class MasterHeader extends Component <any> {
	render() {
		return <nav className="navbar navbar-pf-vertical">
		    <div className="navbar-header">
		    	<button type="button" className="navbar-toggle collapsed" onClick={this.props.onClickLogo}>
		    		<span className="sr-only">Toggle navigation</span>
		    		<span className="icon-bar"></span>
		    		<span className="icon-bar"></span>
		    		<span className="icon-bar"></span>
		    	</button>
		    	<span className="navbar-brand">
		    		<span>
		    			<span className="navbar-brand-txt">{this.props.brandName}</span>
		    		</span>
		    	</span>
		    </div>
		</nav>
	}
}