import React, { Component, Fragment } from 'react';
import {
    FormControl,
    FormGroup,
    ControlLabel,
    Button,
    Form,
    Checkbox,
    Row,
    HelpBlock,
    ToastNotificationList,
    Card,
    CardTitle,
    CardBody,
    ToastNotification,
} from 'patternfly-react'

import {
    Host,
    Routes
} from '../../config/constants';

import { GitRepositoryConfigFormState, GitRepositoryConfigFormProps } from '../../modals/gitRepositoriesModal';

export default class GitRepositoryConfigForm extends Component<GitRepositoryConfigFormProps, GitRepositoryConfigFormState> {
    // Reference to Checkbox
    checkboxRef: any;

    constructor(props: GitRepositoryConfigFormProps) {
        super(props);

        this.state = {
            isDisabled: true,

            code: 0,
            successMessage: null,

            errors: [],

            buttonLabel: "SAVE",

            gitRepoConfig: {
                id: null,
                name: "",
                url: "",
                userName: "",
                authMode: "USERNAME_PASSWORD",
                password: "",
                sshKey: "",
                accessToken: "",
                active: true,
            },

            isValid: {
                name: false,
                url: false,
                userName: false,
                authMode: true,
                password: false,
                sshKey: false,
                accessToken: false,
            },

        };

    }

    componentDidMount = () => {
        this.checkboxRef.checked = true;
        let id = parseInt(this.props.repoId);

        if (id) {
            this.getGitRepoConfig(id);
        }
    }

    setGitRepoConfig = (response, successMessage: string | null) => {
        let state = { ...this.state };

        state.code = response.code;
        state.successMessage = successMessage;
        state.errors = response.errors ? response.errors : [];

        let keys = Object.keys(response.result.GitRepo);

        if (response.result && response.result.GitRepo) {
            keys.forEach((key) => {
                state.gitRepoConfig[key] = response.result.GitRepo[key];
                state.isValid[key] = true;
            })
        }
        if (state.gitRepoConfig.id) state.buttonLabel = "UPDATE";
        this.checkboxRef.checked = state.gitRepoConfig.active;
        this.setState(state);

        setTimeout(
            () => {
                this.closeNotification();
            }, 2000)
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let state = this.state;
        state.gitRepoConfig[key] = e.target.value;
        state.isValid[key] = this.validate(key).isValid;
        this.setState(state);
    }

    validate = (key: string): { message: string | null, result: string | null, isValid: boolean } => {
        let length = this.state.gitRepoConfig[key].length;

        if (length === 0) return { message: null, result: null, isValid: false };

        if (length < 2) {
            return { message: 'Too Short', result: 'error', isValid: false }
        }

        switch (key) {
            case "name":
                if (this.state.gitRepoConfig.name.length < 8)
                    return { message: 'Name too Short', result: 'error', isValid: false }
                else
                    return { message: null, result: "success", isValid: true };

            case "url":
                if (this.state.gitRepoConfig.url.length < 10)
                    return { message: 'URL Invalid', result: 'error', isValid: false }
                else return { message: null, result: "success", isValid: true };

            case "userName":
                if (this.state.gitRepoConfig.userName.length < 8)
                    return { message: 'Username must have 8 Characters', result: 'error', isValid: false }
                else return { message: null, result: "success", isValid: true };

            case "authMode":
                if (this.state.gitRepoConfig.authMode.length <= 0)
                    return { message: 'Select Authentication mode', result: 'error', isValid: false }
                else return { message: null, result: "success", isValid: true };

            case "password":
                if (this.state.gitRepoConfig.password.length < 6) {
                    return { message: 'Password must have 6 characters', result: 'error', isValid: false }
                }
                else {
                    return { message: null, result: "success", isValid: true };
                }

            case "accessToken":
                if (this.state.gitRepoConfig.accessToken.length < 10)
                    return { message: 'Access Token Invalid', result: 'error', isValid: false }
                else return { message: null, result: "success", isValid: true };

            case "sshKey":
                if (this.state.gitRepoConfig.sshKey.length < 7)
                    return { message: 'SSH Key Invalid', result: 'error', isValid: false }
                else return { message: null, result: "success", isValid: true };

            default: return { message: null, result: null, isValid: false }

        }
    }

    isFormNotValid = () => {
        let requiredFields = ["name", "url", "userName", "authMode"];
        let isValid = true;
        let config = this.state.gitRepoConfig;

        requiredFields.forEach(key => {
            isValid = isValid && this.state.isValid[key];
        });

        if (config.authMode === "USERNAME_PASSWORD") {
            isValid = isValid && this.state.isValid.password
        }
        else if (config.authMode === "ACCESS_TOKEN") {
            isValid = isValid && this.state.isValid.accessToken;
        }
        else {
            isValid = isValid && this.state.isValid.sshKey;
        }

        return !isValid;
    }

