import React, { Component, Fragment, ChangeEvent } from 'react';
import {
    FormControl,
    FormGroup,
    ControlLabel,
    Button,
    Form,
    TypeAheadSelect,
    Card,
    CardTitle,
    CardBody,
    Row,
    Col
} from 'patternfly-react'

import {
    Host,
    Routes
} from '../../config/constants';

import { SourceConfigFormState, } from '../../modals/sourceConfigTypes';
import DirectionalNavigation from '../common/directionalNavigation';

export default class SourceConfigForm extends Component<{}, SourceConfigFormState> {

    handlers: Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)>

    constructor(props: {}) {
        super(props);
        this.state = {
            accountOptions: [],
            tagPattterOptions: [
                { label: "Branch Fixed", value: "BRANCH_FIXED" },
                { label: "Branch Regex", value: "BRANCH_REGEX" },
                { label: "Tag Fixed", value: "TAG_ANY" },
                { label: "Tag Regex", value: "TAG_REGEX" },
            ],

            form: {
                account: [],
                url: "",
                path: "",
                appName: "",
                productionBranch: {
                    name: "",
                    tagPatternType: "BRANCH_FIXED",
                    tagPattern: ""
                },
                ciBranch: {
                    name: "",
                    tagPatternType: "BRANCH_FIXED",
                    tagPattern: ""
                },
                ctBranch: {
                    name: "",
                    tagPatternType: "BRANCH_FIXED",
                    tagPattern: ""
                },
                gitProvider: 0,
            }

        };

        this.handlers = ["account", "url", "path", "appName"]
            .reduce((map: Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)>, key: string) => {
                map.set(key, this.handleValueChange(key))
                return map;
            },
                new Map<string, ((event: React.ChangeEvent<HTMLInputElement>) => void)>());

    }

    componentDidMount = () => {
        this.getAccounts();
    }

    validationRules = new SourceConfigValidation();

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
        state.form[key] = e.target.value;
        this.setState(state);
    }

    handleOptions = (e: Array<any>, key: string) => {
        let newState = { ...this.state };
        if (e.length) {
            newState[key] = e.map(function (element) { return element.name });
            if (key === 'account') {
                newState.form.gitProvider = e[0].id;
                newState.form.url = e[0].url;
            }
        }
        else {
            newState[key] = "";
            if (key === 'account') {
                newState.form.gitProvider = 0;
                newState.form.url = "";
            }
        }
        this.setState(newState);
    }

    handleBranchInfo = (event, branchType: string, key: string): void => {
        let state = { ...this.state };
        state.form[branchType][key] = event.target.value;
        this.setState(state);
    }

    testConnection = () => {
        let URL = `${Host}${Routes.SAVE_SOURCE_CONFIG}`;
        let requestBody = {
            appName: this.state.form.appName,
            material: [{
                url: this.state.form.url,
                productionBranch: this.state.form.productionBranch.name,
                ciBranch: this.state.form.ciBranch.name,
                ctBranch: this.state.form.ctBranch.name,
                gitProviderId: this.state.form.gitProvider,
                path: this.state.form.path,
            }
            ]
        };

        // console.log(URL);
        console.log(this.state);

        fetch(URL, {
            method: 'POST',
            headers: { 'Content-type': 'application/x-www-form-urlencoded' },
            // body: JSON.stringify(requestBody)
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


    isFormNotValid = (): boolean => {
        return false;
    }

    isDropDownValid = (key: string) => {
        // return !!this.state[key].length;
    }

    getValidationState = (key: string): string | null => {
        let param = this.state.form[key];

        return this.validationRules[key](param).result;

    }

    renderDirectionalNavigation() {
        let steps = [{
            title: 'Step 4',
            isActive: true,
            href: '#',
            isAllowed: false
        }, {
            title: 'Step 5',
            isActive: true,
            href: '#',
            isAllowed: false
        }, {
            title: 'Step 6',
            isActive: true,
            href: '#',
            isAllowed: false
        }, {
            title: 'Step 7',
            isActive: true,
            href: '#',
            isAllowed: false
        }, {
            title: 'Step 8',
            isActive: true,
            href: '#',
            isAllowed: false
        }];
        return <DirectionalNavigation steps={steps} />
    }

    renderPageHeader() {
        return <Card>
            <CardTitle>
                Source Configuration
            </CardTitle>
            <CardBody>
                This is some description about Source configuration what is required to be filled.
            </CardBody>
        </Card>
    }

    renderBranchInfo(branchType: string, title: string) {
        return (
            <fieldset>
                <legend>{title}</legend>
                <Row>
                    <Col xs={12} lg={12}>
                        <FormGroup
                            controlId={branchType} validationState={this.getValidationState(branchType)}>
                            <ControlLabel>Name</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.form[branchType].name}
                                onChange={(event) => { this.handleBranchInfo(event, branchType, 'name') }}
                                placeholder="Enter Branch Name" />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col lg={6} >
                        <FormGroup controlId={`${branchType}TagPattern`}>
                            <ControlLabel>Tag Pattern Type</ControlLabel>
                            <FormControl
                                componentClass="select"
                                value={this.state.form[branchType].tagPatternType}
                                onChange={(event) => { this.handleBranchInfo(event, branchType, 'tagPatternType') }}
                                placeholder="Select Tag Pattern" >
                                {this.state.tagPattterOptions.map(
                                    (element, index) => {
                                        return (
                                            <option key={index} value={element.value}>{element.label}</option>
                                        )
                                    })}
                            </FormControl>
                        </FormGroup>
                    </Col>

                    <Col lg={6} >
                        <FormGroup controlId="productionBranchTagPattern">
                            <ControlLabel>Tag Pattern</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.form[branchType].tagPattern}
                                onChange={(event) => { this.handleBranchInfo(event, branchType, 'tagPattern') }}
                                placeholder="Enter Tag Pattern" >
                            </FormControl>
                        </FormGroup>
                    </Col>
                </Row>
            </fieldset>
        )
    }

    render() {
        return <React.Fragment>
            {this.renderPageHeader()}
            <div className="nav-form-wrapper">
                {this.renderDirectionalNavigation()}
                <div className="source-config-form">
                    <Form onSubmit={this.testConnection}>
                        <FormGroup controlId="account" >
                            <ControlLabel>Select Account</ControlLabel>
                            <Fragment>
                                <TypeAheadSelect
                                    id="id"
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
                                value={this.state.form.url}
                                placeholder="Enter Git URL"
                                onChange={this.handlers.get('url')} />
                            <FormControl.Feedback />
                        </FormGroup>

                        <FormGroup controlId="path" validationState={this.getValidationState('path')}>
                            <ControlLabel>Path</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.form.path}
                                placeholder="Enter Path"
                                onChange={this.handlers.get('path')} />
                            <FormControl.Feedback />
                        </FormGroup>

                        <FormGroup
                            controlId="appName" validationState={this.getValidationState('appName')}>
                            <ControlLabel>App Name</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.form.appName}
                                placeholder="Enter App Name"
                                onChange={this.handlers.get('appName')} />
                        </FormGroup>

                        {this.renderBranchInfo('ciBranch', "CI Branch")}
                        {this.renderBranchInfo('ctBranch', "CT Branch")}
                        {this.renderBranchInfo('productionBranch', "Production Branch")}

                        <Button type="button" bsStyle="primary"
                            disabled={this.isFormNotValid()}
                            onClick={this.testConnection}>
                            Test Connection
                        </Button>
                        <Button type="button" bsStyle="success" >Next</Button>
                    </Form>
                </div>
            </div>
        </React.Fragment>
    }
}

class SourceConfigValidation {
    defaultText = (value: string): { message: string | null, result: string | null } => {
        length = value.length;
        if (length > 8) {
            return { message: null, result: 'success' }
        }
        else if (length > 0) {
            return { message: 'Enter 8 atleast Characters', result: 'error' }
        };
        return { message: null, result: null }
    }

    branch = (obj: { name: string, tagPattern: string, tagPatternType: string }): { message: string | null, result: string | null } => {
        console.log("branch valida");

        return { message: 'Enter 8 atleast Characters', result: null };


    }

    appName = this.defaultText;
    url = this.defaultText;
    path = this.defaultText;
    name = this.defaultText;
    ciBranch = this.branch;
    ctBranch = this.branch;
    productionBranch = this.branch;

} 
