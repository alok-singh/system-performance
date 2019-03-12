import React, { Component } from 'react';
import { Host, Routes } from '../../config/constants';

import {
    Card,
    CardTitle,
    CardBody,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Button,
    Row,
    ToastNotificationList,
    ToastNotification
} from 'patternfly-react';

export interface EnvironmentRegisterState {
    successMessage: string;
    code: number;
    errors: [],
    form: {
        name: string;
        url: string;
        authToken: string;
    }
}


export default class EnvironmentRegister extends Component<{}, EnvironmentRegisterState> {

    constructor(props) {
        super(props);
        this.state = {
            successMessage: "",
            code: 0,
            errors: [],
            form: {
                name: '',
                url: '',
                authToken: ''
            }

        }
    }

    componentDidMount = () => {
        this.getEnvironment();
    }

    getEnvironment = () => {
        const URL = `${Host}${Routes.ENVIRONMENT}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(response => {
                this.saveResponse(response, "Found Saved Environment")

                setTimeout(() => {
                    this.closeNotification();
                }, 2000);

            },
                (error) => {
                    
                }
            )
    }

    saveResponse = (response, successMessage: string): void => {
        let state = { ...this.state };
        state.code = response.code;
        state.successMessage = successMessage;
        state.errors = response.errors || [];
        if (response.result && response.result.environment) {
            state.form = response.result.environment;
        }
        else {
            state.successMessage = "";
        }
        this.setState(state);
    }

    save = (): void => {
        const URL = `${Host}${Routes.ENVIRONMENT}`;

        fetch(URL, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(this.state.form)
        })
            .then(response => response.json())
            .then(response => {
                this.saveResponse(response, "Save Successfull")

                setTimeout(() => {
                    this.closeNotification();
                }, 2000);

            },
                (error) => {

                }
            )
    }

    handleChangeInput = (value: string, key: string): void => {
        let state = { ...this.state };
        state.form[key] = value;
        this.setState(state);
    }

    closeNotification = () => {
        let state = { ...this.state };
        state.code = 0;
        state.errors = [];
        state.successMessage = "";
        this.setState(state);
    }

    isFormNotValid = (): boolean => {
        let requiredFields = ['name', 'url', 'authToken'];
        return (!requiredFields.reduce((isValid, key) => {
            return isValid && this.state.form[key].length;
        }, true));
    }

    renderNotifications() {
        let { code, errors } = this.state;
        let successCodes = new Set([200, 201, 202, 203, 204, 205, 206, 207, 208, 226]);

        if (this.state.successMessage && successCodes.has(code)) {
            return (
                <ToastNotificationList>
                    <ToastNotification type="success">
                        <span>{this.state.successMessage}</span>
                        <div className="pull-right toast-pf-action">
                            <Button bsClass="transparent"
                                onClick={this.closeNotification}>
                                <span className="fa fa-close"></span>
                            </Button>
                        </div>
                    </ToastNotification>
                </ToastNotificationList>
            )
        }
        else {
            errors.map((element) => {
                return (
                    <ToastNotificationList>
                        <ToastNotification type="error">
                            <span>Error!!!</span>
                            <div className="pull-right toast-pf-action">
                                <Button bsClass="transparent"
                                    onClick={this.closeNotification}>
                                    <span className="fa fa-close"></span>
                                </Button>
                            </div>
                        </ToastNotification>
                    </ToastNotificationList>
                )
            });
        }
    }


    renderPageTitle() {
        return (
            <Card>
                <CardTitle>
                    <Row bsClass="m-lr-0 flexbox flex-justify m-tb-20">
                        <h1 className="m-0">Environment Registration</h1>
                    </Row>
                </CardTitle>
                <CardBody>
                    This is some basic text about how to register a environment and it also describes how it will be used.
            </CardBody>
            </Card>
        )
    }

    renderForm = () => {
        return (
            <Form>
                <FormGroup controlId="name">
                    <ControlLabel>Environment Name</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.form.name}
                        placeholder="Enter Environment Name"
                        onChange={({ target }) => this.handleChangeInput(target.value, 'name')}
                    />
                </FormGroup>
                <FormGroup controlId="url">
                    <ControlLabel>URL</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.form.url}
                        placeholder="Enter Environment Name"
                        onChange={({ target }) => this.handleChangeInput(target.value, 'url')}
                    />
                </FormGroup>
                <FormGroup controlId="authToken">
                    <ControlLabel>Authentication Token</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.form.authToken}
                        placeholder="Enter Authentication Token"
                        onChange={({ target }) => this.handleChangeInput(target.value, 'authToken')}
                    />
                </FormGroup>
                <Button type="button" bsStyle="primary"
                    onClick={this.save}
                    disabled={this.isFormNotValid()}>
                    Save
                </Button>
            </Form>
        )
    }

    render() {
        return (
            <div>
                {this.renderNotifications()}
                {this.renderPageTitle()}
                <div className="w-80 margin-auto">
                    {this.renderForm()}
                </div>
            </div>
        )
    }
}