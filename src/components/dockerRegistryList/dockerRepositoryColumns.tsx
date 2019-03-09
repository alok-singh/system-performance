import React, { Component, Fragment } from 'react';
import {tableCellFormatter} from 'patternfly-react';
import {Link} from 'react-router-dom';

export const dockerRepositoryColumns = [
    {
        property: 'id',
        header: {
            label: 'ID',
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
                (id, obj) => {
                    const LINK = `/form-global/docker-register/${obj.rowData.id}`;
                    return (
                        <span className="font-black">
                            <Link to={LINK}>{id}</Link>
                        </span>
                    )
                },
                tableCellFormatter
            ]
        }
    },
    {
        property: 'registryURL',
        header: {
            label: 'Registry URL',
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
        property: 'registryType',
        header: {
            label: 'Registry Type',
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
        property: 'isDefault',
        header: {
            label: 'Default',
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
                (isDefault) => {
                    if (isDefault)
                        return (<p className="m-5">Default</p>)
                    else
                        return (<p className="m-5">No</p>)
                },
                tableCellFormatter
            ]
        }
    },

]