import React, {Component} from 'react';
import FlowChart from '../common/flowchart';
import Navigation from '../common/navigation';

export default class FlowChartPage extends Component {
    render() {
		return <Navigation>
			<FlowChart />
		</Navigation>
    }
}