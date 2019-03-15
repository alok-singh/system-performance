import React, { Component } from 'react';
import DBMigrationConfigForm from './dbMigrationConfigForm';
import { DBMigrationnConfigProps } from './types';


export default class DBMigrationConfigPage extends Component<DBMigrationnConfigProps>{
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <DBMigrationConfigForm id={this.props.match.params.id}></DBMigrationConfigForm>
        );
    }
}