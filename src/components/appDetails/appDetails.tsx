import React, { Component, ChangeEvent } from 'react';
import { Host, Routes } from '../../config/constants';
import * as resolve from 'table-resolver';
import classNames from 'classnames';
import ContentOverlayModal from './contentOverlayModal';

import { getInstanceColumn } from './instanceColumn';
import { getLinkOutColumns } from './linkoutColumns';

import { 
    ToastNotificationList, 
    ToastNotification, 
    Grid, 
    Row, 
    Col, 
    Button, 
    FormGroup, 
    ControlLabel, 
    FormControl, 
    Modal, 
    ModelessOverlay, 
    Tabs, 
    Tab, 
    customHeaderFormattersDefinition, 
    Table 
} from 'patternfly-react';

import { AppDetailsProps, AppDetailsState, Instance } from '../../modals/appTypes';

export default class AppDetails extends Component<AppDetailsProps, AppDetailsState> {

    customHeaderFormatters: any;

    constructor(props: AppDetailsProps) {
        super(props);
        this.state = {
            code: 0,
            successMessage: null,
            errors: [],
            deploymentDetails: {
                appId: 0,
                time: "",
                sourceRef: "",
                deployedBy: "",
                dockerTag: "",
            },
            instances: [],
            linkouts: [],
            currentInstanceIndex: 0,
            currentContainerIndex: 0,
            maxLogs: 40,
            showOverlay: false
        }
    }

    onRow(row, { rowIndex }) {
        return {
            className: classNames({ selected: row.selected }),
            role: 'row'
        };
    }

    componentDidMount() {
        let state = { ...this.state };
        state.deploymentDetails.appId = parseInt(this.props.appId);
        this.getInstances();
    }

    //TODO: Use/Remove Later
    handleMaxLogs(event: ChangeEvent<HTMLInputElement>) {
        let state = { ...this.state };
        state.maxLogs = parseInt(event.target.value);
        this.setState(state);
    }

    handleInstanceAndContainerChange(event: ChangeEvent<HTMLInputElement> | null, instanceIndex: number, containerIndex: number) {
        let state = { ...this.state };

        let container = state.instances[state.currentInstanceIndex].containers[state.currentContainerIndex];

        //remove old logs
        if (container.eventSourceRef) {
            container.eventSourceRef.close();
        }

        container.logs = [];

        //set new indexes
        if (instanceIndex >= 0) {
            state.currentInstanceIndex = instanceIndex;
        }
        if (containerIndex >= 0) {
            state.currentContainerIndex = containerIndex;
        }

        //Set Logs of new current instance && container
        container = state.instances[state.currentInstanceIndex].containers[state.currentContainerIndex];

        //show Overlay
        state.showOverlay = true;
        this.setState(state);

        let url = container.URL;

        //TODO: remove url and eventSourceRef
        url = `${Host}${Routes.LOGS}`;
        container.eventSourceRef = new EventSource(url);

        container.eventSourceRef.addEventListener("message", (event) => {
            container.logs.push(event.data);
            let lengthOfLogs = container.logs.length;
            if (lengthOfLogs > this.state.maxLogs) {
                container.logs = container.logs.slice(lengthOfLogs - this.state.maxLogs, lengthOfLogs);
            }

            //Scroll to bottom if user is at bottom
            let element: HTMLDivElement | null = document.querySelector(".fixed-height-logs-container.active");
            if (element && (element.scrollTop + element.offsetHeight >= element.scrollHeight - 20)) {
                element.scrollTo(0, element.scrollHeight);
            }
            this.setState(state);
        })

    }

    toggleOverlay() {
        let state = { ...this.state };
        state.showOverlay = !state.showOverlay;
        if (!state.showOverlay) {
            let container = state.instances[this.state.currentInstanceIndex].containers[state.currentContainerIndex];
            if (container.eventSourceRef) container.eventSourceRef.close();
            container.logs = [];
        }
        this.setState(state);
    }

    getInstances() {
        const URL = `${Host}${Routes.INSTANCE_LIST}`;
        fetch(URL, {
            method: 'GET',
            headers: { 'Content-type': 'application/json' },
        }).then(response => response.json()).then(response => {
            let state = { ...this.state };
            let allInstances = response.result.instances;
            
            state.code = response.code;
            state.errors = response.errors ? response.errors : [];
            state.linkouts = response.result.linkouts;
            state.instances = (allInstances && allInstances.length) ? allInstances.map(instance => {
                return new Instance(instance);
            }) : [];
            
            this.setState(state, () => {
                setTimeout(() => {
                    this.closeNotification();
                }, 2000);
            });
        }, error => {
            console.log(error);
        })
    }

    //Clears error messages and response code
    closeNotification() {
        let state = { ...this.state };
        state.code = 0;
        state.errors = [];
        state.successMessage = null;
        this.setState(state);
    }

    //TODO: use later
    renderNotification() {
        let { code, errors } = { ...this.state };

        let successCodes = new Set([200, 201, 202, 204, 204, 205, 206, 207, 208, 226]);

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

    renderDeploymentDetails() {
        var self = this;
        let listItem = Object.keys(this.state.deploymentDetails);
        return <Col xs={12} sm={12} md={4}>
            <div className="card">
                <h3 className="h3">Deployment Details</h3>
                <ul className="w-100 list">
                    {listItem.map(function (key, index) {
                        return (
                            <li key={index}>
                                <strong>{key}</strong>
                                <span>{self.state.deploymentDetails[key]}</span>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </Col>
    }

    renderInstanceList() {
        let rows = this.state.instances;
        let columns = getInstanceColumn((name, obj) => {
            return <Button className="table-button" type="button" onClick={(event) => { this.handleInstanceAndContainerChange(event, obj.rowIndex, -1)}} >
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
        let rows = this.state.linkouts;
        let columns = getLinkOutColumns((name, obj) => {
            return <Button className="table-button" type="button"
                onClick={() => { window.open("http://google.com") }}>
                {name}
            </Button>
        });

        if(rows) {
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
        let {currentInstanceIndex, instances} = this.state
        let currentInstance = instances[currentInstanceIndex];
        if(currentInstance && currentInstance.containers && currentInstance.containers.length){
            return <ContentOverlayModal 
                showOverlay={this.state.showOverlay}
                toggleOverlay={() => this.toggleOverlay()}
                currentInstanceIndex={this.state.currentInstanceIndex}
                handleInstanceAndContainerChange={(event, instanceIndex, containerIndex) => this.handleInstanceAndContainerChange(event, instanceIndex, containerIndex)}
                instances={this.state.instances}
                maxLogs={this.state.maxLogs}
                containers={currentInstance.containers}
            />
        }
        else{
            return null;
        }
    }

    render() {
        return (
            <Grid bsClass="w-100">
                <Row style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '20px', marginTop: '20px' }}>
                    {this.renderDeploymentDetails()}
                    {this.renderInstanceList()}
                    {this.renderLinkouts()}
                </Row>
                {this.renderContainersOverlay()}
            </Grid >
        )
    }
}