import React, { Component } from 'react'
import { Block } from './Block'
import { moveCard } from '../../../behavior/vsm/MoveManager';
import { DropTarget, DropTargetConnector, DropTargetMonitor, ConnectDropTarget, DropTargetCollector } from 'react-dnd'
import { ItemTypes } from '../../../Constants';
import { ArrowEndPointClass } from "../../../Constants";

interface CollectedProps {
    connectDropTarget: ConnectDropTarget
    isOver: boolean
}

interface GridBlockProps {
    x: number
    y: number
    canMoveCard: (x: number, y:number) => boolean
}

export interface GridBlockBehavior {
    onMouseDown: (x: number, y:number) => void
    onMouseUp: (x: number, y:number) => void
}

const targetBlock = {
    drop(props: GridBlockProps & GridBlockBehavior, monitor: DropTargetMonitor) {
        moveCard(monitor.getItem().id, {x: props.x, y: props.y})
    },
    canDrop(props: GridBlockProps & GridBlockBehavior, monitor: DropTargetMonitor) {
        return props.canMoveCard(props.x, props.y)
    }
}

//important to define type this way
const collect: DropTargetCollector<CollectedProps> = (connect: DropTargetConnector, monitor:DropTargetMonitor) => {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: !!monitor.isOver(),
    }
}

class GridBlock extends Component<GridBlockProps & GridBlockBehavior & CollectedProps> {

    handleMouseUp = (e: any) => {
        this.props.onMouseUp(this.props.x, this.props.y)
        e.preventDefault()
    }

    handleMouseDown = (e: any) => {
        if( e.target.className == ArrowEndPointClass ) {
            this.props.onMouseDown(this.props.x, this.props.y)
            e.preventDefault()
        }
    }
    
    render() {
        const { connectDropTarget, children } = this.props
        return connectDropTarget(
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }} onMouseDown={this.handleMouseDown} onMouseUp={this.handleMouseUp}>
                <Block>
                    { children }
                </Block>
            </div>
        );
    }
}

export default DropTarget(ItemTypes.CARD, targetBlock, collect)(GridBlock)