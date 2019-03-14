import React, { Component, Fragment } from 'react';
import yamlJsParser from 'yamljs';
import {
    FormGroup,
    ControlLabel,
    Button,
    Form,
    TypeAheadSelect,
    ExpandCollapse,
    Row,
    Col,
    Card,
    CardTitle,
    CardBody
} from 'patternfly-react'

import {
    Host,
    Routes
} from '../../config/constants';

import TemplateForm from './templateForm';
import { Description, DeploymentConfigType } from '../../modals/deploymentTemplateTypes';
import { isSubset } from '../helpers/isSubset';
import DirectionalNavigation from '../common/directionalNavigation';
import { deploymentTemplateDummyData } from '../helpers/deploymentFormData';

export interface DeploymentTemplateProps {
    id: string;
}

export interface DeploymentTemplateFormState {
    chartRepositoryOptions: Description[];
    referenceTemplateOptions: Description[];
    validationMessage: string;

    deploymentTemplate: {
        chartRepositoryId: string;
        referenceTemplateId: string;
        deploymentConfig: DeploymentConfigType;
    }
}

export default class DeploymentTemplateForm extends Component<DeploymentTemplateProps, DeploymentTemplateFormState>{

    constructor(props) {
        super(props);

        this.state = {
            chartRepositoryOptions: [],
            referenceTemplateOptions: [],
            validationMessage: "",

            deploymentTemplate: {
                chartRepositoryId: "",
                referenceTemplateId: "",

                deploymentConfig: {
                    json: {
                        obj: { 'key': "value" },
                        value: ""
                    },
                    jsonSubset: {
                        obj: {},
                        value: "",
                    },
                    yamlSubset: ""

                },

            }
        }
    }

    componentDidMount = () => {
        this.getChartRepositories();
        this.getReferenceTemplates();
        if (this.props.id)
            this.getDeploymentTemplate(this.props.id);

        // //TODO: remove hard coding
        let state = { ...this.state };
        state.deploymentTemplate.deploymentConfig.json.obj = deploymentTemplateDummyData;
        state.deploymentTemplate.deploymentConfig.json.value = JSON.stringify(state.deploymentTemplate.deploymentConfig.json.obj, undefined, 2);
        this.setState(state);

    }

