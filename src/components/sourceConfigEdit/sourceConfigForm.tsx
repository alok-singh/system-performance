import React, { Component, Fragment, ChangeEvent } from 'react';
import {
    FormControl,
    FormGroup,
    ControlLabel,
    Button,
    Form,
    TypeAheadSelect,
    HelpBlock,
    Card,
    CardTitle,
    CardBody,
    Row,
    Col,
    ToastNotification,
    ToastNotificationList
} from 'patternfly-react'

import {
    Host,
    Routes
} from '../../config/constants';

import { SourceConfigFormState, } from '../../modals/sourceConfigTypes';
import DirectionalNavigation from '../common/directionalNavigation';

export interface SourceConfigFormProps {
    appId: string;
}

export default class SourceConfigForm extends Component<SourceConfigFormProps, SourceConfigFormState> {

    handlers: Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)>

    constructor(props) {
        super(props);
        this.state = {
            repositoryOptions: [],
            tagOptions: [
                { label: "Branch Fixed", value: "SOURCE_TYPE_BRANCH_FIXED" },
                { label: "Branch Regex", value: "SOURCE_TYPE_BRANCH_REGEX" },
                { label: "Tag Any", value: "SOURCE_TYPE_TAG_ANY" },
                { label: "Tag Regex", value: "SOURCE_TYPE_TAG_REGEX" },
            ],
            validationMessage: null,
            buttonLabel: "SAVE",

            code: 0,
            status: "",
            errors: [],
            successMessage: null,
            app: {
                id: null,
                appName: "",
                material: [
                    {
                        id: null,
                        name: "",
                        url: "",
                        gitProviderId: 0,
                        path: "",
                        productionSource: {
                            type: "SOURCE_TYPE_TAG_ANY",
                            value: "",
                        },
                        ciSource: {
                            type: "SOURCE_TYPE_TAG_ANY",
                            value: "",
                        },
                        ctSource: {
                            type: "SOURCE_TYPE_TAG_ANY",
                            value: "",
                        },
                    }
                ]//material
            }

        }//state


    }

    validationRules = new SourceConfigValidation();

    componentDidMount = () => {
        this.getGitRepositories();
        if (this.props.appId) {
            this.getSourceConfig(this.props.appId);
        }
    }

    getGitRepositories = () => {
        const URL = `${Host}${Routes.GIT_REPO_CONFIG}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    let state = { ...this.state };
                    state.repositoryOptions = response.result.GitRepos;
                    this.setState(state);
                },
                (error) => {

                }
            )
    }


    getSourceConfig = (id: string) => {
        const URL = `${Host}${Routes.SOURCE_CONFIG}/${id}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.saveResponse(response, "Found Saved Configuration");
                    setTimeout(() => {
                        this.closeNotification();
                    }, 2000)
                },
                (error) => {

                }
            )
    }

    handleOptions = (repository: Array<any>, materialIndex: number) => {
        if (!repository.length) return;

        let state = { ...this.state };
        state.app.material[materialIndex].url = repository[0].url;
        this.setState(state);
    }

    handleAppNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        let state = { ...this.state };
        state.app.appName = event.target.value;
        this.setState(state);
    }

    handleMaterialChange = (event: ChangeEvent<HTMLInputElement>, index: number, key: string) => {
        let state = { ...this.state };
        state.app.material[index][key] = event.target.value;
        this.setState(state);
    }

    handleMaterialSourceChange = (event: ChangeEvent<HTMLInputElement>, materialIndex: number, branchType: string, key: string) => {
        let state = { ...this.state };
        state.app.material[materialIndex][branchType][key] = event.target.value;
        this.setState(state);
    }

    isFormNotValid = (): boolean => {
        let isValid = true;
        isValid = isValid && this.validationRules.appName(this.state.app.appName).isValid;
        let material = this.state.app.material;
        for (let i = 0; i < material.length; i++) {
            isValid = isValid && this.validationRules.url(material[i].url).isValid;
            isValid = isValid && this.validationRules.path(material[i].path).isValid;

            if (material[i].ciSource.type != "SOURCE_TYPE_TAG_ANY")
                isValid = isValid && this.validationRules.path(material[i].ciSource.value).isValid;

            if (material[i].ctSource.type != "SOURCE_TYPE_TAG_ANY")
                isValid = isValid && this.validationRules.path(material[i].ctSource.value).isValid;

            if (material[i].productionSource.type != "SOURCE_TYPE_TAG_ANY")
                isValid = isValid && this.validationRules.path(material[i].productionSource.value).isValid;

        }
        return !isValid;
    }

    saveOrUpdate = () => {
        let method, url;
        if (this.state.app.id) {
            url = `${Host}${Routes.SOURCE_CONFIG}/${this.state.app.id}`
            method = "PUT";
        }
        else {
            url = `${Host}${Routes.SOURCE_CONFIG}`
            method = "POST"
        }

        let requestBody = {
            id: this.state.app.id,
            appName: this.state.app.appName,
            material: this.state.app.material
        }
        fetch(url, {
            method: method,
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.saveResponse(response, "Save Successful");
                    setTimeout(() => {
                        this.closeNotification();
                    }, 2000)
                },
                (error) => {

                }
            )

    }

    saveResponse = (response, successMessage: string) => {
        let state = { ...this.state };
        state.code = response.code;
        state.errors = response.errors || [];
        state.successMessage = successMessage;
        state.buttonLabel = "UPDATE";

        if (response.result && response.result.source) {
            let source = response.result.source;
            state.app.id = source.id;
            state.app.appName = source.appName;
            state.app.material = source.material
        }
        this.setState(state)
    }

    closeNotification = () => {
        let state = { ...this.state };
        state.code = 0;
        state.errors = [];
        state.successMessage = null;
        this.setState(state);
    }

    renderNotification = () => {
        let { code, errors } = { ...this.state };

        let successCodes = new Set([200, 201, 202, 204, 204, 205, 206, 207, 208, 226]);

        if (successCodes.has(code)) {
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
                    <ToastNotification type="error">
                        <span>Error!!!{element.userMessage}</span>
                        <div className="pull-right toast-pf-action">
                            <Button bsClass="transparent"
                                onClick={this.closeNotification}>
                                <span className="fa fa-close"></span>
                            </Button>
                        </div>
                    </ToastNotification>
                )
            }

            );
        }
    }

    renderDirectionalNavigation() {
        let steps = [{
            title: 'Step 4',
            isActive: true,
            href: '/form-setup/source-config',
            isAllowed: true
        }, {
            title: 'Step 5',
            isActive: false,
            href: '/form-setup/ci-config',
            isAllowed: false
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

    renderPageHeader = () => {
        return (
            <Card>
                <CardTitle>
                    Source Configuration
                </CardTitle>
                <CardBody>
                    This is some description about Source configuration what is required to be filled.
                </CardBody>
            </Card>
        )
    }

    renderTagOptions = () => {
        return (
            this.state.tagOptions.map(
                (element, index) => {
                    return (<option key={index} value={element.value}>{element.label}</option>)
                })
        )
    }

    renderMaterial = () => {
        return (
            <Fragment>
                {this.state.app.material.map(
                    (material, index) => {
                        return (
                            <div key={index}>
                                <hr></hr>
                                <Row className="m-lr-0">
                                    <Col xs={12} lg={12}>
                                        <FormGroup controlId="repositoryOptions" >
                                            <ControlLabel>Select Repository*</ControlLabel>
                                            <Fragment>
                                                <TypeAheadSelect
                                                    id="id"
                                                    labelKey="name"
                                                    options={this.state.repositoryOptions}
                                                    clearButton
                                                    placeholder="Choose repository..."
                                                    onChange={(repository) => this.handleOptions(repository, index)}
                                                />
                                            </Fragment>
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className="m-lr-0">
                                    <Col xs={12} lg={12}>
                                        <FormGroup controlId="url" validationState={this.validationRules.url(this.state.app.material[index].url).result}>
                                            <ControlLabel>Git URL*</ControlLabel>
                                            <HelpBlock className="float-right">{this.validationRules.url(this.state.app.material[index].url).message}</HelpBlock>
                                            <FormControl
                                                type="text"
                                                value={this.state.app.material[index].url}
                                                placeholder="Enter Git URL"
                                                onChange={(event) => this.handleMaterialChange(event, index, "url")} />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className="m-lr-0">
                                    <Col xs={12} lg={12}>
                                        <FormGroup controlId="path"
                                            validationState={this.validationRules.path(this.state.app.material[index].path).result}>
                                            <HelpBlock className="float-right">{this.validationRules.path(this.state.app.material[index].path).message}</HelpBlock>
                                            <ControlLabel>Path*</ControlLabel>
                                            <FormControl
                                                type="text"
                                                value={this.state.app.material[index].path}
                                                placeholder="Enter Path"
                                                onChange={(event) => this.handleMaterialChange(event, index, "path")} />
                                        </FormGroup>
                                    </Col>
                                </Row>



                                <Row className="m-lr-0">
                                    <Col xs={12} lg={12}><h3>CI Source</h3></Col>
                                    <Col xs={6} lg={6}>
                                        <FormGroup controlId="tagOptions">
                                            <ControlLabel>Tag Pattern Type</ControlLabel>
                                            <FormControl componentClass="select"
                                                value={this.state.app.material[index].ciSource.type}
                                                placeholder="Select Tag Pattern"
                                                onChange={(event) => this.handleMaterialSourceChange(event, index, "ciSource", "type")}>
                                                {this.renderTagOptions()}
                                            </FormControl>
                                        </FormGroup>
                                    </Col>

                                    <Col xs={6} lg={6}>
                                        <FormGroup controlId="tagpattern"
                                            validationState={this.validationRules.value(this.state.app.material[index].ciSource.value).result}>
                                            <HelpBlock className="float-right">{this.validationRules.value(this.state.app.material[index].ciSource.value).message}</HelpBlock>
                                            <ControlLabel>Tag Pattern
                                                {(() => {
                                                    if (this.state.app.material[index].ciSource.type != "SOURCE_TYPE_TAG_ANY") return (<span>*</span>)
                                                })()}
                                            </ControlLabel>
                                            <FormControl type="text"
                                                value={this.state.app.material[index].ciSource.value}
                                                placeholder="Enter Tag Pattern"
                                                onChange={(event) => this.handleMaterialSourceChange(event, index, "ciSource", "value")} />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className="m-lr-0">
                                    <Col xs={12} lg={12}><h3>CT Source</h3></Col>
                                    <Col xs={6} lg={6}>
                                        <FormGroup controlId="tagOptions">
                                            <ControlLabel>Tag Pattern Type</ControlLabel>
                                            <FormControl componentClass="select"
                                                value={this.state.app.material[index].ctSource.type}
                                                placeholder="Select Tag Pattern"
                                                onChange={(event) => this.handleMaterialSourceChange(event, index, "ctSource", "type")}>
                                                {this.renderTagOptions()}
                                            </FormControl>
                                        </FormGroup>
                                    </Col>

                                    <Col xs={6} lg={6}>
                                        <FormGroup controlId="tagpattern"
                                            validationState={this.validationRules.value(this.state.app.material[index].ctSource.value).result}>
                                            <ControlLabel>Tag Pattern
                                            {(() => {
                                                    if (this.state.app.material[index].ctSource.type != "SOURCE_TYPE_TAG_ANY") return (<span>*</span>)
                                                })()}
                                            </ControlLabel>
                                            <HelpBlock className="float-right">{this.validationRules.value(this.state.app.material[index].ctSource.value).message}</HelpBlock>
                                            <FormControl type="text"
                                                value={this.state.app.material[index].ctSource.value}
                                                placeholder="Enter Tag Pattern"
                                                onChange={(event) => this.handleMaterialSourceChange(event, index, "ctSource", "value")} />
                                        </FormGroup>
                                    </Col>
                                </Row>

                                <Row className="m-lr-0">
                                    <Col xs={12} lg={12}><h3>Production Source</h3></Col>
                                    <Col xs={6} lg={6}>
                                        <FormGroup controlId="tagOptions">
                                            <ControlLabel>Tag Pattern Type</ControlLabel>
                                            <FormControl componentClass="select"
                                                value={this.state.app.material[index].productionSource.type}
                                                placeholder="Select Tag Pattern"
                                                onChange={(event) => this.handleMaterialSourceChange(event, index, "productionSource", "type")}>
                                                {this.renderTagOptions()}
                                            </FormControl>
                                        </FormGroup>
                                    </Col>

                                    <Col xs={6} lg={6}>
                                        <FormGroup controlId="tagpattern"
                                            validationState={this.validationRules.value(this.state.app.material[index].productionSource.value).result}>
                                            <HelpBlock className="float-right">{this.validationRules.value(this.state.app.material[index].productionSource.value).message}</HelpBlock>
                                            <ControlLabel>Tag Pattern
                                            {(() => {
                                                    if (this.state.app.material[index].productionSource.type != "SOURCE_TYPE_TAG_ANY") return (<span>*</span>)
                                                })()}
                                            </ControlLabel>
                                            <FormControl type="text"
                                                value={this.state.app.material[index].productionSource.value}
                                                placeholder="Enter Tag Pattern"
                                                onChange={(event) => this.handleMaterialSourceChange(event, index, "productionSource", "value")} />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </div>
                        )
                    }
                )}
            </Fragment>
        )
    }

    render() {
        return (
            <Fragment>
                {this.renderPageHeader()}
                {this.renderNotification()}
                <div className="nav-form-wrapper">
                    {this.renderDirectionalNavigation()}
                    <div className="source-config-form">
                        <Form className="margin-auto">
                            <Row key={"app-name"} className="m-lr-0">
                                <Col xs={12} lg={12}>
                                    <FormGroup controlId="appName" validationState={this.validationRules.appName(this.state.app.appName).result}>
                                        <ControlLabel>App Name*</ControlLabel>
                                        <HelpBlock className="float-right">
                                            {this.validationRules.appName(this.state.app.appName).message}
                                        </HelpBlock>

                                        <FormControl
                                            type="text"
                                            value={this.state.app.appName}
                                            placeholder="Enter App Name"
                                            onChange={(event) => this.handleAppNameChange(event)} />
                                    </FormGroup>
                                </Col>
                            </Row>
                            {this.renderMaterial()}
                            <Row className="m-lr-0">
                                <Col xs={12} lg={12}>
                                    <Button type="button"
                                        bsStyle="primary"
                                        disabled={this.isFormNotValid()}
                                        onClick={this.saveOrUpdate}>
                                        {this.state.buttonLabel}
                                    </Button>
                                    <p>{this.state.validationMessage}</p>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </div>
            </Fragment>
        )
    }
}

class SourceConfigValidation {
    defaultText = (value: string): { message: string | null, result: string | null, isValid: boolean } => {
        length = value.length;
        if (length >= 8) {
            return { message: null, result: 'success', isValid: true }
        }
        else if (length > 0) {
            return { message: 'Enter 8 atleast Characters', result: 'error', isValid: false }
        };
        return { message: null, result: null, isValid: false }
    }

    branchName = (value: string): { message: string | null, result: string | null, isValid: boolean } => {
        length = value.length;
        if (length >= 6) {
            return { message: null, result: 'success', isValid: true }
        }
        else if (length > 0) {
            return { message: 'Enter 6 atleast Characters', result: 'error', isValid: false }
        };
        return { message: null, result: null, isValid: false }
    }

    url = this.defaultText;
    path = this.defaultText;
    value = this.branchName;
    appName = this.branchName;


} 
