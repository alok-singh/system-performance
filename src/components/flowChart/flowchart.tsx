import React, {Component} from 'react';

import Node from './node';
import Edge from './rectangularEdge';
import Defs from './defs';
import BackDrop from './backdrop';
import Popup from './popup';

import {EnvironmentType} from '../../config/buildConfigurations';
import {generateNode} from '../helpers/nodeGenerator';

import {nodeSizes} from '../../config/sizes';

import '../../css/flowchart.css';

import {
    Button, 
    CardTitle, 
    CardBody,
    Card,
    CardDropdownButton,
    MenuItem,
    CardFooter
} from 'patternfly-react';

interface NodeAttr {
    x: number;
    y: number;
    title: string;
    id: string;
    activeIn: boolean;
    activeOut: boolean;
    condition: string;
    triggerType: string;
    buildType: string;
    environments: EnvironmentType[]; 
    downstreams: string[]
}

interface AppState {
    nodes: NodeAttr[];
    isPopupVisible: boolean;
    popupTop: number;
    popupLeft: number;
    edgeInProgress: boolean;
    startNode: NodeAttr | null;
    topEdge: EdgeType;
    topNodeId: string | null;
}

interface EdgeType {
    startNode: NodeAttr;
    endNode: NodeAttr;
}

interface NodePosition {
    x: number;
    y: number;
}

