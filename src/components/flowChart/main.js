import React, { Component } from 'react';
import Node from './node';
import Defs from './defs';
import BackDrop from './backdrop';
import Popup from './popup';

import { Select } from '@coursera/coursera-ui'

import '../../css/flowChart/main.less';

export default class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nodeList: [], 
            activeIndex: 0,
            isPopupVisible: false,
            popupTop: 0,
            popupLeft: 0
        };
        this.coordsList = [{
            x: 20,
            y: 20
        }, {
            x: 100,
            y: 160
        }, {
            x: 200,
            y: 200
        }, {
            x: 340,
            y: 340
        }];
        this.handleMouseMove = this.handleMouseMove.bind(this);
    }

    handleMouseDown(event, index) {
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

    handleMouseUp(event, index) {
        document.removeEventListener('mousemove', this.handleMouseMove);
        this.coordsList[index] = {};
    };

    handleMouseMove(event) {
        let index = this.state.activeIndex;
        let xDiff = this.coordsList[index].x - event.pageX;
        let yDiff = this.coordsList[index].y - event.pageY;
        let {nodeList} = this.state;

        this.coordsList[index].x = event.pageX;
        this.coordsList[index].y = event.pageY;

        nodeList[index] = {
            x: nodeList[index].x - xDiff,
            y: nodeList[index].y - yDiff,
            title: nodeList[index].title
        };

        this.setState({nodeList});
    };

    handleClickCircle(event, index, id, isInput) {
        console.log('handleClickCircle', index, id, isInput);
    }

    handleTextChange(event, index) {
        let value = event.target.value;
        let {nodeList} = this.state;
        
        nodeList.push({
            x: nodeList[index].x,
            y: nodeList[index].y,
            title: value,
            inputList: nodeList[index].inputList,
            outputList: nodeList[index].outputList
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
            inputList: [],
            outputList: [],
            id: nodeList.length ? parseInt(nodeList[nodeList.length - 1].id) + 1 : 0
        });
        
        this.setState({
            nodeList
        });
    }

    handleClickOptions(event) {
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

    render() {
        return (
            <div>
                <button onClick={() => this.onClickAddNode()}>Add Node</button>
                <Popup isPopupVisible={this.state.isPopupVisible} top={this.state.popupTop} left={this.state.popupLeft} />
                <svg onClick={() => this.onClickSVG()}>
                    <Defs />
                    <BackDrop />
                    {this.state.nodeList.map((position, index) => {
                        return <Node 
                            x={position.x} 
                            y={position.y}
                            title={position.title}
                            handleMouseDown={(event) => this.handleMouseDown(event, index)}
                            handleMouseUp={(event) => this.handleMouseUp(event, index)}
                            handleClickCircle={(event, isInput) => this.handleClickCircle(event, index, position.id, isInput)}
                            handleTextChange={(event) => this.handleTextChange(event, index)}
                            handleClickOptions={(event) => this.handleClickOptions(event, index)}
                        />
                    })}
                </svg>
            </div>
        );
    }
}