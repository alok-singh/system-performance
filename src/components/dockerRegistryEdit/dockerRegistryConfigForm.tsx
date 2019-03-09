import React, { Component, Fragment } from 'react';
import {
    FormControl,
    FormGroup,
    ControlLabel,
    Button,
    Form,
    Row,
    Checkbox,
    HelpBlock,
    ToastNotification,
    ToastNotificationList
} from 'patternfly-react'

import {
    Host,
    Routes
} from '../../config/constants';

import { DockerRegistryConfigFormProps, DockerRegistryConfigFormState } from '../../modals/dockerRegistryTypes';

export default class DockerRegistryConfigForm extends Component<DockerRegistryConfigFormProps, DockerRegistryConfigFormState> {
    // Reference to Checkbox
    checkboxRef: any;

    constructor(props: DockerRegistryConfigFormProps) {

        super(props);
        this.state = {
            code: 0,
            successMessage: "",
            errors: [],

            buttonLabel: "SAVE",

            dockerRegistryConfig: {
                id: null,
                pluginId: "cd.go.artifact.docker.registry",
                registryURL: "",
                registryType: "ecr",
                aWSAccessKeyId: "",
                aWSSecretAccessKey: "",
                aWSRegion: "",
                username: "",
                password: "",
                isDefault: true
            },

            isValid: {
                pluginId: false,
                registryURL: false,
                registryType: false,
                aWSAccessKeyId: false,
                aWSSecretAccessKey: false,
                aWSRegion: false,
                username: false,
                password: false,
            }

        };
    }


    componentDidMount = () => {
        this.checkboxRef.checked = true;
        let id = this.props.id;
        if (id) {
            this.getDockerRegistryConfig(id);
        }
    }

    setDockerRegistryConfig = (response, successMessage: string | null) => {
        let state = { ...this.state };
        state.successMessage = successMessage;
        state.code = response.code;
        state.errors = response.errors ? response.errors : [];

        //Update Form with response
        if (response.result && response.result.dockerRegistry) {
            let keys = Object.keys(response.result.dockerRegistry);
            keys.forEach((key) => {
                state.dockerRegistryConfig[key] = response.result.dockerRegistry[key];
                state.isValid[key] = true;
            })
            if (state.dockerRegistryConfig.id) state.buttonLabel = "UPDATE";
        }

        this.checkboxRef.checked = state.dockerRegistryConfig.isDefault;
        this.setState(state);

        setTimeout(
            () => {
                this.closeNotification();
            }, 2000)
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let state = this.state;
        state.dockerRegistryConfig[key] = e.target.value;
        state.isValid[key] = this.validate(key).isValid;
        this.setState(state);
    }

    getRequiredKeys = (): Array<string> => {
        let keys: Array<string> = [];
        if (this.state.dockerRegistryConfig.registryType == "ecr") {
            keys = ["pluginId", "registryURL", "registryType", "aWSAccessKeyId", "aWSSecretAccessKey", "aWSRegion"];
        }
        else {
            keys = ["pluginId", "registryURL", "registryType", "username", "password"];
        }
        if (this.state.buttonLabel == "UPDATE")
            keys.push("id");

        return keys;
    }

