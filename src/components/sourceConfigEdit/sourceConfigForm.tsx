import React, { Component, Fragment } from 'react';
import { 
    FormControl, 
    FormGroup, 
    ControlLabel, 
    Button, 
    Form, 
    TypeAheadSelect 
} from 'patternfly-react'

import {
    Host, 
    Routes 
} from '../../config/constants';

export interface Account {
    name: string;
    id: number;
    url: string;
}

export interface SourceConfigResponse {
    success: boolean;
    response: [];
    error: { message: string } | null;
}

export interface SourceConfigFormState {
    accountOptions: Array<Account>;

    account: Array<string>;
    url: string;
    path: string;
    appName: string;
    productionBranch: string;
    ciBranch: string
    ctBranch: string;
    gitProvider: number;
}


export default class SourceConfigForm extends Component<{}, SourceConfigFormState> {

    handlers: Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)>

    constructor(props: {}) {
        super(props);
        this.state = {
            accountOptions: [],
            account: [],
            url: "",
            path: "",
            appName: "",
            productionBranch: "",
            ciBranch: "",
            ctBranch: "",
            gitProvider: 0,

        };

        this.handlers = Object.keys(this.state)
            .reduce((map: Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)>, key: string) => {
                map.set(key, this.handleValueChange(key))
                return map
            },
                new Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)>());

    }

    componentDidMount = () => {
        this.getAccounts();
    }

    //@TODO: remove hard coding
    getAccounts = () => {
        let state = { ...this.state };

        state.accountOptions = [
            { name: "john", id: 123, url: "http://john" },
            { name: "jill", id: 22, url: "http://jill" },
            { name: "jack", id: 2, url: "http://jack" }
        ];

        this.setState(state);
    }

    handleValueChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => this.handleChange(event, key)

    handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let state = this.state;
        state[key] = e.target.value;
        this.setState(state);
    }

    handleOptions = (e: Array<any>, key: string) => {
        let newState = { ...this.state };
        if (e.length) {
            newState[key] = e.map(function (element) { return element.name });
            if (key === 'account') {
                newState.gitProvider = e[0].id;
                newState.url = e[0].url;
            }
        }
        else {
            newState[key] = "";
            if (key === 'account') {
                newState.gitProvider = 0;
                newState.url = "";
            }
        }

        this.setState(newState);

    }

    testConnection = () => {
        let URL = `${Host}${Routes.SAVE_SOURCE_CONFIG}`;
        let requestBody = {
            appName: this.state.appName,
            material: [{
                url: this.state.url,
                productionBranch: this.state.productionBranch,
                ciBranch: this.state.ciBranch,
                ctBranch: this.state.ctBranch,
                gitProviderId: this.state.gitProvider,
                path: this.state.path,
            }
            ]
        };
        console.log(URL);
        console.log(requestBody);

        fetch(URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(
                (response) => {
                    console.log(response);

                },
                (error) => {
                    console.error(error);

                }
            )
    }
    isFormValid = () => {
        let keys = Object.keys(this.state);
        let isValid = true;

        keys.forEach(key => {
            if (typeof (this.state[key]) != "number") {
                isValid = isValid && ((this.state[key].length > 0));
            }
        });
        return !isValid;
    }

    isDropDownValid = (key: string) => {
        return !!this.state[key].length;
    }

    getValidationState = (key) => {
        const length = this.state[key].length;
        if (length > 6) return 'success';
        else if (length > 3) return 'warning';
        else if (length > 0) return 'error';
        return null;
    }

    render() {

        return (
            <div className="source-config-form">
                <h1>Source Configuration</h1>
                <Form onSubmit={this.testConnection}>
                    <FormGroup>
                        <ControlLabel>Select Account</ControlLabel>
                        <Fragment>
                            <TypeAheadSelect
                                labelKey="name"
                                options={this.state.accountOptions}
                                clearButton
                                placeholder="Choose account..."
                                isValid={this.isDropDownValid('account')}
                                onChange={(event) => this.handleOptions(event, 'account')}
                            />
                        </Fragment>
                    </FormGroup>


                    <FormGroup controlId="url" validationState={this.getValidationState('url')}>
                        <ControlLabel>Git URL</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.url}
                            placeholder="Enter Git URL"
                            onChange={this.handlers.get('url')}/>
                        <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup controlId="path" validationState={this.getValidationState('path')}>
                        <ControlLabel>Path</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.path}
                            placeholder="Enter Path"
                            onChange={this.handlers.get('path')} />
                        <FormControl.Feedback />
                    </FormGroup>

                    <FormGroup
                        controlId="appName" validationState={this.getValidationState('appName')}>
                        <ControlLabel>App Name</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.appName}
                            placeholder="Enter App Name"
                            onChange={this.handlers.get('appName')} />
                    </FormGroup>

                    <FormGroup
                        controlId="productionBranch" validationState={this.getValidationState('productionBranch')}>
                        <ControlLabel>Production Branch</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.productionBranch}
                            placeholder="Enter Production Branch"
                            onChange={this.handlers.get('productionBranch')} />
                    </FormGroup>

                    <FormGroup
                        controlId="ciBranch" validationState={this.getValidationState('ciBranch')}>
                        <ControlLabel>CI Branch</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.ciBranch}
                            placeholder="Enter CI Branch"
                            onChange={this.handlers.get('ciBranch')} />
                    </FormGroup>

                    <FormGroup
                        controlId="ctBranch" validationState={this.getValidationState('ctBranch')}>
                        <ControlLabel>CT Branch</ControlLabel>
                        <FormControl
                            type="text"
                            value={this.state.ctBranch}
                            placeholder="Enter CT Branch"
                            onChange={this.handlers.get('ctBranch')} />
                    </FormGroup>


                    <Button type="button" bsStyle="primary"
                        disabled={this.isFormValid()}
                        onClick={this.testConnection}>
                        Test Connection
                    </Button>
                    <Button type="button" bsStyle="success" >Next</Button>
                </Form>
            </div>
        )
    }
}
