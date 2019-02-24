import React, {Component} from 'react';
import Node from './node';
import Edge from './edge';
import Defs from './defs';
import BackDrop from './backdrop';
import Popup from './popup';

import '../../css/flowchart.css';

import {
    Button, 
    CardTitle, 
    CardBody,
    Card
} from 'patternfly-react';

interface NodeAttr {
    x: number;
    y: number;
    title: string;
    id: string;
    activeIn: boolean;
    activeOut: boolean;
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
    startNodeID: string | undefined;
    endNodeID: string | undefined;
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
            startNodeID: undefined,
            endNodeID: undefined
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
            activeIn: nodeList[index].activeIn,
            activeOut: nodeList[index].activeOut
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
        let {edgeInProgress, nodeList, edgeList, startNodeID} = this.state;
        if(edgeInProgress && isInput && startNodeID != id) {
            edgeList = this.addUniqueEdge(startNodeID, id, edgeList);
            nodeList[index].activeIn = true;
            this.setState({
                edgeList,
                edgeInProgress: false,
                startNodeID: undefined,
                endNodeID: undefined,
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
                }, 1500) 
            });
        }
        else if(!isInput){
            nodeList[index].activeOut = true;
            this.setState({
                edgeInProgress: true,
                startNodeID: id,
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
            activeOut: nodeList[index].activeOut
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
            activeOut: false
        });
        
        this.setState({
            nodeList
        });
    }

    handleClickOptions(event: any) {
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

    onClickEdge(event: any, edge: EdgeAttr) {
        this.onClickPopup = (event: any) => this.onDeleteEdge(edge);
        this.setState({
            isPopupVisible: true,
            popupTop: event.clientY,
            popupLeft: event.clientX
        });
        event.stopPropagation();
    }

    renderNodeList() {
        return this.state.nodeList.map((position, index) => {
            return <Node 
                key={`node-${index}`} 
                x={position.x} 
                y={position.y}
                id={position.id}
                title={position.title}
                activeIn={position.activeIn}
                activeOut={position.activeOut}
                handleMouseDown={(event) => this.handleMouseDown(event, index)}
                handleMouseUp={(event) => this.handleMouseUp(event, index)}
                handleClickCircle={(event, isInput) => this.handleClickCircle(event, index, position.id, isInput)}
                handleTextChange={(event) => this.handleTextChange(event, index)}
                handleClickOptions={(event) => this.handleClickOptions(event)}
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
            </CardBody>
        </Card>
    }

    renderOptionsPopup() {
        return <Popup isPopupVisible={this.state.isPopupVisible} top={this.state.popupTop} left={this.state.popupLeft}>
            <div onClick={this.onClickPopup}>Delete</div>
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