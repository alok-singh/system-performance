import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';
import { PropertiesForm } from './propertiesForm';

interface PropertiesRouterProps {
}

interface PropertiesProps extends RouteComponentProps<PropertiesRouterProps> {

}

export default class PropertiesPage extends Component<PropertiesProps>{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <PropertiesForm></PropertiesForm>
        );
    }
}