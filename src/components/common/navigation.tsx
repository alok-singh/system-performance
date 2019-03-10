import React, { Component } from "react";
import { Link } from "react-router-dom";
import VerticalNavCustom from "./verticalNav";
import MasterHead from "./mastHead";

import { VerticalTabs } from "patternfly-react-extensions";

export default class Navigation extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            sideBarCollapsed: false
        };
    }

    onClickLogo() {
        this.setState({
            sideBarCollapsed: !this.state.sideBarCollapsed
        });
    }

    render() {
        let collpasedClassName = `container-fluid container-cards-pf container-pf-nav-pf-vertical nav-pf-persistent-secondary nav-pf-vertical-with-badges ${this.state.sideBarCollapsed ? "collapsed-nav" : ""}`
        return (
            <div style={{transform: "translateZ(0px)", height: "100vh", paddingTop: "60px"}}>
                <div className="layout-pf layout-pf-fixed faux-layout" style={{ minHeight: "0px" }}>
                    <MasterHead brandName="DevTron" onClickLogo={() => {this.onClickLogo()}} />
                    <VerticalNavCustom items={this.props.items} sideBarCollapsed={this.state.sideBarCollapsed} />
                    <div className={collpasedClassName}>
                        <div className="row row-cards-pf">{this.props.children}</div>
                    </div>
                </div>
            </div>
        );
    }
}