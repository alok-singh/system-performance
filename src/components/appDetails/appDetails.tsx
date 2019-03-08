import React, { Component, ChangeEvent } from 'react';
import { Host, Routes } from '../../config/constants';
import * as resolve from 'table-resolver';
import classNames from 'classnames';

import { ToastNotificationList, ToastNotification, Grid, Row, Col, Button } from 'patternfly-react';
import { FormGroup, ControlLabel, FormControl } from 'patternfly-react';
import { Modal, ModelessOverlay } from 'patternfly-react';
import { Tabs, Tab } from 'patternfly-react';

import {
    customHeaderFormattersDefinition,
    tableCellFormatter,
    Table
} from 'patternfly-react';

import { AppDetailsProps, AppDetailsState, Instance } from './appTypes';

export default class AppDetails extends Component<AppDetailsProps, AppDetailsState> {

    static onRow(row, { rowIndex }) {
        return {
            className: classNames({ selected: row.selected }),
            role: 'row'
        };
    }

    customHeaderFormatters: any;

    constructor(props: AppDetailsProps) {
        super(props);
        this.customHeaderFormatters = customHeaderFormattersDefinition;

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

    componentDidMount = () => {
        let state = { ...this.state };
        state.deploymentDetails.appId = parseInt(this.props.appId);
        this.getInstances();
    }

    //TODO: Use/Remove Later
    handleMaxLogs = (event: ChangeEvent<HTMLInputElement>) => {
        let state = { ...this.state };
        state.maxLogs = parseInt(event.target.value);
        this.setState(state);
    }

    handleInstanceAndContainerChange = (event: ChangeEvent<HTMLInputElement> | null, instanceIndex: number, containerIndex: number) => {
        let state = { ...this.state };

        let container = state.instances[state.currentInstanceIndex].containers[state.currentContainerIndex];

        //remove old logs
        if (container.eventSourceRef) container.eventSourceRef.close();
        container.logs = [];

        //set new indexes
        if (instanceIndex >= 0)
            state.currentInstanceIndex = instanceIndex;
        if (containerIndex >= 0)
            state.currentContainerIndex = containerIndex;

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

    toggleOverlay = () => {
        let state = { ...this.state };
        state.showOverlay = !state.showOverlay;
        if (!state.showOverlay) {
            let container = state.instances[this.state.currentInstanceIndex].containers[state.currentContainerIndex];
            if (container.eventSourceRef) container.eventSourceRef.close();
            container.logs = [];
        }
        this.setState(state);
    }

    scrollToBottom = () => {
        let element: any = document.querySelector(".fixed-height-logs-container.active");
        if (element) {
            element.scrollTo(0, element.scrollHeight);
        }
    }
    getInstances = () => {
        const URL = `${Host}${Routes.INSTANCE_LIST}`;
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

                    let allInstances = response.result.instances;
                    for (let i = 0; i < allInstances.length; i++) {
                        state.instances.push(new Instance(allInstances[i]));
                    }

                    state.linkouts = response.result.linkouts;
                    this.setState(state);
                    setTimeout(() => {
                        this.closeNotification();
                    }, 2000);

                },
                (error) => {
                    console.log(error);
                }
            )
    }

    //Clears error messages and response code
    closeNotification = () => {
        let state = { ...this.state };
        state.code = 0;
        state.errors = [];
        state.successMessage = null;
        this.setState(state);
    }

    //TODO: use later
    renderNotification = () => {
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

    renderDeploymentDetails = () => {
        var self = this;
        let listItem = Object.keys(this.state.deploymentDetails);

        return (
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

        );
    }

    renderInstanceList = () => {
        let columns, rows;
        rows = this.state.instances;

        //Table Definition
        columns = [
            {
                property: 'name',
                header: {
                    label: 'Name',
                    props: {
                        index: 0,
                        rowSpan: 1,
                        colSpan: 1,
                    },
                    formatters: [tableCellFormatter]
                },
                cell: {
                    props: {
                        index: 0,
                    },
                    formatters: [
                        (name, obj) => {
                            return (
                                <Button className="table-button" type="button"
                                    onClick={(event) => { this.handleInstanceAndContainerChange(event, obj.rowIndex, -1) }}
                                >
                                    {name}
                                </Button>
                            )
                        },
                        tableCellFormatter
                    ]
                }
            },
            {
                property: 'cpu',
                header: {
                    label: 'CPU',
                    props: {
                        index: 1,
                        rowSpan: 1,
                        colSpan: 1,
                    },
                    formatters: [tableCellFormatter]
                },
                cell: {
                    props: {
                        index: 1,
                    },
                    formatters: [
                        tableCellFormatter
                    ]
                }
            },
            {
                property: 'ram',
                header: {
                    label: 'RAM',
                    props: {
                        index: 2,
                        rowSpan: 1,
                        colSpan: 1,
                    },
                    formatters: [tableCellFormatter]
                },
                cell: {
                    props: {
                        index: 2,
                    },
                    formatters: [
                        tableCellFormatter
                    ]
                }
            },
            {
                property: 'status',
                header: {
                    label: 'Status',
                    props: {
                        index: 3,
                        rowSpan: 1,
                        colSpan: 1,
                    },
                    formatters: [tableCellFormatter]
                },
                cell: {
                    props: {
                        index: 3,
                    },
                    formatters: [
                        tableCellFormatter
                    ]
                }
            },
        ]

        return (
            <Table.PfProvider hover dataTable className="scrollable-pf-table"
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
                    onRow={AppDetails.onRow}
                />

            </Table.PfProvider>
        )
    }

    renderLinkouts = () => {
        if (!this.state.linkouts) return;
        let columns, rows;
        rows = this.state.linkouts;

        //Table Definition
        columns = [
            {
                property: 'displayName',
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
                            return (
                                <Button className="table-button" type="button"
                                    onClick={() => { window.open("http://google.com") }}>
                                    {name}
                                </Button>
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
                    },
                    formatters: [tableCellFormatter]
                },
                cell: {
                    props: {
                        index: 1,
                    },
                    formatters: [
                        tableCellFormatter
                    ]
                }
            },


        ]

        return (
            <Table.PfProvider hover dataTable className="scrollable-pf-table"
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

                <Table.Body rows={rows} rowKey="displayName"
                    onRow={AppDetails.onRow}
                />

            </Table.PfProvider>
        )
    }

