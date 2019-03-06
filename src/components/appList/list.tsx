import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as resolve from 'table-resolver';

import {
    customHeaderFormattersDefinition,
    selectionCellFormatter,
    selectionHeaderCellFormatter,
    sortableHeaderCellFormatter,
    tableCellFormatter,
    Table,
    PAGINATION_VIEW,
    TABLE_SORT_DIRECTION
} from 'patternfly-react';

import { 
    FormGroup, 
    ControlLabel, 
    FormControl, 
    Grid, 
    Paginator, 
    Popover, OverlayTrigger  
} from 'patternfly-react'

import {Host, Routes } from '../config/constants';

export interface App {
    appName: string;
    appId: number;
    timesDeployed: number;

    lastDeployed: {
        time: Date,
        sourceRef: string,
        deployedBy: string;
        dockerTag: string;
    };

    currentInstanceCount: number;
    instanceConfig: {
        ram: number;
        cpu: number;
    };

    inprogressDeploymentDetail: {
        time: Date;
        sourceRef: string;
        deployedBy: string;
        dockerTag: string;
        rolloutStatus: string;
    };

    deploymentStatus: string;
    appEndpoint: Array<string>;

}


export interface AppListData {
    environmentId: string;
    environmentName: string;
    rows: Array<App>;

    sortingColumns: {
        name: {
            direction: string;
            position: number;
        }
    };
    columns: Array<any>;
    pagination: {
        page: number;
        perPage: number;
        perPageOptions: Array<number>;
    }
    itemCount: number;
}

export default class AppList extends Component<{}, AppListData> {
    
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

