import React, { Component, Fragment, ChangeEvent } from "react";
import {
    Form,
    FormControl,
    FormGroup,
    ControlLabel,
    Button,
    Row,
    Col,
    HelpBlock,
    ToastNotification,
    ToastNotificationList,
    Card, CardBody, CardTitle,
} from 'patternfly-react';

import DirectionalNavigation from '../common/directionalNavigation';
import { DBMigrationConfigRouterProps, DBMigrationConfigFormState } from './types';
import { getGitRepo, getMigrationTools, getDatabases, getDBMigrationConfig, saveMigrationConfig, updateMigrationConfig } from './services';

export default class DBMigrationConfigForm extends Component<DBMigrationConfigRouterProps, DBMigrationConfigFormState> {
    constructor(props) {
        super(props);

        this.state = {
            code: 0,
            errors: [],
            successMessage: null,
            buttonLabel: "SAVE",

            migrationTools: [],
            databases: [],

            dbMigrationConfig: {
                appId: null,
                gitRepositoryURL: "",
                scriptSource: "",
                migrationTool: "",
                database: "",
            }

        }

    }

    componentDidMount = () => {
        getGitRepo(this.state.dbMigrationConfig.appId)
            .then(response => {
                let state = { ...this.state };
                state.dbMigrationConfig.gitRepositoryURL = response.result.gitRepo.url;
                this.setState(state);
            })

        getMigrationTools()
            .then(response => {
                let state = { ...this.state };
                state.migrationTools = response.result.migrationTools;
                state.dbMigrationConfig.migrationTool = response.result.migrationTools[0].id;
                this.setState(state);
            })

        getDatabases()
            .then(response => {
                let state = { ...this.state };
                state.databases = response.result.databases;
                state.dbMigrationConfig.database = response.result.databases[1].id;
                this.setState(state);
            })

        let id = parseInt(this.props.id)
        if (id) {
            getDBMigrationConfig(id)
                .then(response => {
                    this.saveResponse(response, "Found Saved Configuration")
                    setTimeout(() => {
                        this.closeNotification()
                    }, 2000)
                })
        }
    }

    handleChange = (event: ChangeEvent<HTMLInputElement>, key: string) => {
        let state = { ...this.state };
        state.dbMigrationConfig[key] = event.target.value;
        this.setState(state);
    }

    validateScriptSource = () => {
        if(this.state.dbMigrationConfig.scriptSource.length > 3) {
            return {message: "", result: "success"}
        } else if(this.state.dbMigrationConfig.scriptSource.length > 0){
            return {message:"Script Source too short", result: "error"}
        }
        return {message: null, result: null}
        

    }

    closeNotification = () => {
        let state = { ...this.state };
        state.successMessage = null;
        state.code = 0;
        state.errors = [];
        this.setState(state);
    }

    isFormNotValid = (): boolean => {
        let config = this.state.dbMigrationConfig;
        let isValid = true;
        let requiredFields = ['gitRepositoryURL','scriptSource','migrationTool','database'];
        requiredFields.forEach(key => {
            isValid = isValid && config[key];
        });
        return !isValid;
    }

    saveResponse = (response, successMessage: string) => {
        let state = { ...this.state };
        state.code = response.code;
        state.errors = response.errors || [];
        if (!response.errors && response.result && response.result.DBMigrationConfig) {
            let config = response.result.DBMigrationConfig;
            state.dbMigrationConfig = {
                appId: config.appId,
                gitRepositoryURL: config.gitRepositoryURL,
                scriptSource: config.scriptSource,
                migrationTool: config.migrationTool,
                database: config.database,

            }
            state.successMessage = successMessage;
        }
        state.buttonLabel = "UPDATE";
        this.setState(state);
    }

