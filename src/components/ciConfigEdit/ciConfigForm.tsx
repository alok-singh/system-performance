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
    HelpBlock 
} from 'patternfly-react'

import ArgsFieldSet from './argsFieldSet';
import {Host, Routes } from '../config/constants';

// import {Form} from 'react-bootstrap';

export interface CIConfigResponse {
    success: boolean;
    response: any[];
    error: { message: string } | null;
}

export interface DockerRepository {
    id: string;
    registryUrl: string;
    isDefault: boolean;
}

export interface CIConfigFormState {
    repositoryOptions: Array<DockerRepository>;

    form: {
        dockerFilePath: string;
        tagPattern: string;
        args: Array<{ key: string, value: string }>;
        repository: string;
        dockerfile: string;
    }

    validation: {
        dockerFilePath: string;
        tagPattern: string;
        args: string;
        repository: string;
        dockerfile: string;
    }
}

export default class CIConfigForm extends Component<{}, CIConfigFormState> {

    constructor(props) {
        super(props);

        this.state = {
            repositoryOptions: [],

            form: {
                dockerFilePath: "",
                tagPattern: "",
                args: [],
                repository: "",
                dockerfile: "",
            },

            validation: {
                dockerFilePath: "",
                tagPattern: "",
                args: "",
                repository: "",
                dockerfile: "",
            }

        };

    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let state = { ...this.state };
        state.form[key] = e.target.value;
        state.validation[key] = this.validate(key).message;
        this.setState(state);
    }

    handleRepositoryOptions = (e: Array<any>) => {
        let state = { ...this.state };
        if (e.length) {
            state.form.repository = e[0].registryUrl;
        } else {
            state.form.repository = "";
        }
        this.setState(state);

    }

    isFormValid = () => {
        let keys = Object.keys(this.state);
        let isValid = true;
        keys.forEach(key => {
            isValid = isValid && (this.state[key].length > 0);
        });
        return !isValid;
    }

    save = () => {
        let lastIndex = this.state.form.args.length - 1;
        //Remove last element if empty
        let args = (this.state.form.args[lastIndex].key && this.state.form.args[lastIndex].value)
            ? this.state.form.args
            : this.state.form.args.slice(0, -1);

        const URL = `${Host}${Routes.SAVE_CI}`;

        let formattedArgs = args.map(function (element) {
            let obj = {
                [element.key]: element.value
            };
            return obj;
        });

        //@TODO: UPDATE APPID
        let requestBody = {
            appId: 41,
            beforeDockerBuild: [],
            dockerBuildConfig: {
                dockerfilePath: this.state.form.dockerFilePath,
                repository: this.state.form.repository,
                tag: this.state.form.tagPattern,
                args: JSON.stringify(formattedArgs),
            },
            afterDockerBuild: [],
        }
        console.log(URL, requestBody);

        fetch(URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(
                (response) => {
                    console.log(response)
                },
                (error) => {

                }
            )
    }

    saveArgs = (args: Array<{ key: string, value: string }>) => {
        let state = { ...this.state };
        state.form.args = args;
        this.setState(state);
    }

    validate = (key: string): { message: string | null, result: string | null } => {
        let length = this.state.form[key].length;
        let state = { ...this.state };
        if (length > 6) {
            return { message: 'Looks Good', result: 'success' }
        }
        else if (length > 3) {
            return { message: 'InvalidW', result: 'warning' }
        }
        else if (length > 0) {
            return { message: 'Invalid', result: 'error' }
        };
        return { message: null, result: null }
    }

    getValidationState = (key: string): string | null => {
        return this.validate(key).result
    }


    isDropDownValid = (key: string) => {
        let state = { ...this.state };
        if (state.form[key].length <= 0)
            state.validation[key] = "Select Repository";
        else state.validation[key] = "";

        return !!this.state.form[key].length;
    }

    // @TODO: remove hard coding
    getDockerRepositories = () => {
        const URL = `${Host}${Routes.GET_DOCKER_REPOSITORY}`;

        // fetch(URL, {
        //     method: 'GET',
        //     headers: { 'Content-type': 'application/json' },
        // })
        //     .then(response => response.json())
        //     .then(
        //         (response) => {
        //             console.log(response)

        //         },
        //         (error) => {

        //         }
        //     )

        let state = { ...this.state };

        state.repositoryOptions = [
            { id: "ecr-a", registryUrl: "https://djdf.com", isDefault: false },
            { id: "ecr-ammm", registryUrl: "https://djdfkk.com", isDefault: true }
        ];

        let e = state.repositoryOptions.find(element => element.isDefault);
        state.form.repository = e ? e.registryUrl : state.repositoryOptions[0].registryUrl;
        this.setState(state);
    }

    componentDidMount = () => {
        this.getDockerRepositories();

    }

    refresh = () => {

    }
    render() {

        return (
            <div className="ci-config-form margin-auto">
                <h1>CI Configuration</h1>
                <Form>
                    <Row>
                        <Col xs={12} lg={6}>
                            <FormGroup controlId="dockerFilePath"
                                validationState={this.getValidationState("dockerFilePath")}>
                                <ControlLabel>Docker File Path</ControlLabel>

                                <FormControl
                                    type="text" required
                                    value={this.state.form.dockerFilePath}
                                    placeholder="Enter Docker File Path"
                                    onChange={(event) => this.handleChange(event, 'dockerFilePath')} />

                                <HelpBlock>{this.state.validation.dockerFilePath}</HelpBlock>

                            </FormGroup>

                            <FormGroup>
                                <ControlLabel>Docker Repository</ControlLabel>
                                <Fragment>
                                    <TypeAheadSelect
                                        labelKey="registryUrl"
                                        multiple={false}
                                        options={this.state.repositoryOptions}
                                        clearButton
                                        isValid={this.isDropDownValid('repository')}
                                        onChange={(event) => { this.handleRepositoryOptions(event) }}
                                        placeholder="Select Docker Repository..."
                                    />
                                </Fragment>
                                <HelpBlock>{this.state.validation.repository}</HelpBlock>

                            </FormGroup>

                            <FormGroup controlId="tagPattern" validationState={this.getValidationState('tagPattern')}>
                                <ControlLabel>Tag Pattern</ControlLabel>
                                <FormControl
                                    type="text"
                                    value={this.state.form.tagPattern}
                                    placeholder="Enter Tag Pattern"
                                    onChange={(event) => this.handleChange(event, 'tagPattern')} />
                            </FormGroup>
                            <HelpBlock>{this.state.validation.tagPattern}</HelpBlock>

                            <ArgsFieldSet callbackFromCIConfig={this.saveArgs} />
                        </Col>

                        <Col xs={12} lg={6}>
                            <FormGroup
                                controlId="text" validationState={this.getValidationState('dockerfile')}>
                                <ControlLabel>Docker File</ControlLabel>
                                <FormControl
                                    height="100"
                                    componentClass="textarea"
                                    value={this.state.form.dockerfile}
                                    placeholder="Docker Config File"
                                    onChange={(event) => this.handleChange(event, 'dockerfile')} />
                            </FormGroup>

                            <Button type="button" bsClass="align-right" bsStyle="primary" onClick={this.refresh}>
                                Refresh
                            </Button>

                        </Col>
                    </Row>

                    <Button type="button" bsStyle="primary"
                        disabled={this.isFormValid()}
                        onClick={this.save}>
                        Save
                    </Button>
                </Form>
            </div>

        )
    }
}
