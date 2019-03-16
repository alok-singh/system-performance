import React, { Component, ChangeEvent } from 'react';
import { Host, Routes } from '../../config/constants';
import { ToastNotification, Grid, Button } from 'patternfly-react';
import { AppDetailsProps, AppDetailsState, Instance } from '../../modals/appTypes';
import { getInstances } from './service';
import AppDetailsContent from './appDetailsContent';

export default class AppDetails extends Component<AppDetailsProps, AppDetailsState> {

    constructor(props: AppDetailsProps) {
        super(props);
        this.state = {
            code: 0,
            successMessage: null,
            errors: [],
            eventSourceRef: null,
            logs: [],
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
            maxLogs: 10,
            showOverlay: false
        }
    }

    componentDidMount() {
        let state = { ...this.state };
        state.deploymentDetails.appId = parseInt(this.props.appId);
        this.getInstances();
    }

    getInstances = () => {
        getInstances()
            .then(response => {
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

    //TODO: Use/Remove Later
    handleMaxLogs(event: ChangeEvent<HTMLInputElement>) {
        let state = { ...this.state };
        state.maxLogs = parseInt(event.target.value);
        this.setState(state);
    }

    handleInstanceAndContainerChange(event: ChangeEvent<HTMLInputElement> | null, instanceIndex: number, containerIndex: number) {
        let state = { ...this.state };

        //remove old logs
        if (state.eventSourceRef) {
            state.eventSourceRef.close()
        }
        state.logs = [];

        //set new indexes
        if (instanceIndex >= 0) {
            state.currentInstanceIndex = instanceIndex;
        }
        if (containerIndex >= 0) {
            state.currentContainerIndex = containerIndex;
        }

        //show Overlay
        state.showOverlay = true;
        this.setState(state);


        //TODO: remove url
        let url = `${Host}${Routes.LOGS}`;
        // let url = container.URL;
        state.eventSourceRef = new EventSource(url);

        state.eventSourceRef.addEventListener("message", (event) => {
            state.logs.push(event.data);
            let lengthOfLogs = state.logs.length;
            if (lengthOfLogs > this.state.maxLogs) {
                state.logs = state.logs.slice(lengthOfLogs - this.state.maxLogs, lengthOfLogs);
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
        if (!state.showOverlay && state.eventSourceRef) {
            state.eventSourceRef.close();
            state.logs = [];
        }
        this.setState(state);
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
                    <span>App Details Found</span>
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

    renderAppDetailsContent() {
        let { currentInstanceIndex, instances } = this.state
        let currentInstance = instances[currentInstanceIndex];
        if (currentInstance && currentInstance.containers && currentInstance.containers.length) {
            return <AppDetailsContent
                logs={this.state.logs}
                showOverlay={this.state.showOverlay}
                toggleOverlay={() => this.toggleOverlay()}
                currentInstanceIndex={this.state.currentInstanceIndex}
                handleInstanceAndContainerChange={(event, instanceIndex, containerIndex) => this.handleInstanceAndContainerChange(event, instanceIndex, containerIndex)}
                instances={this.state.instances}
                maxLogs={this.state.maxLogs}
                deploymentDetails={this.state.deploymentDetails}
                linkouts={this.state.linkouts}
                containers={currentInstance.containers}>
            </AppDetailsContent>
        }
        else {
            return null;
        }
    }

    render() {
        return (
            <Grid bsClass="w-100">
                {this.renderAppDetailsContent()}
            </Grid >
        )
    }
}