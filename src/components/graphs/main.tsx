import React, {Component} from 'react';
import {SparklineChart} from 'patternfly-react';
import {getGraphData} from '../helpers/graphDataGenerator';


interface GraphState {
	columns: any[]
}

export default class Graph extends Component <any, GraphState> {
	
	constructor(props) {
		super(props);
		this.state = {
			columns: getGraphData()
		}
	}

	render() {
		return <SparklineChart 
			id="line-chart-1" 
			data={{columns: this.state.columns, type: 'area'}} 
			size={{width: 1000,height: 400}} 
			zoom={{enabled: true}}
			axis={{x: {show: true}, y: {show: true}}}
		/>
	}
}


