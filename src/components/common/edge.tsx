import * as React from 'react';
import {nodeSizes} from '../config/sizes';
import {nodeColors} from '../config/colors';


interface EdgeProps {
    startNode: {
        x: number;
        y: number;
    };
    endNode: {
        x: number;
        y: number;
    };
    onClickEdge: (event: any) => void
}

export default class Edge extends React.Component <EdgeProps>{
    
    getLineDots() {
        return {
            lineStartX: this.props.startNode.x + nodeSizes.nodeWidth,
            lineStartY: this.props.startNode.y + nodeSizes.nodeHeight/2,
            lineEndX: this.props.endNode.x,
            lineEndY: this.props.endNode.y + nodeSizes.nodeHeight/2
        }
    }

    getPathEquation() {
        let {lineStartX, lineStartY, lineEndX, lineEndY} = this.getLineDots();
        return `M${lineStartX}, ${lineStartY} L ${lineEndX} ${lineEndY}`;
    }

    getArrowEquation() {
        let {lineStartX, lineStartY, lineEndX, lineEndY} = this.getLineDots();
        
        let midPointX = (lineStartX + lineEndX)/2;
        let midPointY = (lineStartY + lineEndY)/2;
        
        let slope = (lineEndY - lineStartY)/(lineEndX - lineStartX);
        let complimentrySlope = 0;
        let constant = 0;
        let complementryConstant = 0;
        let sqrtMPlusOne = 0;
        let sqrtCMPlusOne = 0;
        let pointAX = 0;
        let pointAY = 0;
        let pointBX = 0;
        let pointBY = 0;
        let pointCX = 0;
        let pointCY = 0;
        let pointDX = 0;
        let pointDY = 0;

        if(lineEndX < lineStartX){
            return;
        }

        if(lineEndX - lineStartX == 0) {
            complimentrySlope = 0;
            sqrtCMPlusOne = Math.sqrt(1 + complimentrySlope*complimentrySlope);
            
            pointAX = midPointX;
            pointAY = midPointY + nodeSizes.distanceA;
            pointBX = midPointX;
            pointBY = midPointY + nodeSizes.distanceB;

            complementryConstant = pointBY;

            pointCX = pointBX - (nodeSizes.distanceC/sqrtCMPlusOne);
            pointCY = pointCX*complimentrySlope + complementryConstant;
            pointDX = pointBX + (nodeSizes.distanceC/sqrtCMPlusOne);
            pointDY = pointDX*complimentrySlope + complementryConstant;
                
        }
        else {
            if(slope != 0) {
                complimentrySlope = (-1)/slope;
                constant = lineEndY - slope*lineEndX;
                sqrtMPlusOne = Math.sqrt(1 + slope*slope);
                sqrtCMPlusOne = Math.sqrt(1 + complimentrySlope*complimentrySlope);
                
                pointAX = midPointX - (nodeSizes.distanceA/sqrtMPlusOne);
                pointAY = pointAX*slope + constant;
                pointBX = midPointX - (nodeSizes.distanceB/sqrtMPlusOne);
                pointBY = pointBX*slope + constant;

                complementryConstant = pointBY - complimentrySlope*pointBX;

                pointCX = pointBX - (nodeSizes.distanceC/sqrtCMPlusOne);
                pointCY = pointCX*complimentrySlope + complementryConstant;
                pointDX = pointBX + (nodeSizes.distanceC/sqrtCMPlusOne);
                pointDY = pointDX*complimentrySlope + complementryConstant;
            }
            else {
                constant = lineEndY;
                sqrtMPlusOne = Math.sqrt(1 + slope*slope);
                
                pointAX = midPointX - (nodeSizes.distanceA/sqrtMPlusOne);
                pointAY = pointAX*slope + constant;
                pointBX = midPointX - (nodeSizes.distanceB/sqrtMPlusOne);
                pointBY = pointBX*slope + constant;


                pointCX = pointBX;
                pointCY = pointBY + nodeSizes.distanceC;
                pointDX = pointBX;
                pointDY = pointBY - nodeSizes.distanceC;
            }
        }

        return `M${midPointX} ${midPointY} L ${pointCX} ${pointCY} L ${pointAX} ${pointAY} L ${pointDX} ${pointDY} Z`;

        // return [
        //     <circle r={2} cx={midPointX} cy={midPointY} fill="red" />,
        //     <circle r={2} cx={pointAX} cy={pointAY} fill="red" />,
        //     <circle r={2} cx={pointBX} cy={pointBY} fill="red" />,
        //     <circle r={2} cx={pointCX} cy={pointCY} fill="red" />,
        //     <circle r={2} cx={pointDX} cy={pointDY} fill="red" />,
        // ];
    }
    
    render() {
        return <g onClick={this.props.onClickEdge} className="edge-group">
            <path d={this.getPathEquation()} fill="transparent" stroke={nodeColors.strokeColor} strokeWidth={nodeSizes.strokeWidth} />
            <path d={this.getArrowEquation()} fill={nodeColors.strokeColor} />
            {/*this.getArrowEquation()*/}
        </g>
    }
}










