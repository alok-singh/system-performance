import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import AppList from './list';

interface AppListRouterProps {
    appName: string
}

interface AppListProps extends RouteComponentProps<AppListRouterProps> {
    
}

export default class AppListPage extends Component<AppListProps>{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AppList />
        );
    }
}