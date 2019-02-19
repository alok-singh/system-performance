import React, { Component } from 'react';
import { Card, CardGrid, CardHeading, CardDropdownButton, CardTitle, CardBody, CardFooter, CardLink, MenuItem, Icon } from 'patternfly-react'
import { EmptyState, EmptyStateIcon, EmptyStateAction, EmptyStateInfo, Button, EmptyStateTitle } from 'patternfly-react'

import "patternfly/dist/css/patternfly.css";
import "patternfly/dist/css/patternfly-additions.css";
import "patternfly/dist/css/rcue.css";
import "patternfly/dist/css/rcue-additions.css"
import "patternfly-react/dist/css/patternfly-react.css"

class CustomCardGrid extends Component {
    render() {
        return (
            <div className="cards-pf">
            <CardGrid matchHeight>
            <CardGrid.Row style={{marginBottom: '20px',marginTop: '20px'}}>
            <CardGrid.Col xs={6} sm={4} md={4}>
            <Card matchHeight accented>
            <CardHeading>
            <CardDropdownButton id="cardDropdownButton1" title="Last 30 Days">
            <MenuItem eventKey="1" active>
            Last 30 Days
            </MenuItem>
            <MenuItem eventKey="2">
            Last 60 Days
            </MenuItem>
            <MenuItem eventKey="3">
            Last 90 Days
            </MenuItem>
            </CardDropdownButton>
            <CardTitle>
            <Icon name="shield" />
             Card Title
            </CardTitle>
            </CardHeading>
            <CardBody>
            [card contents]
            </CardBody>
            <CardFooter>
            <CardLink href="#" >
            Add New Cluster
            </CardLink>
            </CardFooter>
            </Card>
            </CardGrid.Col>
            <CardGrid.Col xs={6} sm={4} md={4}>
            <Card matchHeight accented>
            <CardTitle>
            Card Title
            </CardTitle>
            <CardBody>
            [card contents]
            </CardBody>
            <CardFooter>
            <CardDropdownButton id="cardDropdownButton1" title="Last 30 Days" >
            <MenuItem eventKey="1" active>
            Last 30 Days
            </MenuItem>
            <MenuItem eventKey="2">
            Last 60 Days
            </MenuItem>
            <MenuItem eventKey="3">
            Last 90 Days
            </MenuItem>
            </CardDropdownButton>
            <CardLink disabled>
            View CPU Events
            </CardLink>
            </CardFooter>
            </Card>
            </CardGrid.Col>
            <CardGrid.Col xs={6} sm={4} md={4}>
            <Card matchHeight>
            <CardHeading>
            <CardTitle>
            Empty Card
            </CardTitle>
            </CardHeading>
            <CardBody>
            <EmptyState>
            <EmptyStateIcon/>
            <EmptyStateTitle>
            Empty Card
            </EmptyStateTitle>
            <EmptyStateInfo>
            No Data
            </EmptyStateInfo>
            <EmptyStateAction>
            <Button bsStyle="primary" bsSize="large">
            Upload Data
            </Button>
            </EmptyStateAction>
            </EmptyState>
            </CardBody>
            </Card>
            </CardGrid.Col>
            </CardGrid.Row>
            </CardGrid>
            </div>
        );
    }
}

export default CustomCardGrid;