    getChartRepositories = () => {
        const URL = `${Host}${Routes.CHART_REPO}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {

                    let state = { ...this.state };
                    state.chartRepositoryOptions = response.result.chartRepos
                    this.setState(state);

                },
                (error) => {
                    console.error(error);

                }
            );
    }

    getReferenceTemplates = () => {
        const URL = `${Host}${Routes.REFERENCE_TEMPLATE}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    let state = { ...this.state };
                    state.referenceTemplateOptions = response.result.refTemplates;
                    this.setState(state);
                },
                (error) => {
                    console.error(error);

                }
            );
    }

    getDeploymentTemplate = (id: string) => {
        const URL = `${Host}${Routes.DEPLOYMENT_TEMPLATE}/${id}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    console.log(response);


                },
                (error) => {
                    console.error(error);

                }
            );


    }

    handleOptions = (e: Array<any>, key: string) => {
        let state = { ...this.state };
        if (e.length) {
            state.deploymentTemplate[key] = e[0].id
        }
        else {
            state.deploymentTemplate[key] = "";
        }
        this.setState(state);

    }

    isDropDownValid = (key: string): boolean => {
        return true;
    }

    //Saves JSON/YAML, beautifies JSON ONLY, also checks for subset
    //returns true - if JSON/YAML is valid JSON/YAML
    validateJson = (key: string): boolean => {
        let state = { ...this.state };

        if (key == 'json') {
            try {
                state.deploymentTemplate.deploymentConfig.jsonSubset.obj = JSON.parse(state.deploymentTemplate.deploymentConfig.jsonSubset.value);
                state.deploymentTemplate.deploymentConfig.jsonSubset.value = JSON.stringify(state.deploymentTemplate.deploymentConfig.jsonSubset.obj, undefined, 2);
                state.deploymentTemplate.deploymentConfig.yamlSubset = yamlJsParser.stringify(state.deploymentTemplate.deploymentConfig.jsonSubset.obj);

                let is = isSubset(state.deploymentTemplate.deploymentConfig.json.obj, state.deploymentTemplate.deploymentConfig.jsonSubset.obj);
                if (!is) {
                    state.validationMessage = "JSON must be a subset";
                }
                else {
                    state.validationMessage = "Valid JSON Subset";
                }
                this.setState(state);
                return true;

            } catch (error) {
                console.error("INVALID JSON");
                state.validationMessage = "JSON is not Valid";
                this.setState(state);
                return false;
            }
        }
        else if (key == 'yaml') {
            try {
                state.deploymentTemplate.deploymentConfig.jsonSubset.obj = yamlJsParser.parse(state.deploymentTemplate.deploymentConfig.yamlSubset);
                state.deploymentTemplate.deploymentConfig.jsonSubset.value = JSON.stringify(state.deploymentTemplate.deploymentConfig.jsonSubset.obj, undefined, 2);
                let is = isSubset(state.deploymentTemplate.deploymentConfig.json.obj, state.deploymentTemplate.deploymentConfig.jsonSubset.obj);
                if (!is) {
                    state.validationMessage = "YAML must be a subset";
                }
                else {
                    state.validationMessage = "Valid YAML Subset";
                }
            } catch (error) {
                console.error("INVALID YAML");
                state.validationMessage = "YAML is not Valid";
            }
        }
        
        this.setState(state);
    }

    isFormNotValid() {
        let isValid = true;
        let depTemplate = this.state.deploymentTemplate;
        isValid = isValid && !!depTemplate.chartRepositoryId && !!depTemplate.referenceTemplateId;
        isValid = isValid && !!depTemplate.deploymentConfig.jsonSubset.obj || !!depTemplate.deploymentConfig.jsonSubset.value;

        return !isValid;
    }



    handleJsonValue = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let state = { ...this.state };
        if (key == 'json') {
            state.deploymentTemplate.deploymentConfig.jsonSubset.value = event.target.value;
        }
        else if (key == 'yaml') {
            state.deploymentTemplate.deploymentConfig.yamlSubset = event.target.value;
        }

        this.setState(state);
    }

    

    saveDeploymentTemplate = () => {

        const URL = `${Host}${Routes.DEPLOYMENT_TEMPLATE}`;
        let requestBody = {
            pipelineGroupId: 0,
            chartRepositoryId: this.state.deploymentTemplate.chartRepositoryId,
            RefChartTemplate: this.state.deploymentTemplate.referenceTemplateId,
            valuesOverride: JSON.stringify(this.state.deploymentTemplate.deploymentConfig.jsonSubset.obj)
        };

        fetch(URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
            );

    }

    renderDeploymentTemplateForm() {
        return <TemplateForm
            deploymentConfig={this.state.deploymentTemplate.deploymentConfig}
            handleJsonValue={this.handleJsonValue}
            validateJson={this.validateJson}
        />
    }

    renderDirectionalNavigation() {
        let steps = [{
            title: 'Step 4',
            isActive: false,
            href: '/form-setup/source-config',
            isAllowed: true
        }, {
            title: 'Step 5',
            isActive: false,
            href: '/form-setup/ci-config',
            isAllowed: true
        }, {
            title: 'Step 6',
            isActive: true,
            href: '/form-setup/deployment-template',
            isAllowed: true
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
                Deployment Template
            </CardTitle>
            <CardBody>
                This is some description about Deployment Template what is required to be filled.
            </CardBody>
        </Card>
    }

    render() {
        return <React.Fragment>
            {this.renderPageHeader()}
            <div className="nav-form-wrapper">
                {this.renderDirectionalNavigation()}
                <div className="source-config-form">
                    <Form>
                        <ExpandCollapse
                            bordered={true}
                            textCollapsed="Show Advanced Configuration"
                            textExpanded="Hide Advanced Configuration">
                            <Row bsClass="bg-gray flexbox">
                                <Col lg={12}>
                                    <FormGroup>
                                        <ControlLabel>Chart Repository*</ControlLabel>
                                        <Fragment>
                                            <TypeAheadSelect
                                                id="id"
                                                labelKey="name"
                                                options={this.state.chartRepositoryOptions}
                                                clearButton
                                                multiple={false}
                                                placeholder="Select Chart Repository..."
                                                isValid={this.isDropDownValid('chartRepository')}
                                                onChange={(events) => this.handleOptions(events, 'chartRepositoryId')}
                                            />
                                        </Fragment>
                                    </FormGroup>

                                    <FormGroup>
                                        <ControlLabel>Reference Template*</ControlLabel>
                                        <Fragment>
                                            <TypeAheadSelect
                                                id="id"
                                                labelKey="name"
                                                options={this.state.referenceTemplateOptions}
                                                clearButton
                                                // isValid={this.isDropDownValid('referenceTemplate')}
                                                onChange={(events) => this.handleOptions(events, 'referenceTemplateId')}
                                                placeholder="Select Reference Template..."
                                            />
                                        </Fragment>
                                    </FormGroup>
                                </Col>
                            </Row>

                        </ExpandCollapse>
                        <div className="mt-25"></div>
                        {this.renderDeploymentTemplateForm()}

                        <Button type="button"
                            bsStyle="primary"
                            onClick={this.saveDeploymentTemplate}
                            disabled={this.isFormNotValid()}>
                            Save
                        </Button>
                        <p className="float-right">{this.state.validationMessage}</p>

                    </Form>
                </div>
            </div>
        </React.Fragment>
    }
}