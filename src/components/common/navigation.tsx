import React, { Component } from 'react'
import { VerticalNav } from 'patternfly-react'

const items = [{
    title: "Dashboard",
    initialActive: true,
    iconClass: "fa fa-dashboard"
}]


export default class Navigation extends Component {
    render() {
        return (
            <div style={{transform: 'translateZ(0px)', height: '100vh', paddingTop: '60px'}} >
                <div className="layout-pf layout-pf-fixed faux-layout">
                    <VerticalNav items={items} showBadges >
                        <VerticalNav.Masthead title="DevTron" />
                    </VerticalNav>
                    <div className="container-fluid container-cards-pf container-pf-nav-pf-vertical nav-pf-persistent-secondary nav-pf-vertical-with-badges">
                        <div className="row row-cards-pf">
                            {this.props.children}
                        </div>
                    </div>
                 </div>
            </div>
        );
    }
}