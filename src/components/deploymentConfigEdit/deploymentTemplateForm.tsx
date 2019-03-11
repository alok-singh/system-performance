import React, { Component, Fragment } from 'react';
import { 
    FormControl, 
    FormGroup, 
    ControlLabel, 
    Button, 
    Form, 
    TypeAheadSelect, 
    ExpandCollapse, 
    Tabs, 
    Tab, 
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

import { Description } from '../../modals/deploymentTemplateTypes';

import DirectionalNavigation from '../common/directionalNavigation';

export interface DeploymentTemplateFormState {
    chartRepositoryOptions: Description[];
    referenceTemplateOptions: Description[];

    chartRepository: Description;
    referenceTemplate: Description;
    deploymentConfig: {
        json: {
            obj: any,
            value: string
        },
        subset: {
            obj: any,
            value: string;

        }
        yaml: string;
    };

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
                },
                yaml: ""
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

        state.chartRepositoryOptions = [
            { id: '1', name: "Chart Repo One" },
            { id: '2', name: "Chart Repo Two" },
            { id: '3', name: "Chart Repo Three" },
        ];
        state.referenceTemplateOptions = [
            { id: '1', name: "Reference Template 1" },
            { id: '2', name: "Reference Template 2" },
            { id: '3', name: "Reference Template 3" },
        ];

        state.deploymentConfig.json.obj = { "glossary": { "title": "example glossary", "GlossDiv": { "title": "S", "GlossList": { "GlossEntry": { "ID": "SGML", "SortAs": "SGML", "GlossTerm": "Standard Generalized Markup Language", "Acronym": "SGML", "Abbrev": "ISO 8879:1986", "GlossDef": { "para": "A meta-markup language, used to create markup languages such as DocBook.", "GlossSeeAlso": ["GML", "XML"] }, "GlossSee": "markup" } } } } };
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

        this.jsonToYaml(this.state.deploymentConfig.json.obj);


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

    validateJson = (): boolean => {
        try {
            //TODO: instead of spread operator can be take deploymentConfig only?
            let { deploymentConfig } = { ...this.state };
            deploymentConfig.subset.obj = JSON.parse(this.state.deploymentConfig.subset.value);

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
            console.log("IS SUBSET", this.isSubset(this.state.deploymentConfig.json.obj, this.state.deploymentConfig.subset.obj));

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
        state.deploymentConfig.subset.value = event.target.value;
        this.setState(state);
    }

    //@description: Is 'subset' subset of 'json'
    //NOTE: Empty Array - not a subset
    isSubset = (json: any, subset: any): boolean => {
        let valid = true;
        
        //Case json is Array
        if (Array.isArray(json)) {

            let parentSet = new Set(Object.keys(json[0]));
            let keysOfAllElements: Array<string> = [];
            for (let i = 0; i < subset.length; i++) {
                keysOfAllElements = keysOfAllElements.concat(Object.keys(subset[i]));
            }
            let childrenSet = new Set(keysOfAllElements);

            //Case both Arrays and subset Array is non empty
            if (Array.isArray(subset) && (subset.length) && (subset.length <= json.length) && (childrenSet.size <= parentSet.size)) {
                // console.log("Both Arrays")
                json = json[0];
                for (let i = 0; i < subset.length; i++) {
                    valid = valid && this.isSubset(json, subset[i]);
                    if (!valid) return valid;
                }
                return valid;
            }
            else {
                return false;
            }
        }

        //Case Both Objects
        else if (typeof (json) == 'object' && typeof (subset) == 'object' && !Array.isArray(subset) && !Array.isArray(json)) {

            let key = new Set(Object.keys(json));
            let keySubset = new Set(Object.keys(subset));

            keySubset.forEach(element => {
                valid = valid && (key.has(element)) &&
                    (typeof (json[element]) == typeof (subset[element])) &&
                    (this.isSubset(json[element], subset[element]));
            });

            return !!valid;
        }
        else {
            return (typeof (json) == typeof (subset) && !Array.isArray(subset) && !Array.isArray(json));
        }
    }

    jsonToYaml = (json: any) => {
    }

    yamlToJson = () => {

    }

    saveDeploymentTemplate = () => {
        //Verify value is JSON
        this.validateJson();

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
                        <Tabs defaultActiveKey={1} id="deployment-config">
                            <Tab eventKey={1} title="JSON">
                                <Row bsClass="bg-gray flexbox p-25">
                                    <Col lg={6}>
                                        <FormGroup
                                            controlId="text">
                                            <FormControl
                                                height="100"
                                                componentClass="textarea"
                                                value={this.state.deploymentConfig.json.value}
                                                placeholder="JSON"
                                                disabled={true} />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={6}>
                                        <FormGroup
                                            controlId="text">
                                            <FormControl
                                                height="100"
                                                componentClass="textarea"
                                                value={this.state.deploymentConfig.subset.value}
                                                placeholder="JSON"
                                                onChange={(event) => { this.handleJsonValue(event, 'json') }} />
                                        </FormGroup>
                                        <Button type="button" bsClass="align-right" bsStyle="primary" onClick={this.validateJson}>
                                            Validate JSON
                                        </Button>

                                    </Col>
                                </Row>
                            </Tab>
                            <Tab eventKey={2} title="YAML">
                                <Row bsClass="bg-gray flexbox p-25">
                                    <Col lg={6}>
                                        <FormGroup
                                            controlId="text">
                                            <FormControl
                                                height="100"
                                                componentClass="textarea"
                                                value={this.state.deploymentConfig.json.value}
                                                placeholder="JSON"
                                                disabled={true} />
                                        </FormGroup>
                                    </Col>
                                    <Col lg={6}>
                                        <FormGroup
                                            controlId="text">
                                            <FormControl
                                                height="100"
                                                componentClass="textarea"
                                                value={this.state.deploymentConfig.subset.value}
                                                placeholder="JSON"
                                                onChange={(event) => { this.handleJsonValue(event, 'json') }} />
                                        </FormGroup>
                                        <Button type="button" bsClass="align-right" bsStyle="primary" >
                                            Validate YAML
                                        </Button>
                                    </Col>
                                </Row>
                            </Tab>

                        </Tabs>

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