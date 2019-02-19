import React, { Component } from 'react';
import { Card, CardHeading, CardDropdownButton, CardTitle, CardBody, CardLink, MenuItem, Icon } from 'patternfly-react'
import { ItemTypes } from '../../../Constants'
import { DragSource, DragSourceConnector, DragSourceMonitor, ConnectDragSource, DragSourceCollector } from 'react-dnd'
import { ArcherElement } from 'react-archer'
import { Position } from '../../../behavior/vsm/MoveManager'
import { ArrowEndPointClass } from "../../../Constants";

import "patternfly/dist/css/patternfly.css";
import "patternfly/dist/css/patternfly-additions.css";
import "patternfly/dist/css/rcue.css";
import "patternfly/dist/css/rcue-additions.css"
import "patternfly-react/dist/css/patternfly-react.css"

export interface ArrowDirection {
    targetId: string, 
    targetAnchor: string, 
    sourceAnchor: string
}

export interface VSMCardProps {
    id: string
    position: Position
    environment?: string
    deployedMaterial?: string
    downstream?: string[]
    downstreamInfo?: ArrowDirection[]
}

interface CollectedProps {
    connectDragSource: ConnectDragSource 
    isDragging?: boolean
}

const cardSource = {
    beginDrag(props: VSMCardProps) {
        return {id: props.id};
    }
}

//important to define card with this type signature
const collect: DragSourceCollector<CollectedProps> = (connect: DragSourceConnector, monitor: DragSourceMonitor) => {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging()
    }
}

class VSMCard extends Component<VSMCardProps &  CollectedProps> {

    render() {
        var relations: {targetId: string, targetAnchor: string, sourceAnchor: string}[]
        var title: string = ""
        if(this.props.downstreamInfo) {
            relations = this.props.downstreamInfo
        } else {
            relations = []
        }

        return this.props.connectDragSource(
            <div>
            <ArcherElement id={this.props.id}  relations={relations}>
                <div className="cards-pf" style={{
                    opacity: this.props.isDragging? 0.5: 1
                }}>
                    <div style={{padding: '5px', borderStyle: 'dashed'}} className={ArrowEndPointClass} >
                    <Card matchHeight accented style={{margin:'0px', cursor: 'move'}}>
                        <CardBody>
                            <CardDropdownButton id="cardDropdownButton1" title="Environment">
                                <MenuItem eventKey="1" active>
                                    QA
                                </MenuItem>
                                <MenuItem eventKey="2">
                                    Prod
                                </MenuItem>
                                <MenuItem eventKey="3">
                                    Pre-prod
                                </MenuItem>
                            </CardDropdownButton>
                            <CardDropdownButton id="cardDropdownButton1" title="Environment">
                                <MenuItem eventKey="1" active>
                                    QA
                                </MenuItem>
                                <MenuItem eventKey="2">
                                    Prod
                                </MenuItem>
                                <MenuItem eventKey="3">
                                    Pre-prod
                                </MenuItem>
                            </CardDropdownButton>
                            <CardDropdownButton id="cardDropdownButton1" title="Environment">
                                <MenuItem eventKey="1" active>
                                    QA
                                </MenuItem>
                                <MenuItem eventKey="2">
                                    Prod
                                </MenuItem>
                                <MenuItem eventKey="3">
                                    Pre-prod
                                </MenuItem>
                            </CardDropdownButton>
                            <CardLink href="#" >
                                Git diff
                            </CardLink>
                        </CardBody>
                    </Card>
                    </div>
                </div>
            </ArcherElement>
            </div>
        );
    }
}

export default DragSource(ItemTypes.CARD, cardSource, collect)(VSMCard);