    renderContainersOverlay = () => {
        if (this.state.instances.length === 0) return;
        let containers = this.state.instances[this.state.currentInstanceIndex].containers;
        if (containers.length === 0) return;

        return (
            <ModelessOverlay show={this.state.showOverlay} size="lg" className="modaless-overlay-pf-custom">
                <Modal.Header>
                    <Modal.CloseButton onClick={this.toggleOverlay}>X</Modal.CloseButton>
                    <Modal.Title>Containers</Modal.Title>
                </Modal.Header>

                <Modal.Body style={{ position: 'relative' }}>
                    <Row className="m-lr-0">
                        <Col lg={12}>
                            <FormGroup controlId="currentInstanceIndex">
                                <ControlLabel>Select Instance</ControlLabel>
                                <FormControl
                                    componentClass="select"
                                    value={this.state.currentInstanceIndex}
                                    onChange={(event) => { console.log(event.target.value); this.handleInstanceAndContainerChange(event, event.target.value, -1) }}
                                    placeholder="Select Current Instance" >
                                    {this.state.instances.map(
                                        (instance, index) => {
                                            return (
                                                <option key={index} value={index}>{instance.name}</option>
                                            )
                                        }
                                    )}
                                </FormControl>
                            </FormGroup>
                        </Col>

                        {/* <Col lg={5}>
                            <FormGroup controlId="maxLogs">
                                <ControlLabel>Enter Maximum Logs</ControlLabel>

                                <FormControl type="text"
                                    value={this.state.maxLogs}
                                    onChange={(event) => { }}
                                    placeholder="Enter Max Logs" >
                                </FormControl>
                            </FormGroup>
                        </Col> */}

                    </Row>

                    <Tabs onSelect={(activeKey) => this.handleInstanceAndContainerChange(null, -1, activeKey)}
                        defaultActiveKey={0} animation={true} id="container">
                        {
                            containers.map(
                                (container, index) => {
                                    let logs = container.logs;
                                    return (
                                        <Tab className="fixed-height-logs-container" eventKey={index} title={container.name} key={index}>
                                            {logs.map(
                                                (log, logIndex) => {
                                                    return (<li key={logIndex}>{log}</li>)
                                                }
                                            )}
                                        </Tab>
                                    )
                                }
                            )
                        }
                    </Tabs>

                    <button type="button" className="button-scroll-bottom" onClick={() => { this.scrollToBottom() }}>
                        <i className="fa fa-arrow-down"></i>
                    </button>

                </Modal.Body>

            </ModelessOverlay>
        )
    }

    render() {
        return (
            <Grid bsClass="w-100">
                <Row style={{ marginLeft: '0px', marginRight: '0px', marginBottom: '20px', marginTop: '20px' }}>
                    <Col xs={12} sm={12} md={4}>
                        <div className="card">
                            <h3 className="h3">Deployment Details</h3>
                            {this.renderDeploymentDetails()}
                        </div>
                    </Col>

                    <Col xs={12} sm={12} md={4}>
                        <div className="card">
                            <h3 className="h3">Instances</h3>
                            {this.renderInstanceList()}
                        </div>
                    </Col>

                    <Col xs={12} sm={12} md={4}>
                        <div className="card">
                            <h3 className="h3">Linkouts</h3>
                            {this.renderLinkouts()}
                        </div>
                    </Col>
                </Row>
                {this.renderContainersOverlay()}
            </Grid >
        )
    }
}