    validate = (key: string): { message: string | null, result: string | null, isValid: boolean } => {
        let length = this.state.dockerRegistryConfig[key].length;

        if (length === 0) return { message: null, result: null, isValid: false };

        if (length < 2) {
            return { message: 'Too Short', result: 'error', isValid: false }
        }
        switch (key) {
            case "pluginId":
                if (this.state.dockerRegistryConfig.pluginId.length < 10)
                    return { message: "Pligin ID Invalid", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "registryURL":
                if (this.state.dockerRegistryConfig.registryURL.length < 10)
                    return { message: "Registry URL Invalid", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "aWSAccessKeyId":
                if (this.state.dockerRegistryConfig.aWSAccessKeyId.length < 10)
                    return { message: "AWS Access Key Invalid", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "aWSSecretAccessKey":
                if (this.state.dockerRegistryConfig.aWSSecretAccessKey.length < 10)
                    return { message: "AWS Secret Access Key Invalid", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "aWSRegion":
                if (this.state.dockerRegistryConfig.aWSRegion.length < 3)
                    return { message: "Invalid AWS Region", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "registryType":
                if (this.state.dockerRegistryConfig.registryType.length < 2)
                    return { message: "Username must have 8 Characters", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "username":
                if (this.state.dockerRegistryConfig.username.length < 8)
                    return { message: "Username must have 8 Characters", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "password":
                if (this.state.dockerRegistryConfig.password.length < 6)
                    return { message: "Password have 6 Characters", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            default: return { message: null, result: null, isValid: false }

        }
    }

    isFormNotValid = () => {
        let requiredFields = ["pluginId", "registryURL", "registryType"];
        let isValid = true;
        let config = this.state.dockerRegistryConfig;

        requiredFields.forEach(key => {
            isValid = isValid && this.state.isValid[key];
        });

        if (config.registryType === "ecr") {
            isValid = isValid && this.state.isValid.aWSAccessKeyId && this.state.isValid.aWSSecretAccessKey && this.state.isValid.aWSRegion;
        }
        else {
            isValid = isValid && this.state.isValid.username && this.state.isValid.password;
        }
        return !isValid;
    }

    getDockerRegistryConfig = (id: string) => {
        const URL = `${Host}${Routes.DOCKER_REGISTRY_CONFIG}/${id}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.setDockerRegistryConfig(response, "Docker Registry Found");
                },
                (error) => {

                }
            )

    }

    saveOrUpdateDockerRegistryConfig = () => {
        let url, method, successMessage;

        if (this.state.dockerRegistryConfig.id) {
            url = `${Host}${Routes.DOCKER_REGISTRY_CONFIG}/${this.state.dockerRegistryConfig.id}`;
            method = "PUT";
            successMessage = "Docker Registry Updated"
        }
        else {
            url = `${Host}${Routes.DOCKER_REGISTRY_CONFIG}`;
            method = "POST";
            successMessage = "Docker Registry Saved";
        }

        //Creating request 
        let keys = this.getRequiredKeys();
        let requestBody = {};

        for (let i = 0; i < keys.length; i++) {
            requestBody[keys[i]] = this.state.dockerRegistryConfig[keys[i]];
        }

        fetch(url, {
            method: method,
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.setDockerRegistryConfig(response, successMessage);
                },
                (error) => {

                }
            )
    }

    //Clears error messages and response code
    closeNotification = () => {
        let state = { ...this.state };
        state.successMessage = null;
        state.code = 0;
        state.errors = [];
        this.setState(state);
    }

    renderNotification = () => {
        if (!this.state.successMessage) return;

        let { code, errors } = { ...this.state };
        errors = this.state.errors;
        if (code === 200 || code === 201) {
            return (
                <ToastNotification type="success">
                    <span>{this.state.successMessage}</span>
                    <div className="pull-right toast-pf-action">
                        <Button bsClass="transparent"
                            onClick={this.closeNotification}>
                            <span className="fa fa-close"></span>
                        </Button>
                    </div>
                </ToastNotification>
            )
        }

        else if (this.state.errors.length) {
            var self = this;
            return (
                <Fragment>
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

                </Fragment>
            );

        }
    }

    renderOptionalFields = () => {
        if (this.state.dockerRegistryConfig.registryType == "ecr") {
            return (
                <Fragment>
                    <FormGroup controlId="aWSAccessKeyId" validationState={this.validate('aWSAccessKeyId').result}>
                        <ControlLabel>AWS Access Key ID</ControlLabel>
                        <HelpBlock className="float-right">{this.validate('aWSAccessKeyId').message}</HelpBlock>
                        <FormControl
                            type="text"
                            value={this.state.dockerRegistryConfig.aWSAccessKeyId}
                            placeholder="Enter AWS Access Key ID"
                            onChange={(event) => this.handleChange(event, 'aWSAccessKeyId')} />
                    </FormGroup>

                    <FormGroup controlId="aWSSecretAccessKey" validationState={this.validate('aWSSecretAccessKey').result}>
                        <ControlLabel>AWS Secret Access Key</ControlLabel>
                        <HelpBlock className="float-right">{this.validate('aWSSecretAccessKey').message}</HelpBlock>
                        <FormControl
                            type="text"
                            value={this.state.dockerRegistryConfig.aWSSecretAccessKey}
                            placeholder="Enter AWS Secret Key"
                            onChange={(event) => this.handleChange(event, 'aWSSecretAccessKey')} />
                    </FormGroup>

                    <FormGroup controlId="aWSRegion" validationState={this.validate('aWSRegion').result}>
                        <ControlLabel>AWS Region</ControlLabel>
                        <HelpBlock className="float-right">{this.validate('aWSRegion').message}</HelpBlock>
                        <FormControl
                            type="text"
                            value={this.state.dockerRegistryConfig.aWSRegion}
                            placeholder="AWS Region"
                            onChange={(event) => this.handleChange(event, 'aWSRegion')} />
                    </FormGroup>
                </Fragment>
            )
        }
        else {
            return (
                <Fragment>
                    <FormGroup controlId="username" validationState={this.validate('username').result}>
                        <ControlLabel>Username</ControlLabel>
                        <HelpBlock className="float-right">{this.validate('username').message}</HelpBlock>
                        <FormControl
                            type="text"
                            value={this.state.dockerRegistryConfig.username}
                            placeholder="Enter Username"
                            onChange={(event) => this.handleChange(event, 'username')} />
                    </FormGroup>

                    <FormGroup controlId="pwd" validationState={this.validate('password').result}>
                        <ControlLabel>Password</ControlLabel>
                        <HelpBlock className="float-right">{this.validate('password').message}</HelpBlock>
                        <FormControl
                            type="password"
                            value={this.state.dockerRegistryConfig.password}
                            placeholder="Enter Password"
                            onChange={(event) => this.handleChange(event, 'password')} />
                    </FormGroup>
                </Fragment>
            )
        }
    }

    render() {
        return (
            <div className="w-80 margin-auto">
                <Row>
                    <ToastNotificationList>
                        {this.renderNotification()}
                    </ToastNotificationList>
                </Row>

                <Row>
                    <h1>Docker Registry Configuration</h1>
                </Row>
                <Form>
                    <Row>
                        <FormGroup controlId="pluginId" validationState={this.validate('pluginId').result}>
                            <ControlLabel>Plugin ID</ControlLabel>
                            <HelpBlock className="float-right">{this.validate('pluginId').message}</HelpBlock>
                            <FormControl
                                type="text"
                                disabled={true}
                                value={this.state.dockerRegistryConfig.pluginId}
                                placeholder="Enter Plugin ID"
                                onChange={(event) => this.handleChange(event, 'pluginId')} />
                        </FormGroup>

                        <FormGroup controlId="registryUrl" validationState={this.validate('registryURL').result}>
                            <ControlLabel>Registry URL</ControlLabel>
                            <HelpBlock className="float-right">{this.validate('registryURL').message}</HelpBlock>
                            <FormControl
                                type="text"
                                value={this.state.dockerRegistryConfig.registryURL}
                                placeholder="Enter Registry URL"
                                onChange={(event) => this.handleChange(event, 'registryURL')} />
                        </FormGroup>

                        <FormGroup controlId="registryType" validationState={this.validate('registryType').result}>
                            <ControlLabel>Registry Type</ControlLabel>
                            <FormControl
                                componentClass="select"
                                value={this.state.dockerRegistryConfig.registryType}
                                onChange={(event) => this.handleChange(event, 'registryType')}
                                placeholder="Select Registry Type" >

                                <option value="ecr">ECR</option>
                                <option value="other">Other</option>
                            </FormControl>
                        </FormGroup>

                        {this.renderOptionalFields()}

                        <FormGroup controlId="isDefault">
                            <Checkbox inputRef={ref => { this.checkboxRef = ref; }}>
                                Is Default
                            </Checkbox>
                        </FormGroup>

                    </Row>

                    <Row>
                        <Button type="button" bsStyle="primary"
                            disabled={this.isFormNotValid()}
                            onClick={this.saveOrUpdateDockerRegistryConfig}>
                            {this.state.buttonLabel}
                        </Button>
                    </Row>
                </Form>

                <Row className="m-tb-20">
                    <hr></hr>
                    <span className="small-text">All fields are Mandatory</span>
                </Row>

            </div>
        )
    }
}