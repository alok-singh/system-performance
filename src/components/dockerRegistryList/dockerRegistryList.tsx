import classNames from 'classnames';
import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { dockerRepositoryColumns } from './dockerRepositoryColumns';


import * as resolve from 'table-resolver';

import {Host, Routes } from '../../config/constants';

import { 
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
    static onRow(row, { rowIndex }) {
        return {
            className: classNames({ selected: row.selected }),
            role: 'row'
        };
    }

    customHeaderFormatters: any;

    constructor(props) {
        super(props);

        this.customHeaderFormatters = customHeaderFormattersDefinition;

        this.state = {
            code: 0,
            errors: [],

            rows: [],

            columns: dockerRepositoryColumns,

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
        .then(
            (response) => {
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
    closeNotification = () => {
        let state = { ...this.state };
        state.code = 0;
        state.errors = [];
        this.setState(state);
    }

    renderNotification = () => {
        let { code, errors } = { ...this.state };
        
        let successCodes = new Set([200, 201, 202, 203, 204, 205, 206, 207, 208, 226]);

        if (successCodes.has(code)) {
            return <ToastNotification type="success">
                <span>Docker Registry Found</span>
                <div className="pull-right toast-pf-action">
                    <Button bsClass="transparent"
                        onClick={this.closeNotification}>
                        <span className="fa fa-close"></span>
                    </Button>
                </div>
            </ToastNotification>
        }
        else {
            errors.map((element) => {
                return <ToastNotification type="error">
                    <span>Error!!!{element.userMessage}</span>
                    <div className="pull-right toast-pf-action">
                        <Button bsClass="transparent"
                            onClick={this.closeNotification}>
                            <span className="fa fa-close"></span>
                        </Button>
                    </div>
                </ToastNotification>
            });
        }
    }

    render() {
        const { columns, rows } = this.state;

        return (
            <Grid fluid>
                <ToastNotificationList>
                    {this.renderNotification()}
                </ToastNotificationList>

                <Row bsClass="m-lr-0 flexbox flex-justify m-tb-20">
                    <h1 className="m-0">Docker Registries</h1>
                    <Link to='/form-global/docker-register'>Add New </Link>
                </Row>

                <Table.PfProvider striped bordered hover dataTable
                    columns={columns}
                    components={{
                        header: {
                            cell: cellProps => {
                                return this.customHeaderFormatters({
                                    cellProps: cellProps,
                                    columns: columns,
                                    rows: rows,
                                });
                            }
                        }
                    }}
                >
                    <Table.Header headerRows={resolve.headerRows({ columns })} />

                    <Table.Body rows={rows} rowKey="id"
                        onRow={DockerRegistryList.onRow}
                    />

                </Table.PfProvider>

            </Grid>

        );
    }
}
