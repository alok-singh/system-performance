import * as React from 'react';

interface LoaderProps {
	isLoading: boolean;
}

export default class Loader extends React.Component<LoaderProps> {
    render() {
    	let isVisibleClass = this.props.isLoading ? '' : 'u-hide'
        return (
        	<div className={`u-overlay ${isVisibleClass}`}>
	        	<div className='u-loader'>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	    <div></div>
	        	</div>
        	</div>
        )
    }
}