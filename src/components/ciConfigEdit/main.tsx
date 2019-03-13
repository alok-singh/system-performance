import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import CIConfigForm from './ciConfigForm';

interface CIConfigRouterProps {
    id: string
}

interface CIConfigProps extends RouteComponentProps<CIConfigRouterProps> {

}

export default class CIConfigEdit extends Component<CIConfigProps> {
  	render() {
    	return (
        	<CIConfigForm id={this.props.match.params.id}></CIConfigForm>
    	);
  	}
}