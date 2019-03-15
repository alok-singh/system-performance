import React, { Component, Fragment } from 'react';
import {
    FormControl,
    Form,
    FormGroup,
    Button,
    ControlLabel,
    TypeAheadSelect,
    Row,
    Col,
    HelpBlock,
    Card,
    CardTitle,
    CardBody,
    ToastNotification,
    ToastNotificationList,
} from 'patternfly-react'

import ArgsFieldSet from './argsFieldSet';
import { Host, Routes } from '../../config/constants';

import { CIConfigFormState, CIConfigFormProps, DockerRepository } from '../../modals/ciConfigTypes';

import DirectionalNavigation from '../common/directionalNavigation';

export default class CIConfigForm extends Component<CIConfigFormProps, CIConfigFormState> {

    constructor(props) {
        super(props);

        this.state = {
            repositoryOptions: [],
            code: 0,
            errors: [],
            successMessage: null,
            buttonLabel: "SAVE",

            form: {
                appId: null,
                dockerFilePath: "",
                tagPattern: "",
                args: [
                    {
                    key: "",
                    value: ""
                    },
                ],
                repository: "",
                dockerfile: "",
            },

            isValid: {
                dockerFilePath: false,
                tagPattern: false,
                args: false,
                repository: false,
                dockerfile: false,
            },

        };
    }

    componentDidMount = () => {
        this.getDockerRepositories();
        if (this.props.id) {
            this.getCIConfig(this.props.id);
        }
    }

