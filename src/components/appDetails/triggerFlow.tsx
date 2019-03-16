import React, { Component } from 'react';
import TriggerNode, {TriggerNodeType} from './triggerNode';

import {get} from '../../services/api';

import {Host, Routes} from '../../config/constants';

import Defs from '../common/defs';
import BackDrop from '../common/backdrop';
import Popup from '../common/popup';
import Edge from '../flowChart/straightEdge';

import '../../css/triggerFlowChart.css';


interface TriggerFlowChartState {
    nodes: TriggerNodeType[];
    topEdge: TriggerEdgeType | null;
}

interface TriggerFlowChartProps {
    appId: string;
}

interface TriggerEdgeType {
    startNode: TriggerNodeType,
    endNode: TriggerNodeType
}

export default class TriggerFlowChart extends Component <TriggerFlowChartProps, TriggerFlowChartState> {
	
    constructor(props) {
        super(props);
        this.state = {
            nodes: [],
            topEdge: null 
        }
    }

    onScroll(event) {

    }

    onMouseOverEdge(startNode, endNode) {
        this.setState({
            topEdge: {
                startNode,
                endNode
            }
        })
    }

    componentDidMount() {
        get(`${Host}${Routes.TRIGGER_NODE_LIST}/${this.props.appId}`, {}).then(data => {
            if(data.result && data.result.nodes) {
                console.log(data.result.nodes);
                this.setState({
                    nodes: data.result.nodes
                });
            }
        }, err => {
            console.log(err);
        });
    }

    renderNodes() {
        return this.state.nodes.map(node => {
            return <TriggerNode 
                x={node.x}
                y={node.y}
                id={node.id}
                key={`trigger-node-${node.id}`} 
                appName={node.appName}
                environmentName={node.environmentName}
                colorCode={node.colorCode}
                triggerMetaData={node.triggerMetaData}
                inputMaterialsNew={node.inputMaterialsNew}
                inputMaterialsSuccess={node.inputMaterialsSuccess}
                inputMaterialsFailed={node.inputMaterialsFailed}
            />
        })
    }

    getEdges() {
        let edges = this.state.nodes.reduce((edgeList, node) => {
            node.downstreams.forEach(nodeID => {
                let endNode = this.state.nodes.find(val => val.id == nodeID);
                edgeList.push({
                    startNode: node,
                    endNode: endNode
                });
            });
            return edgeList;
        }, []);

        if(this.state.topEdge){
            let {topEdge} = this.state;
            let atWhich = edges.findIndex(edge => {
                if(edge.startNode.id == topEdge.startNode.id && edge.endNode.id == topEdge.endNode.id){
                    return true;
                }
            });
            edges = edges.slice(0, atWhich).concat(edges.slice(atWhich + 1));
            edges.push(topEdge);
        }

        return edges;
    }

    renderEdgeList() {
        return this.getEdges().map(edgeNode => {
            let startNode: any = edgeNode.startNode;
            let endNode: any = edgeNode.endNode;
            return <Edge
                key={`trigger-edge-${startNode.id}-${endNode.id}`} 
                startNode={startNode} 
                endNode={endNode} 
                onClickEdge={() => {}}
            />
                // onMouseOverEdge={(startNode: TriggerNodeType, endNode: TriggerNodeType) => this.onMouseOverEdge(startNode, endNode)}
                // deleteEdge={() => {}}
        })
    }

    renderBackDrop() {
        return <BackDrop />
    }

    renderDefs() {
        return <Defs />
    }

    render() {
		return <div className="svg-wrapper-trigger" onScroll={(event) => this.onScroll(event)}>
            <svg>
                {this.renderBackDrop()}
                {this.renderDefs()}
    		    {this.renderNodes()}
                {this.renderEdgeList()}
    		</svg>
        </div>
	} 
}