import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import DockerRegistryConfigForm from '../common/dockerRegistryConfigForm';

interface DockerRegistryConfigRouterProps {
    id: string
}

interface DockerRegistryConfigProps extends RouteComponentProps<DockerRegistryConfigRouterProps> {

}

export default class DockerRegistryConfigEdit extends Component<DockerRegistryConfigProps> {
	render() {
		return (
        	<DockerRegistryConfigForm id={this.props.match.params.id}/>
    	);
  	}
}