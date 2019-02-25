import React, {Component} from 'react';
import Node from './node';
import Edge from './edge';
import Defs from './defs';
import BackDrop from './backdrop';
import Popup from './popup';

import {EnvironmentList as environmentList, EnvironmentType} from '../config/buildConfigurations';

import '../../css/flowchart.css';

import {
    Button, 
    CardTitle, 
    CardBody,
    Card,
    CardDropdownButton,
    MenuItem
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
    environmentList: Array<EnvironmentType>; 
}

interface EdgeAttr {
    fromID: string;
    toID: string;
}

interface AppState {
    nodeList: Array<NodeAttr>; 
    activeIndex: number;
    isPopupVisible: boolean;
    popupTop: number;
    popupLeft: number;
    edgeInProgress: boolean;
    edgeList: Array<EdgeAttr>;
    startNode: NodeAttr | undefined;
}

interface NodePosition {
    x?: number;
    y?: number;
}

interface AppProps {

}

export default class FlowChart extends Component <AppProps, AppState> {

    constructor(props: any) {
        super(props);
        this.state = {
            nodeList: [], 
            edgeList: [],
            activeIndex: 0,
            isPopupVisible: false,
            popupTop: 0,
            popupLeft: 0,
            edgeInProgress: false,
            startNode: undefined
        };
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    coordsList:Array<NodePosition> = [];

    onClickPopup(event: any) {
        console.log('nothing to do');
    }

    handleMouseDown(event: any, index: number) {
        this.coordsList[index] = {
            x: event.pageX,
            y: event.pageY
        };
        
        this.setState({
            activeIndex: index
        }, () => {
            document.addEventListener('mousemove', this.handleMouseMove);
        })
    };

    handleMouseUp(event: any, index: number) {
        document.removeEventListener('mousemove', this.handleMouseMove);
        this.coordsList[index] = {};
    };

    handleMouseMove(event: any) {
        let index = this.state.activeIndex;
        let xDiff = this.coordsList[index].x - event.pageX;
        let yDiff = this.coordsList[index].y - event.pageY;
        let {nodeList} = this.state;

        this.coordsList[index].x = event.pageX;
        this.coordsList[index].y = event.pageY;

        nodeList[index] = {
            x: nodeList[index].x - xDiff,
            y: nodeList[index].y - yDiff,
            id: nodeList[index].id,
            title: nodeList[index].title,
            condition: nodeList[index].condition,
            triggerType: nodeList[index].triggerType,
            buildType: nodeList[index].buildType,
            activeIn: nodeList[index].activeIn,
            activeOut: nodeList[index].activeOut,
            environmentList: nodeList[index].environmentList
        };

        this.setState({nodeList});
    };

    addUniqueEdge(fromID: any, toID: string, edgeList: Array<EdgeAttr>) {
        let edgeExists = !!edgeList.filter((edge: EdgeAttr) => {
            if(edge.fromID == fromID && edge.toID == toID) {
                return true;
            }
            else {
                return false;
            }
        })[0];
        
        if(edgeExists){
            return edgeList;
        }
        else{
            edgeList.push({
                fromID: fromID,
                toID: toID
            });
            return edgeList;
        }
    }

    handleClickCircle(event: any, index: number, id: string, isInput: boolean) {
        let {edgeInProgress, nodeList, edgeList, startNode} = this.state;
        if(edgeInProgress && isInput && startNode && startNode.id != id) {
            if(startNode.x < nodeList[index].x){
                edgeList = this.addUniqueEdge(startNode.id, id, edgeList);
                nodeList[index].activeIn = true;
                this.setState({
                    edgeList,
                    edgeInProgress: false,
                    startNode: undefined,
                    nodeList
                }, () => {
                    setTimeout(() => {
                        nodeList = nodeList.map(node => {
                            node.activeIn = false;
                            node.activeOut = false;
                            return node;
                        });
                        this.setState({
                            nodeList
                        })
                    }, 500) 
                });
            }
        }
        else if(!isInput){
            nodeList[index].activeOut = true;
            this.setState({
                edgeInProgress: true,
                startNode: nodeList[index],
                nodeList
            });
        }
    }

    handleTextChange(event:any, index:number) {
        let value = event.target.value;
        let {nodeList} = this.state;
        
        nodeList.push({
            x: nodeList[index].x,
            y: nodeList[index].y,
            id: nodeList[index].id,
            title: value,
            activeIn: nodeList[index].activeIn,
            activeOut: nodeList[index].activeOut,
            environmentList: nodeList[index].environmentList,
            condition: nodeList[index].condition,
            triggerType: nodeList[index].triggerType,
            buildType: nodeList[index].buildType
        });
        
        this.setState({
            nodeList
        })
    }

    onClickAddNode() {
        let {nodeList} = this.state;
        nodeList.push({
            x: 200,
            y: 200,
            title: 'Add text here',
            id: (new Date()).getTime().toString(36),
            activeIn: false,
            activeOut: false,
            condition: '',
            triggerType: '',
            buildType: '',
            environmentList: JSON.parse(JSON.stringify(environmentList))
        });
        
        this.setState({
            nodeList
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
            document.removeEventListener('mousemove', this.handleMouseMove);
        });
    }

    onDeleteEdge(edge: EdgeAttr) {
        let {edgeList} = this.state;
        let atWhich = edgeList.indexOf(edge);
        edgeList = edgeList.slice(0, atWhich).concat(edgeList.slice(atWhich + 1));
        this.setState({
            edgeList,
            isPopupVisible: false
        });
    }

    onDeleteNode(node: NodeAttr) {
        let {nodeList, edgeList} = this.state;
        let atWhich = nodeList.indexOf(node);
        nodeList = nodeList.slice(0, atWhich).concat(nodeList.slice(atWhich + 1));
        edgeList = edgeList.filter(edge => {
            if(edge.fromID != node.id && edge.toID != node.id){
                return true;
            }
        });
        this.setState({
            nodeList,
            edgeList,
            isPopupVisible: false
        });
    }

    onClickEdge(event: any, edge: EdgeAttr) {
        this.onClickPopup = (event: any) => this.onDeleteEdge(edge);
        this.setState({
            isPopupVisible: true,
            popupTop: event.clientY,
            popupLeft: event.clientX
        });
        event.stopPropagation();
    }

    onChangeConfiguration(event: any, listIndex: number, envID: number, index: number) {
        let {nodeList} = this.state;
        nodeList[index].environmentList = nodeList[index].environmentList.map(environment => {
            environment.isActive = false;
            return environment;
        })
        nodeList[index].environmentList[listIndex].isActive = true;
        
        this.setState({
            nodeList
        });
    }

    onChangeInput(value: string, index: number, key: string) {
        let {nodeList} = this.state;
        nodeList[index][key] = value;
        this.setState({
            nodeList
        });
    }

    renderNodeList() {
        return this.state.nodeList.map((node, index) => {
            return <Node 
                key={`node-${index}`} 
                x={node.x} 
                y={node.y}
                id={node.id}
                title={node.title}
                activeIn={node.activeIn}
                activeOut={node.activeOut}
                condition={node.condition}
                triggerType={node.triggerType}
                buildType={node.buildType}
                environmentList={node.environmentList}
                onChangeInput={({target}, key) => {this.onChangeInput(target.value, index, key)}}
                handleMouseDown={(event) => this.handleMouseDown(event, index)}
                handleMouseUp={(event) => this.handleMouseUp(event, index)}
                handleClickCircle={(event, isInput) => this.handleClickCircle(event, index, node.id, isInput)}
                handleTextChange={(event) => this.handleTextChange(event, index)}
                handleClickOptions={(event) => this.handleClickOptions(event, node)}
                onChangeConfiguration={(event, listIndex, envID) => this.onChangeConfiguration(event, listIndex, envID, index)}
            />
        })
    }

    renderEdgeList() {
        return this.state.edgeList.map((edge, index) => {
            let startNode = this.state.nodeList.filter((node:NodeAttr) => node.id == edge.fromID)[0];
            let endNode = this.state.nodeList.filter((node:NodeAttr) => node.id == edge.toID)[0];
            return <Edge key={`edge-${index}`} startNode={startNode} endNode={endNode} onClickEdge={(event: any) => this.onClickEdge(event, edge)}/>
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
                    nodeList: [],
                    edgeList: [],
                    activeIndex: 0,
                    isPopupVisible: false,
                    edgeInProgress: false,
                    startNode: undefined
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