import React, {Component} from 'react';
import {Link} from "react-router-dom";

import '../../css/directionalNavigation.css';

interface DirectionalNavigationItem {
	title: string;
	isActive: boolean;
	href: string;
	isAllowed: boolean;
}

interface DirectionalNavigationItemProps {
	steps: DirectionalNavigationItem[];
}

export default class ProgressNavigation extends Component<DirectionalNavigationItemProps, any> {

	renderBox(title, isActive, href, isAllowed) {
		return <div className={`hexagon ${isAllowed ? 'disabled' : ''} ${isActive ? 'active' : ''}`}>
			<Link to={href}>
				{title}
			</Link>
		</div>
	} 

    render() {
        return <div style={{transform: 'translateY(20px)'}}>
        	{this.props.steps.map(step => {
        		return this.renderBox(step.title, step.isActive, step.href, step.isAllowed)
        	})}
    	</div>
    }
}