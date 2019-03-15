import React, { Component, Fragment, ChangeEvent } from 'react';
import { PropertiesFormState, FieldSet } from './types';
import { Form, ControlLabel, FormGroup, FormControl, TypeAheadSelect, Grid, Button, Row, Col, ToastNotification, ToastNotificationList } from 'patternfly-react';
import { Card, CardBody, CardTitle } from 'patternfly-react';
import { Host, Routes } from '../../config/constants';
import DirectionalNavigation from '../common/directionalNavigation';

export class PropertiesForm extends Component<{}, PropertiesFormState> {

    constructor(props: {}) {
        super(props);

        this.state = {
            successMessage: "",
            validationMessage: null,
            code: 0,
            errors: [],
            formData: [ ],
            properties: [],
        }
    }

    componentDidMount = () => {
        this.getProperties();
        this.getFormdata();

    }

    getProperties = (): void => {
        const URL = `${Host}${Routes.PROPERTY_OPTIONS}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    let state = { ...this.state };
                    state.properties = response.result.properties ? response.result.properties : [];
                    this.setState(state);

                },
                (error) => {

                }
            )
    }

    getFormdata = (): void => {
        const URL = `${Host}${Routes.PROPERTIES}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
            .then(response => response.json())
            .then(
                (response) => {
                    this.saveResponse(response, "Found Saved Properties");
                    setTimeout(() => {
                        this.closeNotification();
                    }, 2000)
                },
                (error) => {

                }
            )
    }

    saveResponse = (response, successMessage: string): void => {
        let state = { ...this.state };
        state.code = response.code;
        state.errors = response.errors ? response.errors : [];

        if (!state.errors.length) {
            if (response.result && response.result.formData) {
                state.formData = response.result.formData;
                state.successMessage = successMessage;
            }
            else {
                state.formData = [{ id: null, appId: null, appProperty: "", value: "" }];
                state.successMessage = "NO Property Set";
            }
        }
        this.setState(state);
    }

    handleDropdown = (selection: Array<FieldSet>, index: number): void => {
        if (!selection.length) return;
        let state = { ...this.state };
        state.formData[index] = selection[0];
        this.setState(state);
    }

    handleTextChange = (event: ChangeEvent<HTMLInputElement>, index: number): void => {
        let state = { ...this.state };
        state.formData[index].value = event.target.value;
        this.setState(state);
    }


    shouldAddMore = (): boolean => {
        let len = this.state.formData.length;
        return (len > 0) && (this.state.formData[len - 1].appProperty.length > 0)
            && (this.state.formData[len - 1].value.length > 0);
    }

    addMore = (): void => {
        let state = { ...this.state };
        state.formData.push({ id: null, appId: null, appProperty: "", value: "" });
        this.setState(state);
    }

    save = (): void => {
        //Check for Duplicate values
        let formData = this.state.formData;
        let valuesAsKeys = {};
        for (let i = 0; i < formData.length; i++) {
            valuesAsKeys[formData[i].value] = 0;
        }
        for (let i = 0; i < formData.length; i++) {
            valuesAsKeys[formData[i].value] += 1;
            if (valuesAsKeys[formData[i].value] > 1) {
                let state = { ...this.state };
                state.validationMessage = `'${[formData[i].value]}' is a Duplicate Value`;
                this.setState(state);
                setTimeout(() => {
                    this.closeNotification();
                }, 2000)
            }
        }

        //Save Form
        if (!this.state.validationMessage.length) {
            const URL = `${Host}${Routes.PROPERTIES}`;

            fetch(URL, {
                method: 'PUT',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(this.state.formData)
            })
                .then(response => response.json())
                .then(
                    (response) => {
                        this.saveResponse(response, "Saved Successfully");
                        console.log(response);
                        setTimeout(() => {
                            this.closeNotification();
                        }, 2000)

                    },
                    (error) => {

                    }
                )
        }

    }
    //Clears status code, errors, and validation Messages
    closeNotification = () => {
        let state = { ...this.state };
        state.errors = [];
        state.code = 0;
        state.successMessage = "";
        state.validationMessage = "";
        this.setState(state);
    }
    //No field should be empty
    isFormNotValid = (): boolean => {
        let len = this.state.formData.length;
        if(len>0)
        return !(len > 0 && this.state.formData[len - 1].appProperty.length > 0 && this.state.formData[len - 1].value.length > 0);
    }

    renderNotification = () => {
        let { code, errors } = { ...this.state };

        let successCodes = new Set([200, 201, 202, 204, 204, 205, 206, 207, 208, 226]);

        if (successCodes.has(code)) {
            return (
                <ToastNotificationList>
                    <ToastNotification type="success">
                        <span>Properties Found</span>
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

    renderPageHeader = () => {
        return (
            <Card>
                <CardTitle>
                    Properties
                </CardTitle>
                <CardBody>
                    Following are the Application properties.
            </CardBody>
            </Card>
        )
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
            isActive: false,
            href: '/form-setup/deployment-template',
            isAllowed: true
        }, {
            title: 'Step 7',
            isActive: true,
            href: '/form-setup/properties-config',
            isAllowed: true
        }, {
            title: 'Step 8',
            isActive: false,
            href: '/form-setup/flow-chart',
            isAllowed: false
        }];
        return <DirectionalNavigation steps={steps} />
    }

    renderFieldSet = () => {
        var self = this;
        return (
            <div className="args">
                {this.state.formData.map(function (element, index) {
                    return (
                        <Row className="m-lr-0" key={index}>
                            <Col xs={6} sm={6}>
                                <FormGroup>
                                    <ControlLabel>Property</ControlLabel>
                                    <Fragment>
                                        <TypeAheadSelect
                                            id="id"
                                            labelKey="appProperty"
                                            multiple={false}
                                            defaultSelected={self.state.formData.slice(index, index + 1)}
                                            options={self.state.properties}
                                            onChange={(event) => { self.handleDropdown(event, index) }}
                                            placeholder="Select A Property"
                                        />
                                    </Fragment>
                                </FormGroup>
                            </Col>

                            <Col xs={6} sm={6} lg={6}>
                                <FormGroup
                                    controlId={`key-${index}`}>
                                    <ControlLabel>Value</ControlLabel>
                                    <FormControl
                                        type="text"
                                        value={self.state.formData[index].value}
                                        placeholder="Enter Value"
                                        onChange={(event) => self.handleTextChange(event, index)} />
                                </FormGroup>
                            </Col>
                        </Row>
                    )
                })}
                <Row className="m-lr-0">
                    <Col xs={12}>
                        <Button type="button" bsStyle="default"
                            bsClass="float-right"
                            disabled={!self.shouldAddMore()}
                            onClick={self.addMore}>Add More
                        </Button>
                    </Col>
                </Row>
                <hr></hr>
            </div >
        );
    }


    render() {
        return <Fragment>
            {this.renderPageHeader()}
            {this.renderNotification()}
            <div className="nav-form-wrapper">
                {this.renderDirectionalNavigation()}
                <div className="form">
                    <Form className="margin-auto">
                        {this.renderFieldSet()}
                        <Row className="m-lr-0">
                            <Col xs={12} lg={12}>
                                <Button type="button"
                                    bsStyle="primary"
                                    disabled={this.isFormNotValid()}
                                    onClick={this.save}>Save</Button>

                                <p className="float-right">{this.state.validationMessage}</p>
                            </Col>
                        </Row>
                    </Form>
                </div>
            </div>
        </Fragment>
    }
} 
