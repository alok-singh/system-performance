import React, { Component, Fragment } from 'react';
import {tableCellFormatter} from 'patternfly-react';
import {Link} from 'react-router-dom';

export const gitRepositoryColumns = [{
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
},{
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
        formatters: [tableCellFormatter]
    }
},{
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
        formatters: [tableCellFormatter]
    }
},{
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
}];