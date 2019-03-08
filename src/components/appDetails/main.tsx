import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import AppDetails from './appDetails';

interface AppDetailsRouterProps {
    appId: string;
}

interface AppDetailstProps extends RouteComponentProps<AppDetailsRouterProps> {

}

export default class AppDetailsPage extends Component<AppDetailstProps>{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <AppDetails appId={this.props.match.params.appId}></AppDetails>
        );
    }
}