import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { dockerRepositoryColumns } from './dockerRepositoryColumns';


import * as resolve from 'table-resolver';

import {Host, Routes } from '../../config/constants';

import { 
    Card,
    CardTitle,
    CardBody,
    ToastNotificationList, 
    ToastNotification, 
    Grid, 
    Row, 
    Col, 
    Button,
    customHeaderFormattersDefinition,
    tableCellFormatter,
    Table
} from 'patternfly-react';

import { DockerRegistryListState } from '../../modals/dockerRegistryTypes';

export class DockerRegistryList extends Component<{}, DockerRegistryListState> {
    onRow(row, { rowIndex }) {
        return {
            className: classNames({ selected: row.selected }),
            role: 'row'
        };
    }

    customHeaderFormatters: any;

    constructor(props) {
        super(props);

        this.customHeaderFormatters = customHeaderFormattersDefinition;
        this.renderCellProps = this.renderCellProps.bind(this);
        this.closeNotification = this.closeNotification.bind(this);
        this.state = {
            code: 0,
            errors: [],
            rows: []
        };
    }

    componentDidMount = () => {
        this.getDockerRegistryList();
    }

    getDockerRegistryList = () => {
        const URL = `${Host}${Routes.DOCKER_REGISTRY_CONFIG}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
        .then(response => response.json())
        .then(response => {
                console.log(response);
                let state = { ...this.state };
                state.code = response.code;
                state.errors = response.errors ? response.errors : [];
                state.rows = response.result.dockerRegistries;
                this.setState(state);
                setTimeout(() => {
                    this.closeNotification();
                }, 2000);

            },
            (error) => {
                setTimeout(() => {
                    this.closeNotification();
                }, 2000);
            }
        )
    }

    //Clears error messages and response code
    closeNotification() {
        let state = { ...this.state };
        state.code = 0;
        state.errors = [];
        this.setState(state);
    }

    renderCellProps() {
        return cellProps => {
            return this.customHeaderFormatters({
                cellProps: cellProps,
                columns: dockerRepositoryColumns,
                rows: this.state.rows
            });
        }
    }

    renderNotifications() {
        let { code, errors } = this.state;
        let successCodes = new Set([200, 201, 202, 203, 204, 205, 206, 207, 208, 226]);

        if (successCodes.has(code)) {
            return <ToastNotificationList>
                <ToastNotification type="success">
                    <span>Docker Registry Found</span>
                    <div className="pull-right toast-pf-action">
                        <Button bsClass="transparent"
                            onClick={this.closeNotification}>
                            <span className="fa fa-close"></span>
                        </Button>
                    </div>
                </ToastNotification>
            </ToastNotificationList>
        }
        else {
            errors.map((element) => {
                return <ToastNotificationList>
                    <ToastNotification type="error">
                        <span>Error!!!{element.userMessage}</span>
                        <div className="pull-right toast-pf-action">
                            <Button bsClass="transparent"
                                onClick={this.closeNotification}>
                                <span className="fa fa-close"></span>
                            </Button>
                        </div>
                    </ToastNotification>
                </ToastNotificationList>
            });
        }
    }

    renderPageTitle() {
        return <Card>
            <CardTitle>
                <Row bsClass="m-lr-0 flexbox flex-justify m-tb-20">
                    <h1 className="m-0">Docker Registries</h1>
                    <Link to='/form-global/docker-register'>
                        <Button bsStyle="primary">Add New</Button>
                    </Link>
                </Row>
            </CardTitle>
            <CardBody>
                This is some basic text about docker registeries This is some basic text about docker registeries.
            </CardBody>
        </Card>
    }

    renderTable() {
        let rows = this.state.rows;
        let tableComponents = {
            header: {
                cell: this.renderCellProps()
            }
        };
        return <div className="table-wrapper">
            <Table.PfProvider striped bordered hover dataTable
                columns={dockerRepositoryColumns}
                components={tableComponents}>
                <Table.Header headerRows={resolve.headerRows({columns: dockerRepositoryColumns})} />
                <Table.Body rows={rows} rowKey="id" onRow={this.onRow} />
            </Table.PfProvider>
        </div>
    }

    render() {
        return <React.Fragment>
            {this.renderPageTitle()}
            {this.renderNotifications()}
            {this.renderTable()}
        </React.Fragment>
    }
}
