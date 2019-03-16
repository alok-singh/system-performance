import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import AppDetails from './appDetails';
import TriggerFlow from './triggerFlow';
 
interface AppDetailsRouterProps {
    appId: string;
}

interface AppDetailstProps extends RouteComponentProps<AppDetailsRouterProps> {

}

export default class AppDetailsPage extends Component<AppDetailstProps>{
    render() {
        return <React.Fragment>
            <AppDetails appId={this.props.match.params.appId} />
            <TriggerFlow appId={this.props.match.params.appId} />
        </React.Fragment>
    }
}