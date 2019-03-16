import React, { Component } from 'react';
import {
    FormControl,
    FormGroup,
    Button,
    Tabs,
    Tab,
    Row,
    Col
} from 'patternfly-react'
import yamlJsParser from 'yamljs';

import { DeploymentConfigType } from '../../modals/deploymentTemplateTypes';

interface TemplateFormProps {
    deploymentConfig: DeploymentConfigType;
    handleJsonValue(event: any, key: string): void;
    validateJson(event: any): void;
}

export default class TemplateForm extends Component<TemplateFormProps, any> {
    render() {
        return <Tabs defaultActiveKey={1} id="deployment-config">
            <Tab eventKey={1} title="JSON">
                <Row bsClass="bg-gray flexbox p-25">
                    <Col lg={6}>
                        <FormGroup
                            controlId="text">
                            <FormControl
                                height="100"
                                componentClass="textarea"
                                value={this.props.deploymentConfig.json.value}
                                placeholder="JSON"
                                disabled={true} />
                        </FormGroup>
                    </Col>
                    <Col lg={6}>
                        <FormGroup controlId="text">
                            <FormControl
                                height="100"
                                componentClass="textarea"
                                value={this.props.deploymentConfig.jsonSubset.value}
                                placeholder="JSON"
                                onChange={(event) => { this.props.handleJsonValue(event, 'json') }} />
                        </FormGroup>
                        <Button type="button" bsClass="float-right" bsStyle="primary" onClick={() => this.props.validateJson('json')}>
                            Save JSON
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
                                // lookup https://github.com/jeremyfa/yaml.js for details
                                value={yamlJsParser.stringify(this.props.deploymentConfig.json.obj, 50)}
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
                                value={this.props.deploymentConfig.yamlSubset}
                                placeholder="YAML"
                                onChange={(event) => { this.props.handleJsonValue(event, 'yaml') }} />
                        </FormGroup>
                        <Button type="button" bsClass="align-right" bsStyle="primary" onClick={() => this.props.validateJson('yaml')}>
                            Save YAML
                        </Button>
                    </Col>
                </Row>
            </Tab>
        </Tabs>
    }
}