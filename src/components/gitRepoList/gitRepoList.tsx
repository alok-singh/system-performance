import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import * as resolve from 'table-resolver';
import { getGitRepositoryList } from '../../modals/gitRepositoriesModal';
import { gitRepositoryColumns } from './gitRepositoryColumn';
import { GitRepositoryListState } from '../../modals/gitRepositoriesModal';

import {
    ToastNotificationList,
    ToastNotification,
    Grid,
    Row,
    Col,
    Button,
    customHeaderFormattersDefinition,
    tableCellFormatter,
    Table,
    Card,
    CardTitle,
    CardBody
} from 'patternfly-react'

export default class GitRepositoryList extends Component<{}, GitRepositoryListState> {

    constructor(props) {
        super(props);
        this.state = {
            code: 0,
            errors: [],
            rows: []
        };
    }

    customHeaderFormatters: any;

    onRow(row, { rowIndex }) {
        return {
            className: classNames({ selected: row.selected }),
            role: 'row'
        };
    }

    componentDidMount = () => {
        getGitRepositoryList().then((response: any) => {
            let state = {
                code: response.code,
                errors: response.errors ? response.errors : [],
                rows: response.result.GitRepos
            }
            this.setState(state, () => {
                setTimeout(() => {
                    this.closeNotification();
                }, 2000);
            })
        }, (error) => {
            setTimeout(() => {
                this.closeNotification();
            }, 2000);
        });
    }

    //Clears error messages and response code
    closeNotification = () => {
        let state = { ...this.state };
        state.code = 0;
        state.errors = [];
        this.setState(state);
    }

    getCellPropsFunction(columns, rows) {
        return (cellProps) => {
            return customHeaderFormattersDefinition({
                cellProps: cellProps,
                columns: columns,
                rows: rows,
            });
        }
    }

    renderNotification = () => {
        let { code, errors } = { ...this.state };

        let successCodes = new Set([200, 201, 202, 203, 204, 205, 206, 207, 208, 226]);

        if (successCodes.has(code)) {
            return <ToastNotificationList>
                <ToastNotification type="success">
                    <span>Git Repositories Found</span>
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
            }

            );
        }
    }

    renderPageHeader() {
        return <Card>
            <CardTitle>
                <Row bsClass="m-lr-0 flexbox flex-justify m-tb-20">
                    <h1 className="m-0">Git Repositories</h1>
                    <Link to='/form-global/git-repo-config'>
                        <Button bsStyle="primary">Add New Repository</Button>
                    </Link>
                </Row>
            </CardTitle>
            <CardBody>
                Following are the registered repositories.
            </CardBody>
        </Card>
    }

    render() {
        let { rows } = this.state;
        let columns = gitRepositoryColumns;
        let tableComponents = {
            header: {
                cell: this.getCellPropsFunction(columns, rows)
            }
        };
        return <React.Fragment>
            {this.renderPageHeader()}
            {this.renderNotification()}
            <Table.PfProvider striped bordered hover dataTable columns={columns} components={tableComponents} >
                <Table.Header headerRows={resolve.headerRows({ columns })} />
                <Table.Body rows={rows} rowKey="id" onRow={this.onRow} />
            </Table.PfProvider>
        </React.Fragment>
               
    }
}
