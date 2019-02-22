import React, { Component } from 'react';
import {nodeSizes} from '../config/sizes';
import {nodeColors} from '../config/colors';

export default class Node extends Component {

    render() {
        return <g>
            <rect 
                x={this.props.x} 
                y={this.props.y} 
                width={nodeSizes.nodeWidth} 
                height={nodeSizes.nodeHeight} 
                rx={nodeSizes.borderRadius} 
                ry={nodeSizes.borderRadius} 
                fill="#fff"
                stroke="rgba(0,0,0,0.38)"
                strokeWidth={nodeSizes.strokeWidth}
            />
            <circle 
                r={nodeSizes.circleRadius} 
                cx={this.props.x} 
                cy={parseInt(this.props.y) + (nodeSizes.nodeHeight/2)} 
                onClick={(event) => this.props.handleClickCircle(event, true)}
                fill="#eaeaea" 
                stroke="rgba(0,0,0,0.38)"
            />
            <circle 
                r={nodeSizes.circleRadius} 
                cx={parseInt(this.props.x) + nodeSizes.nodeWidth} 
                cy={parseInt(this.props.y) + (nodeSizes.nodeHeight/2)} 
                onClick={(event) => this.props.handleClickCircle(event, false)} 
                fill="#eaeaea" 
                stroke="rgba(0,0,0,0.38)" 
            />
            <foreignObject 
                onMouseDown={this.props.handleMouseDown} 
                onMouseUp={this.props.handleMouseUp} 
                x={this.props.x} 
                y={this.props.y} 
                width={nodeSizes.nodeWidth} 
                height={nodeSizes.nodeHeight}>
                    <div 
                        className="text-container" 
                        style={{height: `${nodeSizes.nodeHeight}px`, width: `${nodeSizes.nodeWidth}px`}} 
                        suppressContentEditableWarning={true} 
                        contentEditable="true" 
                        onChange={this.props.handleTextChange}
                    >
                        <div>{this.props.title}</div>
                    </div>
            </foreignObject>
            <circle 
                r={nodeSizes.circleRadius} 
                cx={parseInt(this.props.x) + nodeSizes.nodeWidth - 10} 
                cy={parseInt(this.props.y) + 10} 
                onClick={this.props.handleClickOptions} 
                fill={nodeColors.orange} 
                stroke="rgba(0,0,0,0.38)" 
            />
        </g>
    }
}