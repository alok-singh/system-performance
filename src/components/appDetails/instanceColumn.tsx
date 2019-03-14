import { tableCellFormatter } from 'patternfly-react';

export const getInstanceColumn = (formatterHandler) => {
	return [{
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
	            formatterHandler,
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
	}]
}