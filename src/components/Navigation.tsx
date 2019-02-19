import React, { Component } from 'react'
import { VerticalNav } from 'patternfly-react'

import "patternfly/dist/css/patternfly.css";
import "patternfly/dist/css/patternfly-additions.css";
import "patternfly/dist/css/rcue.css";
import "patternfly/dist/css/rcue-additions.css"
import "patternfly-react/dist/css/patternfly-react.css"


const items = [
    {
      "title": "Dashboard",
      "initialActive": true,
      "iconClass": "fa fa-dashboard",
      "subItems": [
        {
          "title": "Item 1-A",
          "iconClass": "fa fa-envelope",
          "subItems": [
            {
              "title": "Item 1-A-i",
              "iconClass": "fa fa-envelope-open"
            },
            {
              "title": "Item 1-A-ii",
              "iconClass": "fa fa-envelope-closed"
            },
            {
              "title": "Item 1-A-iii"
            }
          ]
        },
        {
          "title": "Divider 1",
          "isDivider": true
        },
        {
          "title": "Item 1-B",
          "iconClass": "fa fa-bell",
          "subItems": [
            {
              "title": "Item 1-B-i"
            },
            {
              "title": "Item 1-B-ii"
            },
            {
              "title": "Item 1-B-iii"
            }
          ]
        },
        {
          "title": "Item 1-B-2",
          "iconClass": "fa fa-bell",
          "subItems": [
            {
              "title": "Item 1-B-i"
            },
            {
              "title": "Item 1-B-ii"
            },
            {
              "title": "Item 1-B-iii"
            }
          ]
        },
        {
          "title": "Divider 2",
          "isDivider": true
        },
        {
          "title": "Item 1-D",
          "iconClass": "fa fa-bell",
          "subItems": [
            {
              "title": "Item 1-D-i"
            },
            {
              "title": "Item 1-D-ii"
            },
            {
              "title": "Item 1-D-iii"
            }
          ]
        }
      ]
    },
    {
      "title": "Dolor",
      "iconClass": "fa fa-shield",
      "badges": [
        {
          "count": 42
        }
      ]
    },
    {
      "title": "Ipsum",
      "iconClass": "fa fa-space-shuttle",
      "subItems": [
        {
          "title": "Item 3-A",
          "badges": [
            {
              "count": 9999,
              "tooltip": "Whoa, that's a lot"
            }
          ]
        },
        {
          "title": "Item 3-B (external link)",
          "href": "http://www.patternfly.org",
          "preventHref": false
        },
        {
          "title": "Item 3-C",
          "subItems": [
            {
              "title": "Item 3-C-i"
            },
            {
              "title": "Item 3-C-ii"
            },
            {
              "title": "Item 3-C-iii"
            }
          ]
        }
      ]
    },
    {
      "title": "Amet",
      "iconClass": "fa fa-paper-plane"
    },
    {
      "title": "Adipscing",
      "iconClass": "fa fa-graduation-cap"
    },
    {
      "title": "Lorem",
      "iconClass": "fa fa-gamepad"
    }
  ]


export class Navigation extends Component {

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