export default class FlowChart extends Component <{}, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nodes: [],
            isPopupVisible: false,
            popupTop: 0,
            popupLeft: 0,
            edgeInProgress: false,
            startNode: null,
            topEdge: null,
            topNodeId: null
        };
        this.onClickSVG = this.onClickSVG.bind(this);
    }

    coord: NodePosition | null = null
    
    mouseMoveEvent: ((event: any) => void)[] = []

    onClickPopup(event: any) {
        console.log('nothing to do');
    }

    handleMouseDown(event: any, id: string) {
        this.coord = { x: event.pageX, y: event.pageY }
        this.mouseMoveEvent.push((event: any) => this.handleMouseMove(event, id))
        document.addEventListener('mousemove', this.mouseMoveEvent[this.mouseMoveEvent.length-1])
    };

    handleMouseUp(event: any, id: string) {
        if(this.mouseMoveEvent.length > 0) {
            this.mouseMoveEvent.forEach( event => {
                document.removeEventListener('mousemove', event);
            })
            this.mouseMoveEvent = []
            this.coord = null;
        } 
    }

    handleMouseMove (event: any, id: string) {
        if (this.coord) {
            let xDiff = this.coord.x - event.pageX;
            let yDiff = this.coord.y - event.pageY;
            this.coord.x = event.pageX;
            this.coord.y = event.pageY;
            
            let {nodes} = this.state;

            nodes = nodes.map( node => {
                if (node.id == id) {
                    // find all parents
                    let parentsX = nodes.reduce((parents, currentNode) => {
                        if(currentNode.downstreams.includes(node.id)){
                            parents.push(currentNode.x);
                        }
                        return parents;
                    }, []);

                    let childrenX = node.downstreams.map(downstreamId => {
                        return nodes.find(node => node.id == downstreamId).x;
                    })
                    
                    // check minimum allowed x
                    let minAllowedX = Math.max(...parentsX) + nodeSizes.nodeWidth + 50;
                    let maxAllowedX = Math.min(...childrenX) - (nodeSizes.nodeWidth + 50);
                    let finalX = node.x - xDiff;

                    if(finalX <= minAllowedX){
                        finalX = minAllowedX;
                    }
                    if(finalX >= maxAllowedX){
                        finalX = maxAllowedX;
                    }

                    node = {
                        ...node,
                        x: finalX,
                        y: node.y - yDiff
                    }
                }
                return node
            })
            this.setState({nodes: nodes, topEdge: null});
        }
    };

    handleClickConnector(event: any, id: string, isInput: boolean) {
        let {edgeInProgress, nodes, startNode} = this.state;
        if(edgeInProgress && isInput && startNode && startNode.id != id) {
            let endNode = nodes.find(node => node.id == id);
            if(startNode.x < endNode.x) {
                if(!startNode.downstreams.includes(id)) {
                    startNode.downstreams.push(id)
                }
                endNode.activeIn = true;
                this.setState({
                    edgeInProgress: false,
                    startNode: null,
                    nodes: nodes
                }, () => {
                    setTimeout(() => {
                        nodes = nodes.map(node => {
                            node.activeIn = false;
                            node.activeOut = false;
                            return node;
                        });
                        this.setState({
                            nodes: nodes
                        })
                    }, 500) 
                });
            }
        }
        else if(!isInput){
            startNode = nodes.find(node => node.id == id);
            startNode.activeOut = true;
            this.setState({
                edgeInProgress: true,
                startNode: startNode,
                nodes: nodes
            });
        }
    }

    handleTitleChange(event:any, id:string) {
        let value = event.target.value;
        let {nodes} = this.state;
        let node = nodes.find(node => node.id == id)
        node.title = value;
        this.setState({ nodes: nodes })
    }

    onClickAddNode() {
        let {nodes} = this.state;
        nodes.push(generateNode());
        
        this.setState({
            nodes: nodes
        });
    }

    handleMouseEnterNode(nodeId: string) {
        this.setState({
            topNodeId: nodeId
        });
    }

    handleClickOptions(event: any, node: NodeAttr) {
        this.onClickPopup = (event: any) => this.onDeleteNode(node);
        this.setState({
            isPopupVisible: true,
            popupTop: event.clientY,
            popupLeft: event.clientX
        });
        event.stopPropagation();
    }
    
    onClickSVG() {
        this.setState({
            isPopupVisible: false
        }, () => {
            if(this.mouseMoveEvent.length > 0) {
                this.mouseMoveEvent.forEach((event) => document.removeEventListener('mousemove', event))
            }
        });
    }


    onDeleteEdge(startNodeId: string, endNodeId: string) {
        let nodes = this.state.nodes
        nodes.filter(node => node.id == startNodeId).forEach( node => {
            node.downstreams = node.downstreams.filter( d => d != endNodeId)
        })
        this.setState({
            nodes: nodes,
            isPopupVisible: false,
            topEdge: null
        });
    }

    onDeleteNode(node: NodeAttr) {
        let nodes = this.state.nodes.filter(n => n.id != node.id);
        nodes.forEach( n => {
            n.downstreams = n.downstreams.filter(d => d != node.id)
        })
        this.setState({
            nodes: nodes,
            isPopupVisible: false,
            topEdge: null
        })
    }

    onClickEdge(event: any, startNodeId: string, endNodeId: string) {
        this.onClickPopup = (event: any) => this.onDeleteEdge(startNodeId, endNodeId);
        this.setState({
            isPopupVisible: true,
            popupTop: event.clientY,
            popupLeft: event.clientX
        });
        event.stopPropagation();
    }

    onChangeConfiguration(event: any, listIndex: number, envID: number, id: string) {
        let nodes = this.state.nodes.map(node => {
            if(node.id == id){
                node.environments = node.environments.map(environment => {
                    environment.isActive = false;
                    return environment;
                });
                node.environments[listIndex].isActive = true;
            }
            return node;
        });
        this.setState({
            nodes
        });
    }

    onChangeInput(value: string, id: string, key: string) {
        let {nodes} = this.state;
        nodes.filter(node => node.id == id).forEach( node => {
            node[key] = value
        })
        this.setState({
            nodes: nodes
        });
    }

    onMouseOverEdge(startNode, endNode) {
        this.setState({
            topEdge: {
                startNode,
                endNode
            }
        })
    }

    getEdgeList(): EdgeType[] {
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

    getNodeList(nodes: NodeAttr[]): NodeAttr[] {
        let {topNodeId} = this.state;
        let topNode = nodes.find(node => node.id == topNodeId);
        let retNodes = nodes.filter(node => {
            if(node.id !== topNodeId){
                return node;
            }
        });
        
        if(topNode){
            retNodes.push(topNode);
        }
        
        return retNodes;
    }

    renderNodeList() {
        let {nodes} = this.state;
        return this.getNodeList(this.state.nodes).map(node => {
            return <Node 
                key={`node-${node.id}`} 
                x={node.x} 
                y={node.y}
                id={node.id}
                title={node.title}
                activeIn={node.activeIn}
                activeOut={node.activeOut}
                condition={node.condition}
                triggerType={node.triggerType}
                buildType={node.buildType}
                environments={node.environments}
                handleMouseEnter={(event) => {this.handleMouseEnterNode(node.id)}}
                onChangeInput={({target}, key) => {this.onChangeInput(target.value, node.id, key)}}
                handleMouseDown={(event) => this.handleMouseDown(event, node.id)}
                handleMouseUp={(event) => this.handleMouseUp(event, node.id)}
                handleClickConnector={(event, isInput) => this.handleClickConnector(event, node.id, isInput)}
                handleTitleChange={(event) => this.handleTitleChange(event, node.id)}
                handleClickOptions={(event) => this.handleClickOptions(event, node)}
                onChangeConfiguration={(event, listIndex, envID) => this.onChangeConfiguration(event, listIndex, envID, node.id)}
            />
        })
    }

    renderEdgeList() {
        return this.getEdgeList().map(edgeNode => {
            let startNode: any = edgeNode.startNode;
            let endNode: any = edgeNode.endNode;
            return <Edge
                key={`edge-${startNode.id}-${endNode.id}`} 
                startNode={startNode} 
                endNode={endNode} 
                onClickEdge={(event: any) => this.onClickEdge(event, startNode.id, endNode.id)}
                deleteEdge={() => this.onDeleteEdge(startNode.id, endNode.id)}
                onMouseOverEdge={(startNode, endNode) => this.onMouseOverEdge(startNode, endNode)}
            />
        })
    }

    renderAddButton() {
        return <Card>
            <CardTitle>
                Create Flow Chart
            </CardTitle>
            <CardBody>
                This is some basic text about how to create a flowchart and it also describes how the flow chart is running at the maching.
            </CardBody>
            <CardFooter>
                <Button bsStyle="primary" onClick={() => this.onClickAddNode()}>Add Node</Button>
                <Button bsStyle="danger" style={{marginLeft: '10px'}} onClick={() => this.setState({
                    nodes: [],
                    isPopupVisible: false,
                    edgeInProgress: false,
                    startNode: null,
                    topEdge: null
                })}>Clear All</Button>
                <Button style={{marginLeft: '10px'}} bsStyle="success">Save</Button>
            </CardFooter>
        </Card>
    }

    renderOptionsPopup() {
        return <Popup isPopupVisible={this.state.isPopupVisible} top={this.state.popupTop} left={this.state.popupLeft}>
            <Card>
                <CardTitle>
                    Select the Action
                </CardTitle>
                <CardBody>
                    <Button bsStyle="danger" onClick={this.onClickPopup}>Delete</Button>
                    <Button style={{marginLeft: '10px'}} bsStyle="primary" onClick={() => this.setState({
                        isPopupVisible: false
                    })}>Close</Button>
                </CardBody>
            </Card>
        </Popup>
    }

    renderBackDrop() {
        return <BackDrop />
    }

    renderDefs() {
        return <Defs />
    }

    render() {
        return (
            <div className="flow-chart">
                {this.renderAddButton()}
                {this.renderOptionsPopup()}
                <div className="svg-wrapper">
                    <svg onClick={() => this.onClickSVG()}>
                        {this.renderBackDrop()}
                        {this.renderDefs()}
                        {this.renderNodeList()}
                        {this.renderEdgeList()}
                    </svg>
                </div>
            </div>
        );
    }
}