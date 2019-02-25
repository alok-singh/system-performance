import React, { Component } from 'react'
import {VerticalNav} from 'patternfly-react'
import VerticalNavCustom from './verticalNav'
import MasterHead from './mastHead'

export default class Navigation extends Component <any, any> {
    constructor(props) {
        super(props);
        this.state = {
            sideBarCollapsed: false
        }
    }
    
    onClickLogo(event) {
        this.setState({
            sideBarCollapsed: !this.state.sideBarCollapsed
        });
    }
    
    render() {
        return (
            <div style={{transform: 'translateZ(0px)', height: '100vh', paddingTop: '60px'}} >
                <div className="layout-pf layout-pf-fixed faux-layout">
                    <MasterHead brandName="DevTron" onClickLogo={() => {this.onClickLogo(event)}} />
                    <VerticalNavCustom items={this.props.item} sideBarCollapsed={this.state.sideBarCollapsed} />
                    <div className={`container-fluid container-cards-pf container-pf-nav-pf-vertical nav-pf-persistent-secondary nav-pf-vertical-with-badges ${this.state.sideBarCollapsed ? 'collapsed-nav' : ''}`}>
                        <div className="row row-cards-pf">
                            {this.props.children}
                        </div>
                    </div>
                 </div>
            </div>
        );
    }
}


/*import React, { Component } from 'react'
import {VerticalNav} from 'patternfly-react'

export default class Navigation extends Component <any> {

    render() {
        return (
            <div style={{transform: 'translateZ(0px)', height: '100vh', paddingTop: '60px'}} >
                <div className="layout-pf layout-pf-fixed faux-layout">
                    <VerticalNav items={this.props.item} showBadges >
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
}*/