    saveOrUpdate = () => {
        let request = {
            appId: this.state.dbMigrationConfig.appId,
            gitRepositoryURL: this.state.dbMigrationConfig.gitRepositoryURL,
            scriptSource: this.state.dbMigrationConfig.scriptSource,
            migrationTool: this.state.dbMigrationConfig.migrationTool,
            database: this.state.dbMigrationConfig.database,
        }

        if (this.state.dbMigrationConfig.appId) {
            updateMigrationConfig(request, this.state.dbMigrationConfig.appId)
                .then(response => {
                    this.saveResponse(response, "Update Successfull");
                    setTimeout(() => {
                        this.closeNotification()
                    }, 2000)
                })
        }
        else {
            saveMigrationConfig(request)
                .then(response => {
                    this.saveResponse(response, "Save Successfull")
                    setTimeout(() => {
                        this.closeNotification()
                    }, 2000)
                })
        }
    }
    renderMigrationTools() {
        return (
            <Fragment>
                {this.state.migrationTools.map(
                    (tool, index) => {
                        return (
                            <option key={index} value={tool.id}>{tool.name}</option>
                        )
                    }
                )}
            </Fragment>
        )
    }

    renderDatabases() {
        return (
            <Fragment>
                {this.state.databases.map(
                    (db, index) => {
                        return (
                            <option key={index} value={db.id}>{db.name}</option>
                        )
                    }
                )}
            </Fragment>
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
            isActive: false,
            href: '/form-setup/properties-config',
            isAllowed: true
        }, {
            title: 'Step 8',
            isActive: true,
            href: '/form-setup/db-migration-config',
            isAllowed: true
        }, {
            title: 'Step 9',
            isActive: false,
            href: '/form-setup/flow-chart',
            isAllowed: false
        }];
        return <DirectionalNavigation steps={steps} />
    }


    renderPageHeader() {
        return <Card>
            <CardTitle>
                DB Migration Configuration
            </CardTitle>
            <CardBody>
                This is some description about DB Migation what is required to be filled.
            </CardBody>
        </Card>
    }


    renderNotification = () => {
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

        else if (errors.length) {
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
        return <Fragment>
            {this.renderNotification()}
            {this.renderPageHeader()}
            <div className="nav-form-wrapper">
                {this.renderDirectionalNavigation()}
                <div className="form">
                    <Form>
                        <FormGroup controlId="gitRepositoryURL">
                            <ControlLabel>Git Repository*</ControlLabel>
                            <FormControl
                                type="text"
                                value={this.state.dbMigrationConfig.gitRepositoryURL}
                                placeholder="Enter URL of Git Repository"
                                disabled={true}
                                onChange={(event) => this.handleChange(event, 'gitRepositoryURL')} required />
                        </FormGroup>

                        <FormGroup controlId="scriptSource"
                            validationState={this.validateScriptSource().result}>
                            <ControlLabel>Script Source*</ControlLabel>
                            <HelpBlock className="float-right">{this.validateScriptSource().message}</HelpBlock>
                            <FormControl
                                type="text"
                                value={this.state.dbMigrationConfig.scriptSource}
                                placeholder="relative to git root"
                                onChange={(event) => this.handleChange(event, 'scriptSource')} required />
                        </FormGroup>

                        <FormGroup controlId="migrationTool" >
                            <ControlLabel>Select Migration Tool*</ControlLabel>
                            <FormControl
                                componentClass="select"
                                value={this.state.dbMigrationConfig.migrationTool}
                                onChange={(event) => this.handleChange(event, 'migrationTool')}
                                placeholder="Select Migration Tool" >
                                {this.renderMigrationTools()}
                            </FormControl>
                        </FormGroup>

                        <FormGroup controlId="database" >
                            <ControlLabel>Select Database*</ControlLabel>
                            <FormControl
                                componentClass="select"
                                value={this.state.dbMigrationConfig.database}
                                onChange={(event) => this.handleChange(event, 'database')}
                                placeholder="Select Database" >
                                {this.renderDatabases()}
                            </FormControl>
                        </FormGroup>

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