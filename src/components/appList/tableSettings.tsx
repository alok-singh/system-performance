import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';

import {
    TABLE_SORT_DIRECTION,
    selectionCellFormatter,
    selectionHeaderCellFormatter,
    sortableHeaderCellFormatter,
    tableCellFormatter, 
    Popover, 
    OverlayTrigger  
} from 'patternfly-react';

export const rows = [{
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
}, {
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

}, {
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

}];

// Sort the first column in an ascending way by default.
export const sortingColumns = {
    name: {
        direction: TABLE_SORT_DIRECTION.ASC,
        position: 0
    }
};

export const columns = [{
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
                    onSelectRow
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
            (appName, obj) => {
                const LINK = `/details/app/${obj.rowData.appId}`;
                return (
                    <Link to={LINK}>{appName}</Link>
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
}]


const onSelectRow = (event:React.ChangeEvent<HTMLInputElement>, row) => {
    // const { sortingColumns, pagination } = this.state;
    // MockServerApi.selectRow({ row }).then(response => {
    //   // refresh rows after row is selected
    //   this.getPage(sortingColumns, pagination);
    // });
};