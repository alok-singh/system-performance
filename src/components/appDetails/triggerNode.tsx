import React, { Component } from 'react';
import {nodeSizes} from '../../config/sizes';
import {nodeColors} from '../../config/colors';

import {Card, CardTitle, CardBody} from 'patternfly-react';

export default class TriggerNode extends Component <any>{
	
	renderCardContent() {
	        return <Card style={{border: '1px solid #eaeaea'}}>
	            <CardTitle>
	                {this.props.title}
	            </CardTitle>
	            <CardBody>
	                some description
	            </CardBody>
	        </Card>
	    }

	render() {
		return <foreignObject x={this.props.x} y={this.props.y} width={nodeSizes.nodeWidth} height={nodeSizes.nodeHeight} style={{overflow: 'visible', position: 'relative'}}>
            {this.renderCardContent()}
        </foreignObject>
	} 
}