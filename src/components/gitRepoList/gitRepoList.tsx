import React, { Component, Fragment } from 'react';
import { withRouter, Link } from 'react-router-dom';
import classNames from 'classnames';
import * as resolve from 'table-resolver';

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
} from 'patternfly-react'

import { 
    Host, 
    Routes 
} from '../config/constants';

import GitRepositoryConfig from '../common/gitRepositoryConfigForm';


export interface GitRepositoryListState {
    //Response code and errors
    code: number;
    errors: Array<{
        code: number;
        internalMessage: string,
        moreInfo: string,
        userMessage: string,
    }>,

    //Data
    rows: Array<GitRepositoryConfig>;

    // column definitions
    columns: Array<any>;

}

export default class GitRepositoryList extends Component<{}, GitRepositoryListState> {
    static onRow(row, { rowIndex }) {

        return {
            className: classNames({ selected: row.selected }),
            role: 'row'
        };
    }

    customHeaderFormatters: any;

    constructor(props) {
        super(props);
        // enables our custom header formatters extensions to reactabular
        this.customHeaderFormatters = customHeaderFormattersDefinition;

        this.state = {
            code: 0,
            errors: [],

            rows: [],

            columns: [
                {
                    property: 'name',
                    header: {
                        label: 'Name',
                        props: {
                            index: 0,
                            rowSpan: 1,
                            colSpan: 1,
                        },
                        formatters: [
                            tableCellFormatter
                        ]
                    },
                    cell: {
                        props: {
                            index: 0,
                        },
                        formatters: [
                            (name, obj) => {
                                const LINK = `/form/git-repo-config/${obj.rowData.id}`;
                                return (
                                    <span className="font-black">
                                        <Link to={LINK}>{name}</Link>
                                    </span>
                                )
                            },
                            tableCellFormatter
                        ]
                    }
                },
                {
                    property: 'url',
                    header: {
                        label: 'URL',
                        props: {
                            index: 1,
                            rowSpan: 1,
                            colSpan: 1,
                            style: {
                                textAlign: 'center'
                            }
                        },
                        formatters: [tableCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 1
                        },
                        formatters: [
                            tableCellFormatter
                        ]
                    }
                },
                {
                    property: 'authMode',
                    header: {
                        label: 'Authentication Mode',
                        props: {
                            index: 2,
                            rowSpan: 1,
                            colSpan: 1,
                            style: {
                                textAlign: 'center'
                            }
                        },
                        formatters: [tableCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 2
                        },
                        formatters: [
                            tableCellFormatter
                        ]
                    }
                },
                {
                    property: 'active',
                    header: {
                        label: 'Active',
                        props: {
                            index: 3,
                            rowSpan: 1,
                            colSpan: 1,
                            style: {
                                textAlign: 'center',
                            }
                        },
                        formatters: [tableCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 3,
                        },
                        formatters: [
                            (active) => {
                                if (active)
                                    return (<p className="m-5">Active</p>)
                                else
                                    return (<p className="m-5">Inactive</p>)
                            },
                            tableCellFormatter
                        ]
                    }
                },

            ],

        };
    }

    componentDidMount = () => {
        this.getGitRepositoryList();
    }



    getGitRepositoryList = () => {

        const URL = `${Host}${Routes.GIT_REPO_CONFIG}`;

        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        })
        .then(response => response.json())
        .then(
            (response) => {
                let state = { ...this.state };
                state.code = response.code;
                state.errors = response.errors ? response.errors : [];
                state.rows = response.result.GitRepos;
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
            return (
                <ToastNotification type="success">
                    <span>Git Repositories Found</span>
                    <div className="pull-right toast-pf-action">
                        <Button bsClass="transparent"
                            onClick={this.closeNotification}>
                            <span className="fa fa-close"></span>
                        </Button>
                    </div>
                </ToastNotification>
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

    render() {
        const { columns, rows } = this.state;

        return (
            <Grid fluid>
                <ToastNotificationList>
                    {this.renderNotification()}
                </ToastNotificationList>

                <Row bsClass="m-lr-0 flexbox flex-justify m-tb-20">
                    <h1 className="m-0">Git Repositories</h1>
                    <Link to='/form/git-repo-config'>Add New Repository </Link>
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
                        onRow={GitRepositoryList.onRow}
                    />

                </Table.PfProvider>

            </Grid>

        );
    }
}
