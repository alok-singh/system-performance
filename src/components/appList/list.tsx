import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import * as resolve from 'table-resolver';
import { Link } from 'react-router-dom';
import {rows, columns, sortingColumns} from './tableSettings';
import {get} from '../../services/api';

import {
    customHeaderFormattersDefinition,
    selectionCellFormatter,
    selectionHeaderCellFormatter,
    sortableHeaderCellFormatter,
    tableCellFormatter,
    Table,
    FormGroup, 
    ControlLabel, 
    FormControl, 
    Grid, 
    Paginator, 
    Popover, 
    OverlayTrigger,
    PAGINATION_VIEW,
    TABLE_SORT_DIRECTION
} from 'patternfly-react';

import {Host, Routes} from '../../config/constants';
import {AppListData} from '../../modals/appTypes';

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
            rows: rows,

            // Sort the first column in an ascending way by default.
            sortingColumns: sortingColumns,

            // column definitions
            columns: columns,

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

        const URL = `${Host}${Routes.APP_LIST}`;

        let requestBody = {

        }

        get(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        }).then((response) => {
            console.log(response);
        }, (error) => {

        });


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