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
import { DeploymentTemplateFormState } from '../../modals/deploymentTemplateTypes';
import { isSubset } from '../helpers/isSubset';
import DirectionalNavigation from '../common/directionalNavigation';

export interface DeploymentTemplateProps {
    id: string;
}

export default class DeploymentTemplateForm extends Component<DeploymentTemplateProps, DeploymentTemplateFormState>{

    constructor(props) {
        super(props);

        this.state = {
            code: 0,
            errors: [],
            successMessage: null,

            chartRepositoryOptions: [],
            referenceTemplateOptions: [],
            validationMessage: "",
            buttonLabel: "SAVE",

            deploymentTemplate: {
                pipelineGroupId: null,

                chartRepositoryId: -1,
                referenceTemplateId: -1,

                deploymentConfig: {
                    json: {
                        obj: { 'key': "value" },
                        value: ""
                    },
                    jsonSubset: {
                        obj: {},
                        value: "",
                    },
                    yamlSubset: "",

                },

            }
        }
    }

    componentDidMount = () => {
        this.getJSONdata();
        this.getChartRepositories();
        this.getReferenceTemplates();
        if (this.props.id)
            this.getDeploymentTemplate(this.props.id);


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
                    this.saveResponse(response, "Found Saved Configuration")


                },
                (error) => {
                    console.error(error);

                }
            );
    }

    getJSONdata = () => {
        const URL = `${Host}${Routes.PROPS}`;
        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    let state = { ...this.state };
                    state.deploymentTemplate.deploymentConfig.json.obj = response.result.json;
                    state.deploymentTemplate.deploymentConfig.json.value = JSON.stringify(state.deploymentTemplate.deploymentConfig.json.obj, undefined, 2);
                    this.setState(state);
                },
                (error) => {
                    console.error(error);

                }
            );
    }

    saveResponse = (response, successMessage: string) => {
        let state = { ...this.state };
        state.code = response.code;
        state.errors = response.errors || [];
        if (response.result && response.result.deploymentTemplate) {
            state.successMessage = successMessage;
            state.deploymentTemplate.pipelineGroupId = response.result.deploymentTemplate.pipelineGroupId;
            state.deploymentTemplate.chartRepositoryId = response.result.deploymentTemplate.chartRepositoryId;
            state.deploymentTemplate.referenceTemplateId = response.result.deploymentTemplate.referenceTemplateId;
            state.deploymentTemplate.deploymentConfig.jsonSubset.obj = response.result.deploymentTemplate.json;
            state.deploymentTemplate.deploymentConfig.jsonSubset.value = JSON.stringify(state.deploymentTemplate.deploymentConfig.jsonSubset.obj, undefined, 2);
        }
        state.buttonLabel = "UPDATE";
        this.setState(state);
        console.log(response.result.deploymentTemplate.json)
        console.log(this.state.deploymentTemplate);
    }

    handleOptions = (e: Array<any>, key: string) => {
        let state = { ...this.state };
        if (e.length) {
            state.deploymentTemplate[key] = e[0].id
        }
        else {
            state.deploymentTemplate[key] = -1;
        }
        this.setState(state);

    }

    closeNotification = () => {
        let state = { ...this.state };
        state.successMessage = null;
        state.code = 0;
        state.errors = [];
        this.setState(state);
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
        isValid = isValid && (depTemplate.chartRepositoryId != -1 ) && (depTemplate.referenceTemplateId != -1);
        isValid = isValid && !!depTemplate.deploymentConfig.jsonSubset.obj;

        return !isValid;
    }

    getSelectedRepo = () => {
        let repoId = this.state.deploymentTemplate.chartRepositoryId;
        let index = this.state.chartRepositoryOptions.findIndex((element) => {
            return element.id == repoId;
        })
        if (index >= 0) return this.state.chartRepositoryOptions.slice(index, index + 1);
    }

    getSelectedTemplate = () => {
        let refTemplateId = this.state.deploymentTemplate.referenceTemplateId;
        let index = this.state.referenceTemplateOptions.findIndex((element) => {
            return element.id == refTemplateId;
        })
        if (index >= 0) return this.state.chartRepositoryOptions.slice(index, index + 1);

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



    saveOrUpdateDeploymentTemplate = () => {
        let url, method;

        if(this.state.deploymentTemplate.pipelineGroupId) {
            url = `${Host}${Routes.DEPLOYMENT_TEMPLATE}/${this.state.deploymentTemplate.pipelineGroupId}`;
            method = "PUT";
        }
        else {
            url = `${Host}${Routes.DEPLOYMENT_TEMPLATE}`;
            method = "POST";
        }
        let requestBody = {
            pipelineGroupId: this.state.deploymentTemplate.pipelineGroupId,
            chartRepositoryId: this.state.deploymentTemplate.chartRepositoryId,
            referenceTemplateId: this.state.deploymentTemplate.referenceTemplateId,
            valuesOverride: JSON.stringify(this.state.deploymentTemplate.deploymentConfig.jsonSubset.obj)
        };

        console.log(url);
        fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.saveResponse(response, "Updated Successfully");
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
                <div className="form">
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
                                                defaultSelected={this.getSelectedRepo()}
                                                options={this.state.chartRepositoryOptions}
                                                clearButton
                                                multiple={false}
                                                placeholder="Select Chart Repository..."
                                                // isValid={this.isDropDownValid('chartRepository')}
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
                                                defaultSelected={this.getSelectedTemplate()}
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
                            onClick={this.saveOrUpdateDeploymentTemplate}
                            disabled={this.isFormNotValid()}>
                            {this.state.buttonLabel}
                        </Button>
                        <p className="float-right">{this.state.validationMessage}</p>

                    </Form>
                </div>
            </div>
        </React.Fragment>
    }
}