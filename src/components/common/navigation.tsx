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

    // onActivateTab(id, url) {
    //     // location.href = url;
    // }

    // renderTab(id, title, url = '#', children = null, props = { shown: false }) {
    //     let childIds = React.Children.map(children, child => child.props.id);
    //     let activeTabId = this.props.activeTabId;
    //     return <VerticalTabs.Tab id={id} key={id} title={title} onActivate={() => this.onActivateTab(id, url)} active={activeTabId === id} hasActiveDescendant={activeTabId.startsWith(id)} >
    //         {children && (
    //             <VerticalTabs restrictTabs={false} activeTab={childIds.includes(activeTabId)}>
    //                 <Link to={url}>{children}</Link>
    //             </VerticalTabs>
    //         )}
    //     </VerticalTabs.Tab>
    // }

    // renderVerticalTabs() {
    //     let activeTabId = this.props.activeTabId;
    //     let classList = `nav-pf-vertical nav-pf-vertical-with-sub-menus nav-pf-vertical-with-badges nav-pf-persistent-secondary ${this.state.sideBarCollapsed ? 'collapsed' : ''}`;
    //     return (
    //         <VerticalTabs id="vertical-tabs" className={classList} activeTab={true} >
    //             {this.props.items.map(item => {
    //                 let id = item.id;
    //                 if(item.subItems) {
    //                     return this.renderTab(id, item.title, item.href, item.subItems.map(subItem => {
    //                         return this.renderTab(subItem.id, subItem.title, subItem.href);
    //                     }));
    //                 }
    //                 else{
    //                     return this.renderTab(id, item.title, item.href);
    //                 }
    //             })}
    //         </VerticalTabs>
    //     );
    // }

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