    getGitRepoConfig = (id: number) => {
        const URL = `${Host}${Routes.GIT_REPO_CONFIG}/${id}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.setGitRepoConfig(response, "Git Repository Found");
                },
                (error) => {

                }
            )
    }

    saveOrUpdateGitRepoConfig = () => {
        let url, method, successMessage;

        if (this.state.gitRepoConfig.id) {
            url = `${Host}${Routes.GIT_REPO_CONFIG}/${this.state.gitRepoConfig.id}`;
            method = "PUT";
            successMessage = "Git Repository Updated";
        }
        else {
            url = `${Host}${Routes.GIT_REPO_CONFIG}`;
            method = "POST";
            successMessage = "Git Repository Saved";
        }


        let optionalField = this.getDynamicKey();

        let requestBody = {
            id: this.state.gitRepoConfig.id,
            name: this.state.gitRepoConfig.name,
            url: this.state.gitRepoConfig.url,
            userName: this.state.gitRepoConfig.userName,
            authMode: this.state.gitRepoConfig.authMode,
            active: this.checkboxRef.checked,
            [optionalField]: this.state.gitRepoConfig[optionalField],
        }

        fetch(url, {
            method: method,
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.setGitRepoConfig(response, successMessage);
                },
                (error) => {

                }
            )

    }

    getDynamicKey = () => {
        let key;

        if (this.state.gitRepoConfig.authMode === "USERNAME_PASSWORD") {
            key = "password";
        }
        else if (this.state.gitRepoConfig.authMode === "ACCESS_TOKEN") {
            key = "accessToken"
        }
        else {
            key = "sshKey"
        }
        return key;
    }

    getControlLableAuthMode = () => {
        switch (this.getDynamicKey()) {
            case 'password':
                return ['Password', 'Enter Password']
            case 'accessToken':
                return ['Access Token', 'Enter Access Token']
            case 'sshKey':
                return ['SSH Key', 'Enter SSH Key']
            default:
                return ['Password', 'Enter Password']
        }
    }

    //Clears error messages and response code
    closeNotification = () => {
        let state = { ...this.state };
        state.code = 0;
        state.successMessage = null;
        state.errors = [];
        this.setState(state);
    }


    renderNotification = () => {
        if (!this.state.successMessage) return;

        let { code, errors } = { ...this.state };
        errors = this.state.errors;
        if (code === 200 || code === 201) {
            return (
                <Row>
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
                </Row>
            )
        }
        else if (this.state.errors.length) {

            var self = this;
            return <Row>
                <ToastNotificationList>
                    {this.state.errors.map(function (error, index) {
                        return (
                            <ToastNotification key={index} type="error">
                                <span>{error.userMessage}</span>
                                <div className="pull-right toast-pf-action">
                                    <Button bsClass="transparent"
                                        onClick={self.closeNotification}>
                                        <span className="fa fa-close"></span>
                                    </Button>
                                </div>
                            </ToastNotification>
                        )
                    })}
                </ToastNotificationList>
            </Row>
        }
    }

    renderPageHeader() {
        return <Card>
            <CardTitle>
                Git Repository Configuration
            </CardTitle>
            <CardBody>
                Following are the Git Repository Configurations.
            </CardBody>
        </Card>
    }

    render() {
        const label = this.getControlLableAuthMode();
        return <React.Fragment>
            {this.renderPageHeader()}
            {this.renderNotification()}
            <div className="source-config-form">
                <Form>
                    <Row>
                        <FormGroup controlId="name" validationState={this.validate('name').result}>
                            <ControlLabel>Name</ControlLabel>
                            <HelpBlock className="float-right">{this.validate("name").message}</HelpBlock>
                            <FormControl
                                type="text"
                                value={this.state.gitRepoConfig.name}
                                placeholder="Enter Name"
                                onChange={(event) => this.handleChange(event, 'name')} />
                        </FormGroup>

                        <FormGroup controlId="url" validationState={this.validate('url').result}>
                            <ControlLabel>URL</ControlLabel>
                            <HelpBlock className="float-right">{this.validate("url").message}</HelpBlock>
                            <FormControl
                                type="text"
                                value={this.state.gitRepoConfig.url}
                                placeholder="Enter url"
                                onChange={(event) => this.handleChange(event, 'url')} />
                        </FormGroup>

                        <FormGroup controlId="username" validationState={this.validate('userName').result}>
                            <ControlLabel>Username</ControlLabel>
                            <HelpBlock className="float-right">{this.validate("userName").message}</HelpBlock>
                            <FormControl
                                type="text"
                                value={this.state.gitRepoConfig.userName}
                                placeholder="Enter username"
                                onChange={(event) => this.handleChange(event, 'userName')} />
                        </FormGroup>

                        <FormGroup controlId="authMode" validationState={this.validate('authMode').result}>
                            <ControlLabel>Authentication Mode</ControlLabel>
                            <FormControl
                                componentClass="select"
                                value={this.state.gitRepoConfig.authMode}
                                onChange={(event) => this.handleChange(event, 'authMode')}
                                placeholder="Select Authentication Mode" >

                                <option value="USERNAME_PASSWORD">Username Password</option>
                                <option value="ACCESS_TOKEN">Access Token</option>
                                <option value="SSH">SSH Key</option>

                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId={this.getDynamicKey()} validationState={this.validate(this.getDynamicKey()).result}>
                            <ControlLabel>{label[0]}</ControlLabel>
                            <HelpBlock className="float-right">{this.validate(this.getDynamicKey()).message}</HelpBlock>
                            <FormControl
                                type={this.getDynamicKey() == 'password' ? 'password' : 'text'}
                                value={this.state.gitRepoConfig[this.getDynamicKey()]}
                                placeholder={label[1]}
                                onChange={(event: any) => this.handleChange(event, this.getDynamicKey())} />
                        </FormGroup>
                    </Row>

                    <Row>
                        <FormGroup controlId="isDefault" disabled={false}>
                            <Checkbox inputRef={ref => { this.checkboxRef = ref; }} >
                                Active
                                </Checkbox>
                        </FormGroup>
                        <Button type="button" bsStyle="primary"
                            disabled={this.isFormNotValid()}
                            onClick={this.saveOrUpdateGitRepoConfig}>
                            {this.state.buttonLabel}
                        </Button>
                    </Row>
                </Form>
                <Row className="m-tb-20">
                    <hr></hr>
                    <span className="small-text">All fields are Mandatory</span>
                </Row>
            </div>
        </React.Fragment>
    }
}