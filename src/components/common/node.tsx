import * as React from 'react';
import {nodeSizes} from '../config/sizes';
import {nodeColors} from '../config/colors';

interface NodeProps {
    x: number;
    y: number;
    id: string;
    title: string;
    activeIn: boolean;
    activeOut: boolean;
    handleMouseUp(event: any): void;
    handleMouseDown(event: any): void;
    handleTextChange(event: any): void;
    handleClickCircle(event:any, isInput:boolean): void;
    handleClickOptions(event: any): void;
}

export default class Node extends React.Component <NodeProps>{

    renderRectangle() {
        return <rect 
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
    }

    renderCircle(offsetX: number, offsetY: number, onClickHandler: (event:any) => void, isActive: boolean, fillColor: string = nodeColors.strokeColor) {
        return <circle 
            r={nodeSizes.circleRadius} 
            cx={this.props.x + offsetX} 
            cy={this.props.y + offsetY} 
            onClick={onClickHandler}
            fill={fillColor} 
            stroke="rgba(0,0,0,0.38)"
            className={isActive ? "active" : ""}
        />
    }

    renderTextArea() {
        return <foreignObject 
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
                    contentEditable={true}
                    onChange={this.props.handleTextChange}
                >
                    <div>{this.props.title}</div>
                </div>
        </foreignObject>
    }

    render() {
        return <g>
            {this.renderRectangle()}
            {this.renderTextArea()}
            {this.renderCircle(0, nodeSizes.nodeHeight/2, (event) => this.props.handleClickCircle(event, true), this.props.activeIn)}
            {this.renderCircle(nodeSizes.nodeWidth, nodeSizes.nodeHeight/2, (event) => this.props.handleClickCircle(event, false), this.props.activeOut)}
            {this.renderCircle(nodeSizes.nodeWidth - 10, 10, this.props.handleClickOptions, false, nodeColors.orange)}
        </g>
    }
}