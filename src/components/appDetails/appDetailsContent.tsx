import React, { Component, Fragment } from 'react';
import { Table, Button, Row, Col, customHeaderFormattersDefinition } from 'patternfly-react';
import { getInstanceColumn } from './instanceColumn';
import { getLinkOutColumns } from './linkoutColumns';
import ContentOverlayModal from './contentOverlayModal';
import classNames from 'classnames';
import * as resolve from 'table-resolver';


export default class AppDetailsContent extends Component<any>{

    onRow(row, { rowIndex }) {
        return {
            className: classNames({ selected: row.selected }),
            role: 'row'
        };
    }

    cellPropHandler(rows, columns) {
        return {
            header: {
                cell: cellProps => {
                    return customHeaderFormattersDefinition({
                        cellProps: cellProps,
                        columns: columns,
                        rows: rows,
                    });
                }
            }
        }
    }
    renderLinkouts() {
        let rows = this.props.linkouts;
        let columns = getLinkOutColumns((name, obj) => {
            return <Button className="table-button" type="button"
                onClick={() => { window.open("http://google.com") }}>
                {name}
            </Button>
        });

        if (rows) {
            return <Col xs={12} sm={12} md={4}>
                <div className="card">
                    <h3 className="h3">Linkouts</h3>
                    <Table.PfProvider hover dataTable className="scrollable-pf-table" columns={columns} components={this.cellPropHandler(rows, columns)}>
                        <Table.Header headerRows={resolve.headerRows({ columns })} />
                        <Table.Body rows={rows} rowKey="displayName" onRow={this.onRow} />
                    </Table.PfProvider>
                </div>
            </Col>
        }
        else {
            return null;
        }
    }

    renderContainersOverlay() {
        let { currentInstanceIndex, instances } = this.props;
        let currentInstance = instances[currentInstanceIndex];

        return <ContentOverlayModal
            logs={this.props.logs}
            showOverlay={this.props.showOverlay}
            toggleOverlay={() => this.props.toggleOverlay()}
            currentInstanceIndex={this.props.currentInstanceIndex}
            handleInstanceAndContainerChange={(event, instanceIndex, containerIndex) => this.props.handleInstanceAndContainerChange(event, instanceIndex, containerIndex)}
            instances={this.props.instances}
            maxLogs={this.props.maxLogs}
            containers={currentInstance.containers}
        />

    }

    renderInstanceList() {
        let rows = this.props.instances;
        let columns = getInstanceColumn((name, obj) => {
            return <Button className="table-button" type="button" onClick={(event) => { this.props.handleInstanceAndContainerChange(event, obj.rowIndex, -1) }} >
                {name}
            </Button>
        });

        return <Col xs={12} sm={12} md={4}>
            <div className="card">
                <h3 className="h3">Instances</h3>
                <Table.PfProvider hover dataTable className="scrollable-pf-table" columns={columns} components={this.cellPropHandler(rows, columns)}>
                    <Table.Header headerRows={resolve.headerRows({ columns })} />
                    <Table.Body rows={rows} rowKey="id" onRow={this.onRow} />
                </Table.PfProvider>
            </div>
        </Col>
    }

    renderDeploymentDetails() {
        var self = this;
        let listItem = Object.keys(this.props.deploymentDetails);
        return <Col xs={12} sm={12} md={4}>
            <div className="card">
                <h3 className="h3">Deployment Details</h3>
                <ul className="w-100 list">
                    {listItem.map(function (key, index) {
                        return (
                            <li key={index}>
                                <strong>{key}</strong>
                                <span>{self.props.deploymentDetails[key]}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </Col>
    }

    render() {
        return (
            <Fragment>
                <Row style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '20px', marginTop: '20px' }}>
                    {this.renderDeploymentDetails()}
                    {this.renderInstanceList()}
                    {this.renderLinkouts()}
                </Row>
                {this.renderContainersOverlay()}
            </Fragment>
        )
    }
}

