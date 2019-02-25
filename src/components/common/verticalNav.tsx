import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class VerticalNav extends Component <any> {
	render() {
		return <div className={`nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-vertical-with-badges nav-pf-persistent-secondary ${this.props.sideBarCollapsed ? 'collapsed' : ''}`}>
			<ul className="list-group">
				{this.props.items.map((item, index) => {
					return <li key={`key-nav-${index}`} className={`list-group-item ${item.initialActive ? 'active' : ''}`}>
						<Link to={item.href}>
							<span className={item.iconClass} title={item.title}></span>
							<span className="list-group-item-value">{item.title}</span>
						</Link>
					</li>
				})}
			</ul>
		</div>
	}
}