        //TODO: remove initial state
        this.state = {

            environmentId: "",
            environmentName: "",
            //App Data from Server
            rows: [
                {
                    appName: "App 1",
                    appId: 12,
                    timesDeployed: 3,
    
                    lastDeployed: {
                        time: new Date(2019, 1, 21),
                        sourceRef: "Source ref",
                        deployedBy: "abc",
                        dockerTag: "docker-tag",
                    },
    
                    currentInstanceCount: 2,
                    instanceConfig: {
                        ram: 25,
                        cpu: 4,
                    },
    
                    inprogressDeploymentDetail: {
                        time: new Date(),
                        sourceRef: "source-ref",
                        deployedBy: "deployed by",
                        dockerTag: "docker-tag",
                        rolloutStatus: "rollout status",
                    },
    
                    deploymentStatus: "yellow",
                    appEndpoint: ["endpoint1", "endpoint2"]
                },
    
                {
                    appName: "App 2",
                    appId: 10,
                    timesDeployed: 12,
    
                    lastDeployed: {
                        time: new Date(2019, 2, 11),
                        sourceRef: "Source ref",
                        deployedBy: "abc",
                        dockerTag: "docker-tag",
                    },
    
                    currentInstanceCount: 16,
                    instanceConfig: {
                        ram: 25,
                        cpu: 2,
                    },
    
                    inprogressDeploymentDetail: {
                        time: new Date(),
                        sourceRef: "source-ref",
                        deployedBy: "deployed by",
                        dockerTag: "docker-tag",
                        rolloutStatus: "rollout status",
                    },
    
                    deploymentStatus: "red",
                    appEndpoint: ["endpoint1", "endpoint2"]
    
                },
    
                {
                    appName: "App 3",
                    appId: 11,
                    timesDeployed: 21,
    
                    lastDeployed: {
                        time: new Date(2019, 2, 20),
                        sourceRef: "Source ref",
                        deployedBy: "abc",
                        dockerTag: "docker-tag",
                    },
    
                    currentInstanceCount: 6,
                    instanceConfig: {
                        ram: 25,
                        cpu: 3,
                    },
    
                    inprogressDeploymentDetail: {
                        time: new Date(),
                        sourceRef: "source-ref",
                        deployedBy: "deployed by",
                        dockerTag: "docker-tag",
                        rolloutStatus: "rollout status",
                    },
    
                    deploymentStatus: "blue",
                    appEndpoint: ["endpoint1", "endpoint2"]
    
                }
            ],

            // Sort the first column in an ascending way by default.
            sortingColumns: {
                name: {
                    direction: TABLE_SORT_DIRECTION.ASC,
                    position: 0
                }
            },

            // column definitions
            columns: [
                {
                    property: 'select',
                    header: {
                        label: 'Select all rows',
                        props: {
                            index: 0,
                            rowSpan: 1,
                            colSpan: 1,
                            
                        },
                        customFormatters: [selectionHeaderCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 0,
                            style: {
                                verticalAlign: 'middle'
                            }
                        },
                        formatters: [
                            (value, { rowData, rowIndex }) => {
                                return selectionCellFormatter(
                                    { rowData, rowIndex },
                                    this.onSelectRow
                                );
                            }
                        ]
                    }
                },
                {
                    property: 'appName',
                    header: {
                        label: 'App Name',
                        props: {
                            index: 1,
                            rowSpan: 1,
                            colSpan: 1,
                        },
                        customFormatters: [sortableHeaderCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 1,
                        },
                        formatters: [
                            (appName)=> {
                                return(
                                    <p className="m-5">{appName}</p>
                                )
                            },
                            tableCellFormatter
                        ]
                    }
                },
                {
                    property: 'timesDeployed',
                    header: {
                        label: 'Times Deployed',
                        props: {
                            index: 2,
                            rowSpan: 1,
                            colSpan: 1,
                            style: {
                                textAlign: 'center'
                            }
                        },
                        customFormatters: [sortableHeaderCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 2
                        },
                        formatters: [
                            (timesDeployed, obj) => {
                                let tooltip = (<Popover id="tooltip" title="Last Successfull Deployment">
                                    <p>{obj.rowData.lastDeployed.time.toLocaleString()}</p>
                                    <p><strong>Source Ref </strong>{obj.rowData.lastDeployed.sourceRef}</p>
                                    <p><strong>Deployed by </strong>{obj.rowData.lastDeployed.deployedBy}</p>
                                    <p><strong>Docker Tag </strong>{obj.rowData.lastDeployed.dockerTag}</p>
                                </Popover>)
                                return (
                                    <OverlayTrigger placement="bottom" overlay={tooltip}
                                        trigger={['hover', 'focus']}>
                                        <p className="text-center m-5">{timesDeployed}</p>
                                    </OverlayTrigger>
                                )
                            },
                            tableCellFormatter
                        ]
                    }
                },
                {
                    property: 'currentInstanceCount',
                    header: {
                        label: 'Current Instance Count',
                        props: {
                            index: 3,
                            rowSpan: 1,
                            colSpan: 1,
                            style: {
                                textAlign: 'center'
                            }
                        },
                        customFormatters: [sortableHeaderCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 3
                        },
                        formatters: [
                            (instanceConfig, obj) => {
                                let tooltip = (<Popover id="tooltip" title="Statistics">
                                    <p><strong>CPU </strong>{obj.rowData.instanceConfig.cpu}</p>
                                    <p><strong>RAM Usage </strong>{obj.rowData.instanceConfig.ram}%</p>
                                </Popover>)
                                return (
                                    <div>
                                        <OverlayTrigger placement="bottom" overlay={tooltip}
                                            trigger={['hover', 'focus']}>
                                            <p className="text-center m-5">{instanceConfig}</p>
                                        </OverlayTrigger>
                                    </div>
                                )
                            },
                            tableCellFormatter
                        ]
                    }
                },
                {
                    property: 'lastDeployed',
                    header: {
                        label: 'Last Deployed',
                        props: {
                            index: 4,
                            rowSpan: 1,
                            colSpan: 1,
                            style: {
                                textAlign: 'center',
                            }
                        },
                        customFormatters: [sortableHeaderCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 4,
                        },
                        formatters: [
                            (lastDeployed, obj) => {
                                return (
                                    <p className="text-center m-5">
                                        {lastDeployed.time.toLocaleString()}
                                    </p>
                                )
                            },
                            tableCellFormatter
                        ]
                    }
                },
                {
                    property: 'deploymentStatus',
                    header: {
                        label: 'Deployment Status',
                        props: {
                            index: 5,
                            rowSpan: 1,
                            colSpan: 1,
                            style: {
                                textAlign: 'center'
                            }
                        },
                        customFormatters: [sortableHeaderCellFormatter]
                    },
                    cell: {
                        props: {
                            index: 5
                        },
                        formatters: [
                            (deploymentStatus, obj) => {
                                let bg = {
                                    'backgroundColor': deploymentStatus
                                };
                                let tooltip = (<Popover id="tooltip" title="Details">
                                    <p><strong>{obj.rowData.inprogressDeploymentDetail.rolloutStatus}</strong></p>
                                    <p>{obj.rowData.lastDeployed.time.toLocaleString()}</p>
                                    <p><strong>Source Ref </strong>{obj.rowData.lastDeployed.sourceRef}</p>
                                    <p><strong>Deployed by </strong>{obj.rowData.lastDeployed.deployedBy}</p>
                                    <p><strong>Docker Tag </strong>{obj.rowData.lastDeployed.dockerTag}</p>
                                </Popover>);

                                if (deploymentStatus != "red") {
                                    return (
                                        <div>
                                            <OverlayTrigger placement="bottom" overlay={tooltip}
                                                trigger={['hover', 'focus']}>
                                                <div style={bg} className="deployment-status-bar"></div>
                                            </OverlayTrigger>
                                        </div>
                                    )
                                }

                                else {
                                    return (
                                        <div style={bg} className="deployment-status-bar"></div>
                                    )
                                }
                            },
                            tableCellFormatter
                        ]
                    }
                },
            ],


            // pagination default states
            pagination: {
                page: 1,
                perPage: 5,
                perPageOptions: [5, 10, 15]
            },
            
            // server side pagination values
            itemCount: 0
        };
    }

    componentDidMount = () => {
        const { sortingColumns, pagination } = this.state;
        //TODO: Merge in in one methods 
        this.getAppList("production", sortingColumns, pagination);
    }
    selelectOption = (event:React.ChangeEvent<HTMLInputElement>) => {
        console.log(event.target.value);
    }
    getAppList = (environmentType: string, sortingColumns, pagination) => {
        // const { onServerPageLogger } = this.props;

        // call our mock server with next sorting/paging arguments
        const getPageArgs = {
            sortingColumns,
            page: pagination.page,
            perPage: pagination.perPage
        };


        // onServerPageLogger(getPageArgs);
        // MockServerApi.getPage(getPageArgs).then(response => {
        //   this.setState({
        //     sortingColumns: sortingColumns,
        //     pagination: pagination,
        //     rows: response.rows,
        //     itemCount: response.itemCount
        //   });
        // });

        const URL = `${Host}${Routes.GET_APP_LIST}`;

        let requestBody = {

        }

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

                }
            )


    }

    // getPage = (sortingColumns, pagination) =>{
    //     const { onServerPageLogger } = this.props;
    //     // call our mock server with next sorting/paging arguments
    //     const getPageArgs = {
    //         sortingColumns,
    //         page: pagination.page,
    //         perPage: pagination.perPage
    //     };
    //     onServerPageLogger(getPageArgs);
    //     MockServerApi.getPage(getPageArgs).then(response => {
    //       this.setState({
    //         sortingColumns: sortingColumns,
    //         pagination: pagination,
    //         rows: response.rows,
    //         itemCount: response.itemCount
    //       });
    //     });
    // }

    onSort = (e, column, sortDirection) => {
        // Clearing existing sortingColumns does simple single column sort. To do multisort,
        // set each column based on existing sorts specified and set sort position.
        const updatedSortingColumns = {
            [column.property]: {
                direction:
                    sortDirection === TABLE_SORT_DIRECTION.ASC
                        ? TABLE_SORT_DIRECTION.DESC
                        : TABLE_SORT_DIRECTION.ASC,
                position: 0
            }
        };

        alert(
            'Server API called with: sort by ' +
            column.property +
            ' ' +
            updatedSortingColumns[column.property].direction
        );

        this.getAppList("production", updatedSortingColumns, this.state.pagination);
    };

    onSelectRow = (event:React.ChangeEvent<HTMLInputElement>, row) => {
        const { sortingColumns, pagination } = this.state;
        // MockServerApi.selectRow({ row }).then(response => {
        //   // refresh rows after row is selected
        //   this.getPage(sortingColumns, pagination);
        // });
    };
    onSelectAllRows = (event:React.ChangeEvent<HTMLInputElement>) => {
        console.log((event));
        const { sortingColumns, pagination, rows } = this.state;
        const checked = event.target.checked;
        // MockServerApi.selectAllRows({ rows, checked })
        // .then(response => {
        //   // refresh rows after all rows selected
        //   this.getPage(sortingColumns, pagination);
        // });
    };

    onPerPageSelect = (eventKey, e) => {
        console.log("per page select");
        let newPaginationState = Object.assign({}, this.state.pagination);
        newPaginationState.perPage = eventKey;
        newPaginationState.page = 1;
        this.getAppList("production", this.state.sortingColumns, newPaginationState);
    };

    onPageSet = (page) => {
        console.log("on page set");
        let newPaginationState = Object.assign({}, this.state.pagination);
        newPaginationState.page = page;
        this.getAppList("production", this.state.sortingColumns, newPaginationState);
    };

    render() {
        const { columns, pagination, sortingColumns, rows, itemCount } = this.state;

        return (
            <Grid fluid>
                <FormGroup controlId="environment">
                    <ControlLabel>Environment</ControlLabel>
                    <FormControl componentClass="select" 
                        placeholder="Select Environment"
                        onChange={this.selelectOption}>
                        <option value="production">Production</option>
                        <option value="test">Test</option>
                    </FormControl>
                </FormGroup>

                <Table.PfProvider striped bordered hover dataTable
                    columns={columns}
                    components={{
                        header: {
                            cell: cellProps => {
                                return this.customHeaderFormatters({
                                    cellProps,
                                    columns,
                                    sortingColumns,
                                    rows: rows,
                                    onSelectAllRows: this.onSelectAllRows,
                                    onSort: this.onSort
                                });
                            }
                        }
                    }}
                >
                    <Table.Header headerRows={resolve.headerRows({ columns })} />
                    <Table.Body rows={rows} rowKey="appId" onRow={AppList.onRow} />
                </Table.PfProvider>

                <Paginator
                    viewType={PAGINATION_VIEW.TABLE}
                    pagination={pagination}
                    itemCount={itemCount}
                    onPageSet={this.onPageSet}
                    onPerPageSelect={this.onPerPageSelect}
                />
            </Grid>
        );
    }
}
// AppList.propTypes = {
//   onServerPageLogger: PropTypes.func.isRequired
// }