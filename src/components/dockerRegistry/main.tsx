import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { DockerRegistryList } from './dockerRegistryList';

interface DockerRegistryListRouterProps {

}

interface DockerRegistryListProps extends RouteComponentProps<DockerRegistryListRouterProps> {
    
}

export default class DockerRegistryListPage extends Component<DockerRegistryListProps>{
    render() {
        return (
            <DockerRegistryList />
        );
    }
}