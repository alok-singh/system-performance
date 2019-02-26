import React, {Component} from 'react';
import Node from './node';
import Edge from './edge';
import Defs from './defs';
import BackDrop from './backdrop';
import Popup from './popup';

import {EnvironmentList as environments, EnvironmentType} from '../config/buildConfigurations';

import '../../css/flowchart.css';

import {
    Button, 
    CardTitle, 
    CardBody,
    Card,
    CardDropdownButton,
    MenuItem
} from 'patternfly-react';
import { notDeepEqual } from 'assert';
import { node } from 'prop-types';

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
    environments: Array<EnvironmentType>; 
    downstreams: string[]
}

interface AppState {
    nodes: Array<NodeAttr>;
    isPopupVisible: boolean;
    popupTop: number;
    popupLeft: number;
    edgeInProgress: boolean;
    startNode: NodeAttr | null;
}

interface NodePosition {
    x: number;
    y: number;
}

interface AppProps {

}

export default class FlowChart extends Component <AppProps, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nodes: [],
            isPopupVisible: false,
            popupTop: 0,
            popupLeft: 0,
            edgeInProgress: false,
            startNode: null
        };
    }

    coord: NodePosition | null = null
    mouseMoveEvent: ((event: any) => void) | null = null

    onClickPopup(event: any) {
        console.log('nothing to do');
    }

    handleMouseDown(event: any, id: string) {
        this.coord = { x: event.pageX, y: event.pageY }
        this.mouseMoveEvent = (event: any) => this.handleMouseMove(event, id)
        document.addEventListener('mousemove', this.mouseMoveEvent)
    };

    handleMouseUp(event: any, id: string) {
        if(this.mouseMoveEvent) {
            document.removeEventListener('mousemove', this.mouseMoveEvent);
            this.mouseMoveEvent = null
            this.coord = null;
        } 
    };

    handleMouseMove = (event: any, id: string) => {
        if (this.coord) {
            let xDiff = this.coord.x - event.pageX;
            let yDiff = this.coord.y - event.pageY;
            this.coord.x = event.pageX;
            this.coord.y = event.pageY;

            let {nodes} = this.state;

            console.log("size: "+nodes.length)
            console.log("nodes f: "+nodes[0].x + " "+ nodes[0].y)
            nodes = nodes.map( node => {
                if (node.id == id) {
                    node = {
                        ...node,
                        x: node.x - xDiff,
                        y: node.y - yDiff

                    }
                }
                return node
            })
            console.log("nodes a: "+nodes[0].x + " "+ nodes[0].y)
            this.setState({nodes: nodes});
        }
    };

    handleClickCircle(event: any, index: number, id: string, isInput: boolean) {
        let {edgeInProgress, nodes, startNode} = this.state;
        if(edgeInProgress && isInput && startNode && startNode.id != id) {
            if(startNode.x < nodes[index].x){
                let startNodes = nodes.filter( node => startNode && node.id == startNode.id )
                if( startNodes.length > 0 ) {
                    startNodes.forEach( node => {
                        if( !node.downstreams.includes(id)) {
                            node.downstreams.push(id)
                        }
                    })
                }
                nodes[index].activeIn = true;
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
            nodes[index].activeOut = true;
            this.setState({
                edgeInProgress: true,
                startNode: nodes[index],
                nodes: nodes
            });
        }
    }

    handleTextChange(event:any, id:string) {
        let value = event.target.value;
        let {nodes} = this.state;
        let node = nodes.filter(node => node.id == id)
        
        if(node.length > 0) {
            nodes.push({
                ...node[0],
                title: value,
            })
            this.setState({ nodes: nodes })
        }
    }

    onClickAddNode() {
        let {nodes} = this.state;
        nodes.push({
            x: 200,
            y: 200,
            title: 'Add text here',
            id: (new Date()).getTime().toString(36),
            activeIn: false,
            activeOut: false,
            condition: '',
            triggerType: '',
            buildType: '',
            environments: JSON.parse(JSON.stringify(environments)),
            downstreams: []
        });
        
        this.setState({
            nodes: nodes
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
            if(this.mouseMoveEvent) {
                document.removeEventListener('mousemove', this.mouseMoveEvent);
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
            isPopupVisible: false
        });
    }

    onDeleteNode(node: NodeAttr) {
        let nodes = this.state.nodes.filter(n => n.id != node.id);
        nodes.forEach( n => {
            n.downstreams = n.downstreams.filter(d => d != node.id)
        })
        this.setState({
            nodes: nodes,
            isPopupVisible: false
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

    onChangeConfiguration(event: any, listIndex: number, envID: number, index: number) {
        let {nodes: nodeList} = this.state;
        nodeList[index].environments = nodeList[index].environments.map(environment => {
            environment.isActive = false;
            return environment;
        })
        nodeList[index].environments[listIndex].isActive = true;
        
        this.setState({
            nodes: nodeList
        });
    }

    onChangeInput(value: string, id: string, key: string) {
        let {nodes} = this.state;
        nodes.filter(node => node.id == id). forEach( node => {
            node[key] = value
        })
        this.setState({
            nodes: nodes
        });
    }

    renderNodeList() {
        return this.state.nodes.map((node, index) => {
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
                onChangeInput={({target}, key) => {this.onChangeInput(target.value, node.id, key)}}
                handleMouseDown={(event) => this.handleMouseDown(event, node.id)}
                handleMouseUp={(event) => this.handleMouseUp(event, node.id)}
                handleClickCircle={(event, isInput) => this.handleClickCircle(event, index, node.id, isInput)}
                handleTextChange={(event) => this.handleTextChange(event, node.id)}
                handleClickOptions={(event) => this.handleClickOptions(event, node)}
                onChangeConfiguration={(event, listIndex, envID) => this.onChangeConfiguration(event, listIndex, envID, index)}
            />
        })
    }

    renderEdgeList() {
        return this.state.nodes.map((node, index) => {
            let startNode = node
            return node.downstreams.map(id => this.state.nodes.filter( node => node.id == id))
                        .filter( node => node ).map( endNodes => {
                            let endNode = endNodes[0]
                            return <Edge key={`edge-${startNode.id}-${endNode.id}`} startNode={startNode} endNode={endNode} onClickEdge={(event: any) => this.onClickEdge(event, startNode.id, endNode.id)}/>
                        })
        })
    }

    renderAddButton() {
        return <Card>
            <CardTitle>
                Controls
            </CardTitle>
            <CardBody>
                <Button bsStyle="primary" onClick={() => this.onClickAddNode()}>Add Node</Button>
                <Button bsStyle="danger" style={{marginLeft: '10px'}} onClick={() => this.setState({
                    nodes: [],
                    isPopupVisible: false,
                    edgeInProgress: false,
                    startNode: null
                })}>Clear All</Button>
            </CardBody>
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