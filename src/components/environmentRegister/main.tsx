import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { EnvironmentRegisterForm } from './environmentRegisterForm'

export interface EnvironmenRouterProps {
    id: string;
}

export interface EnvironmentProps extends RouteComponentProps<EnvironmenRouterProps> {

}

export default class EnvironmentRegisterPage extends Component<EnvironmentProps>{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <EnvironmentRegisterForm
                id={this.props.match.params.id}
            ></EnvironmentRegisterForm>
        );
    }
}