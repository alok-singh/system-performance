import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import SourceConfigForm from './sourceConfigForm';

interface SourceConfigRouterProps {
    appName: string
}

interface SourceConfigProps extends RouteComponentProps<SourceConfigRouterProps> {

}

export default class SourceConfigEdit extends Component<SourceConfigProps> {
	render() {
    	return <SourceConfigForm {...this.props.match.params}/>
  	}
}