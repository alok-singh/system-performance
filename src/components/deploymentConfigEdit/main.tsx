import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import DeploymentTemplateForm from './deploymentTemplateForm';

interface DeploymentConfigRouterProps {
    appName: string
}

interface DeploymentConfigProps extends RouteComponentProps<DeploymentConfigRouterProps> {

}

export default class DeploymentConfigEdit extends Component<DeploymentConfigProps> {
	render() {
		return <DeploymentTemplateForm />
  	}
}