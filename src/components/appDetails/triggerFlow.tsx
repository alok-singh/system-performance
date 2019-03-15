import React, { Component } from 'react';
import TriggerNode from './triggerNode';

import Defs from '../common/defs';
import BackDrop from '../common/backdrop';
import Popup from '../common/popup';

import '../../css/triggerFlowChart.css';

interface TriggerFlowChartState {
    title: string;
}

interface TriggerFlowChartProps {

}

export default class TriggerFlowChart extends Component <TriggerFlowChartProps, TriggerFlowChartState> {
	
    constructor(props) {
        super(props);
        this.state = {
            title: 'My Name is Khan'
        }
    }

    renderNode() {
        return <TriggerNode 
            x={100}
            y={20}
            title={this.state.title} 
        />
    }

    renderBackDrop() {
        return <BackDrop />
    }

    renderDefs() {
        return <Defs />
    }

    render() {
		return <svg className="trigger-flow">
            {this.renderBackDrop()}
            {this.renderDefs()}
		    {this.renderNode()}
		</svg>
	} 
}