    getCIConfig = (id: string) => {
        const URL = `${Host}${Routes.CI_CONFIG}/${id}`;
        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.saveResponse(response, "Found Saved CI Configuration");
                    setTimeout(() => {
                        this.closeNotification();
                    }, 2000);
                },
                (error) => {

                }
            )
    }

    saveResponse = (response, successMessage: string) => {
        let state = { ...this.state };
        state.code = response.code;
        state.errors = response.errors || [];
        if (response.result) {
            let config = response.result;
            let argsFromResponse = JSON.parse(config.dockerBuildConfig.args);
            let argsParsed = [];
            argsParsed = argsFromResponse.map(
                (element) => {
                    let key = Object.keys(element)[0];
                    return { key: key, value: element[key] };
                }
            )
            state.form = {
                appId: config.appId,
                dockerFilePath: config.dockerBuildConfig.dockerfilePath,
                tagPattern: config.dockerBuildConfig.tag,
                //TODO: UPDATE dockerfile, dockerrepository, Args
                args: argsParsed,
                repository: config.dockerBuildConfig.repository,
                dockerfile: config.dockerBuildConfig.dockerfile,
            }
            state.successMessage = successMessage;
        }
        state.buttonLabel = "UPDATE";
        this.setState(state);
        console.log(this.state.form);
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let state = { ...this.state };
        state.form[key] = e.target.value;
        this.setState(state);
    }

    handleRepositoryOptions = (e: Array<any>) => {
        let state = { ...this.state };
        if (e.length) {
            state.form.repository = e[0].registryURL;
        } else {
            state.form.repository = "";
        }
        this.setState(state);

    }

    //Clears error messages and response code
    closeNotification = () => {
        let state = { ...this.state };
        state.code = 0;
        state.successMessage = null;
        state.errors = [];
        this.setState(state);
    }
    addMoreArgs = () => {
        let state = {...this.state}
        state.form.args.push({key:"",value:""})
        this.setState(state);
    }

    isFormNotValid = () => {
        let keys = Object.keys(this.state);
        let isValid = true;
        keys.forEach(key => {
            isValid = isValid && (this.state[key].length > 0);
        });
        // return !isValid;
        return false;
    }

    saveOrUpdate = () => {
        let url, method;

        let lastIndex = this.state.form.args.length - 1;
        //Remove last element if empty
        let args = (this.state.form.args[lastIndex].key && this.state.form.args[lastIndex].value)
            ? this.state.form.args
            : this.state.form.args.slice(0, -1);


        let formattedArgs = args.map(function (element) {
            let obj = {
                [element.key]: element.value
            };
            return obj;
        });

        if (this.state.form.appId) {
            url = `${Host}${Routes.CI_CONFIG}/${this.state.form.appId}`;
            method = "PUT";
        }
        else {
            url = `${Host}${Routes.CI_CONFIG}`;
            method = "POST";
        }

        let requestBody = {
            appId: this.state.form.appId,
            beforeDockerBuild: [],
            dockerBuildConfig: {
                dockerfilePath: this.state.form.dockerFilePath,
                repository: this.state.form.repository,
                tag: this.state.form.tagPattern,
                args: JSON.stringify(formattedArgs),
                //TODO: is  dockerfile required?
                dockerfile: this.state.form.dockerfile
            },
            afterDockerBuild: [],
        }

        fetch(url, {
            method: method,
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.saveResponse(response, "CI Configuration Saved");
                    setTimeout(() => {
                        this.closeNotification();
                    }, 2000);
                },
                (error) => {

                }
            )
    }

    saveArgs = (event, key, index) => {
        let state = { ...this.state };
        state.form.args[index][key] = event.target.value;
        // state.form.args = args;
        this.setState(state);
        console.log(state)

    }

    validate = (key: string): { message: string | null, result: string | null, isValid: boolean } => {
        let length = this.state.form[key].length;

        if (length === 0) return { message: null, result: null, isValid: false };

        if (length < 2) {
            return { message: 'Too Short', result: 'error', isValid: false }
        }
        switch (key) {
            case "dockerFilePath":
                if (this.state.form.dockerFilePath.length < 10)
                    return { message: "Invalid path", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "tagPattern":
                if (this.state.form.tagPattern.length < 10)
                    return { message: "Invalid Tag Pattern", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "args":
                if (this.state.form.args.length < 1)
                    return { message: "No Args", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "repository":
                if (this.state.form.repository.length < 10)
                    return { message: "Repository Invalid", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            case "dockerfile":
                if (this.state.form.dockerfile.length < 1)
                    return { message: "Docker File Empty", result: "error", isValid: false }
                else return { message: "", result: "success", isValid: true }

            default: return { message: null, result: null, isValid: false }

        }
    }


    getDockerRepositories = () => {
        const URL = `${Host}${Routes.DOCKER_REGISTRY_CONFIG}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    let state = { ...this.state };
                    state.repositoryOptions = response.result.dockerRegistries.map((element) => {
                        return ({ id: element.id, registryURL: element.registryURL, isDefault: element.isDefault })
                    });
                    let e = state.repositoryOptions.find(element => element.isDefault);
                    state.form.repository = e ? e.registryURL : state.repositoryOptions[0].registryURL;
                    this.setState(state);
                },
                (error) => {

                }
            )


    }

    refresh = () => {

    }

    getSelectedDockerRepository = (): Array<DockerRepository> => {
        let allOptions = this.state.repositoryOptions;
        let repo = this.state.form.repository;

        let option = allOptions.find((option) => {
            return option.registryURL == repo;
        })
        // console.log(option);
        return [allOptions[0]];
    }

    renderDirectionalNavigation() {
        let steps = [{
            title: 'Step 4',
            isActive: false,
            href: '/form-setup/source-config',
            isAllowed: true
        }, {
            title: 'Step 5',
            isActive: true,
            href: '/form-setup/ci-config',
            isAllowed: true
        }, {
            title: 'Step 6',
            isActive: false,
            href: '/form-setup/deployment-template',
            isAllowed: false
        }, {
            title: 'Step 7',
            isActive: false,
            href: '/form-setup/properties-config',
            isAllowed: false
        }, {
            title: 'Step 8',
            isActive: false,
            href: '/form-setup/flow-chart',
            isAllowed: false
        }];
        return <DirectionalNavigation steps={steps} />
    }

    renderPageHeader() {
        return <Card>
            <CardTitle>
                CI Configuration
            </CardTitle>
            <CardBody>
                This is some description about CI Configuration what is required to be filled.
            </CardBody>
        </Card>
    }


    renderNotification = () => {
        if (!this.state.successMessage) return;

        let { code, errors } = { ...this.state };

        let successCodes = new Set([200, 201, 202, 204, 204, 205, 206, 207, 208, 226]);

        if (successCodes.has(code)) {
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

    render() {
        // console.log(this.state.repositoryOptions.slice(0, 1))
        return <Fragment>
            {this.renderNotification()}
            {this.renderPageHeader()}
            <div className="nav-form-wrapper">
                {this.renderDirectionalNavigation()}
                <div className="form">
                    <Form>
                        <Row>
                            <Col xs={12} lg={6}>
                                <FormGroup controlId="dockerFilePath"
                                    validationState={this.validate("dockerFilePath").result}>
                                    <ControlLabel>Docker File Path</ControlLabel>
                                    <HelpBlock className="float-right">{this.validate("dockerFilePath").message}</HelpBlock>
                                    <FormControl
                                        type="text" required
                                        value={this.state.form.dockerFilePath}
                                        placeholder="Enter Docker File Path"
                                        onChange={(event) => this.handleChange(event, 'dockerFilePath')} />
                                </FormGroup>

                                <FormGroup>
                                    <ControlLabel>Docker Repository</ControlLabel>
                                    <HelpBlock className="float-right"></HelpBlock>
                                    <Fragment>
                                        <TypeAheadSelect
                                            id="id"
                                            labelKey="registryURL"
                                            multiple={false}
                                            defaultSelected={this.state.repositoryOptions.slice(0, 1)}
                                            options={this.state.repositoryOptions}
                                            clearButton
                                            onChange={(event) => { this.handleRepositoryOptions(event) }}
                                            placeholder="Select Docker Repository..."
                                        />
                                    </Fragment>

                                </FormGroup>

                                <FormGroup controlId="tagPattern" validationState={this.validate('tagPattern').result}>
                                    <ControlLabel>Tag Pattern</ControlLabel>
                                    <HelpBlock className="float-right">{this.validate("tagPattern").message}</HelpBlock>
                                    <FormControl
                                        type="text"
                                        value={this.state.form.tagPattern}
                                        placeholder="Enter Tag Pattern"
                                        onChange={(event) => this.handleChange(event, 'tagPattern')} />
                                </FormGroup>
                                <ArgsFieldSet addMoreArgs={this.addMoreArgs} args={this.state.form.args} callbackFromCIConfig={this.saveArgs} />

                            </Col>

                            <Col xs={12} lg={6}>
                                <FormGroup
                                    controlId="text" validationState={this.validate('dockerfile').result}>
                                    <ControlLabel>Docker File</ControlLabel>
                                    <HelpBlock className="float-right">{this.validate("dockerfile").message}</HelpBlock>
                                    <FormControl
                                        height="100"
                                        disabled={true}
                                        componentClass="textarea"
                                        value={this.state.form.dockerfile}
                                        placeholder="Docker Config File"
                                        onChange={(event) => this.handleChange(event, 'dockerfile')} />
                                </FormGroup>

                                {/* <Button type="button" bsClass="align-right" bsStyle="primary" onClick={this.refresh}>
                                    Refresh
                                </Button> */}
                            </Col>
                        </Row>

                        <Button type="button" bsStyle="primary"
                            disabled={this.isFormNotValid()}
                            onClick={this.saveOrUpdate}>
                            {this.state.buttonLabel}
                        </Button>
                    </Form>
                </div>
            </div>
        </Fragment>
    }
}
