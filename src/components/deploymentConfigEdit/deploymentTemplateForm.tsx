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
    Col ,
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

import {isSubset} from '../helpers/isSubset';
import {
    deploymentTemplateDummyData, 
    chartRepositoryOptionsDummyData, 
    referenceTemplateOptionsDummyData,
} from '../helpers/deploymentFormData';

import DirectionalNavigation from '../common/directionalNavigation';

export interface DeploymentTemplateFormState {
    chartRepositoryOptions: Description[];
    referenceTemplateOptions: Description[];

    chartRepository: Description;
    referenceTemplate: Description;
    deploymentConfig: DeploymentConfigType;

}

export default class DeploymentTemplateForm extends Component<{}, DeploymentTemplateFormState>{

    constructor(props) {
        super(props);

        this.state = {
            chartRepositoryOptions: [],
            referenceTemplateOptions: [],

            chartRepository: { id: "1", name: "one" },
            referenceTemplate: { id: "1", name: "one" },
            deploymentConfig: {
                json: {
                    obj: { 'key': 'value' },
                    value: ""
                },
                subset: {
                    obj: { 'key': "value" },
                    value: "",
                    yaml: ""
                },
            },
        }
    }

    componentDidMount = () => {
        this.getSavedDeploymentTemplate();

    }

    getSavedDeploymentTemplate = () => {
        const URL = `${Host}${Routes.GET_SAVED_DEPLOYMENT_TEMPLATE}`;

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

        //TODO: remove hard coding
        let state = { ...this.state };

        state.chartRepositoryOptions = chartRepositoryOptionsDummyData;
        state.referenceTemplateOptions = referenceTemplateOptionsDummyData;
        state.deploymentConfig.json.obj = deploymentTemplateDummyData;
        
        // state.deploymentConfig.json.obj = [
        //     {
        //         "glossary": "val1",
        //         "key2": "val2",
        //     },
        //     {
        //         "glossary": "val1",
        //         "key2": "val2",
        //     }
        // ];


        state.deploymentConfig.json.value = JSON.stringify(state.deploymentConfig.json.obj, undefined, 2);        

        state.chartRepository = state.chartRepositoryOptions[0];
        state.referenceTemplate = state.referenceTemplateOptions[0];
        this.setState(state);

        // this.jsonToYaml(this.state.deploymentConfig.json.obj);


    }

    handleOptions = (e: Array<any>, key: string) => {
        let state = { ...this.state };
        if (e.length) {
            state[key] = e[0];
        }
        else {
            state[key] = {};
        }
        this.setState(state);

        // console.log(newState[key]);
        // console.log(this.state[key]);

    }

    validateJson = (key: string): boolean => {
        try {
            //TODO: instead of spread operator can be take deploymentConfig only?
            let {deploymentConfig} = this.state;
            
            if(key == 'json') {
                deploymentConfig.subset.obj = JSON.parse(this.state.deploymentConfig.subset.value);
            }
            else if(key == 'yaml') {
                deploymentConfig.subset.obj = yamlJsParser.parse(this.state.deploymentConfig.subset.yaml);
            }

            deploymentConfig.subset.value = JSON.stringify(deploymentConfig.subset.obj, undefined, 2);

            this.setState(Object.assign({},
                this.state.chartRepositoryOptions,
                this.state.referenceTemplateOptions,
                this.state.chartRepository,
                this.state.referenceTemplate,
                deploymentConfig
            )
            );

            // console.log("VALID json");
            console.log("IS SUBSET", isSubset(this.state.deploymentConfig.json.obj, this.state.deploymentConfig.subset.obj));

            return true;
        }
        catch (error) {
            console.error("INVALID JSON");
            return false;
        }

    }

    isFormValid() {
        let isValid = true;

        return !isValid;
    }

    isDropDownValid = (key: string) => {
        return !!this.state[key].length;
    }

    handleJsonValue = (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
        let state = { ...this.state };
        if(key == 'json') {
            state.deploymentConfig.subset.value = event.target.value;
        }
        else if(key == 'yaml') {
            state.deploymentConfig.subset.yaml = event.target.value;
        }
        // yamlJsParser.parse
        this.setState(state);
    }

    saveDeploymentTemplate = () => {
        //Verify value is JSON
        // this.validateJson();

        const URL = `${Host}${Routes.SAVE_DEPLOYMENT_TEMPLATE}`;
        let requestBody = {
            pipelineGroupId: 0,
            chartRepositoryId: this.state.chartRepository.id,
            RefChartTemplate: this.state.referenceTemplate.id,
            valuesOverride: JSON.stringify(this.state.deploymentConfig.subset.obj)
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
            deploymentConfig={this.state.deploymentConfig}
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
                                        <ControlLabel>Chart Repository</ControlLabel>
                                        <Fragment>
                                            <TypeAheadSelect
                                                id="id"
                                                labelKey="name"
                                                options={this.state.chartRepositoryOptions}
                                                clearButton
                                                multiple={false}
                                                placeholder="Select Chart Repository..."
                                                isValid={this.isDropDownValid('chartRepository')}
                                                onChange={(events) => this.handleOptions(events, 'chartRepository')}
                                            />
                                        </Fragment>
                                    </FormGroup>

                                    <FormGroup>
                                        <ControlLabel>Reference Template</ControlLabel>
                                        <Fragment>
                                            <TypeAheadSelect
                                                id="id"
                                                labelKey="name"
                                                options={this.state.referenceTemplateOptions}
                                                clearButton
                                                isValid={this.isDropDownValid('referenceTemplate')}
                                                onChange={(events) => this.handleOptions(events, 'referenceTemplate')}
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
                            disabled={this.isFormValid()}>
                            Save
                        </Button>
                    </Form>
                </div>
            </div>
        </React.Fragment>
    }
}