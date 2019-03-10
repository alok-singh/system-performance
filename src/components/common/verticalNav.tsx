import React, {Component} from 'react';
import { Link } from 'react-router-dom';

export default class VerticalNav extends Component <any> {

	render() {
		return <div className={`nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-vertical-with-badges nav-pf-persistent-secondary ${this.props.sideBarCollapsed ? 'collapsed' : ''}`}>
			<ul className="list-group">
				{this.props.items.map((item, index) => {
					return <li key={`key-nav-${index}`} className={`list-group-item ${item.initialActive ? 'active' : ''}`}>
						<a href="#">
							<span className={item.iconClass} title={item.title}></span>
							<span className="list-group-item-value">{item.title}</span>
						</a>
						{item.subItems ? <ul className={`submenu ${item.isCollapsed ? 'collapsed' : ''}`}>
							{item.subItems.map((subItem, index) => {
								return 	<li key={`key-subnav-${index}`} className={`list-group-item ${subItem.isActive ? 'active' : ''}`}>				                
				                	<Link to={subItem.href}>
				                		<span className={subItem.iconClass} title={subItem.title}></span>
				                		<span className="list-group-item-value">{subItem.title}</span>
				                	</Link>
								</li>
							})}
						</ul> : null }
					</li>
				})}
			</ul>
		</div>
	}
}