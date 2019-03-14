import { tableCellFormatter } from 'patternfly-react';

export const getLinkOutColumns = (formatterHandler) => {
	return [{
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
                formatterHandler,
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
    }]
}