import * as React from 'react';
import {nodeSizes} from '../config/sizes';
import {nodeColors} from '../config/colors';

import {
    Button, 
    CardTitle, 
    CardBody,
    Card,
    DropdownButton,
    MenuItem,
    CardLink,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    CardHeading,
    Icon
} from 'patternfly-react';

interface NodeProps {
    x: number;
    y: number;
    id: string;
    title: string;
    activeIn: boolean;
    activeOut: boolean;
    environmentList: Array<any>;
    conditionText: string;
    triggerText: string;
    buildTypeText: string;
    handleMouseUp(event: any): void;
    handleMouseDown(event: any): void;
    handleTextChange(event: any): void;
    handleClickCircle(event:any, isInput:boolean): void;
    handleClickOptions(event: any): void;
    onChangeInput(event: any, key: string): void;
    onChangeConfiguration(event: any, listIndex: number, envID: number): void;
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

    renderCardContent() {
        let environmentTitle = this.props.environmentList.filter(env => env.isActive)[0].title;
        return <Card>
            <CardHeading>
                <CardTitle>
                    <Icon name="shield" />
                    <span className="text-container" suppressContentEditableWarning={true} contentEditable={true} onChange={this.props.handleTextChange}>
                       {this.props.title} 
                    </span>
                    <DropdownButton bsStyle="default" title={environmentTitle} id="dropdown-example">
                        {this.props.environmentList.map((envionment, index) => {
                            return <MenuItem key={`env-${index}`} eventKey={index} active={envionment.isActive} onClick={() => this.props.onChangeConfiguration(event, index, envionment.id)}>
                                {envionment.title}
                            </MenuItem>
                        })}
                    </DropdownButton>
                </CardTitle>
            </CardHeading>
            <CardBody>
                <Form>
                    <FormGroup controlId="text" disabled={false}>
                        <ControlLabel>Condition</ControlLabel>
                        <FormControl type="text" disabled={false} value={this.props.conditionText} onInput={(event) => this.props.onChangeInput(event, 'condition')}/>
                     </FormGroup>
                     <FormGroup controlId="text" disabled={false}>
                        <ControlLabel>Trigger Type</ControlLabel>
                        <FormControl type="text" disabled={false} value={this.props.triggerText} onInput={(event) => this.props.onChangeInput(event, 'triggerType')}/>
                    </FormGroup>
                    <FormGroup controlId="text" disabled={false}>
                        <ControlLabel>Build Type</ControlLabel>
                        <FormControl type="text" disabled={false} value={this.props.buildTypeText} onInput={(event) => this.props.onChangeInput(event, 'buildType')}/>
                    </FormGroup>
                </Form>
                <CardLink href="#" >
                    Git diff
                </CardLink>
            </CardBody>
        </Card>
    }

    renderTextArea() {
        return <foreignObject 
            style={{borderRadius: '5px'}}
            x={this.props.x} 
            y={this.props.y} 
            width={nodeSizes.nodeWidth} 
            height={nodeSizes.nodeHeight}
            onMouseDown={this.props.handleMouseDown} 
            onMouseUp={this.props.handleMouseUp}>
                {this.renderCardContent()}
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