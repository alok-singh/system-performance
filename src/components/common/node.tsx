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
    environments: Array<any>;
    condition: string;
    triggerType: string;
    buildType: string;
    handleMouseUp(event: any): void;
    handleMouseDown(event: any): void;
    handleTitleChange(event: any): void;
    handleClickCircle(event:any, isInput:boolean): void;
    handleClickOptions(event: any): void;
    onChangeInput(event: any, key: string): void;
    onChangeConfiguration(event: any, listIndex: number, envID: number): void;
}

export default class Node extends React.Component <NodeProps>{

    renderCardContent() {
        let environmentTitle = this.props.environments.filter(env => env.isActive)[0].title;
        return <Card style={{position: 'relative', height: '100%', padding: '0px', margin: '0px', cursor: 'move'}}>
            <CardTitle style={{padding: '5px 10px', margin: '0px', borderBottom: '1px solid #d1d1d1'}}>
                <input placeholder="Add title" value={this.props.title} onChange={this.props.handleTitleChange} style={{border: 'none', fontSize: '14px', lineHeight: '14px'}} />
            </CardTitle>
            <CardBody style={{padding: '10px', margin: '0px'}} >
                <div>
                    <DropdownButton bsStyle="default" title={environmentTitle} id="dropdown-example">
                        {this.props.environments.map((envionment, index) => {
                            return <MenuItem key={`env-${index}`} eventKey={index} active={envionment.isActive} onClick={() => this.props.onChangeConfiguration(event, index, envionment.id)}>
                                {envionment.title}
                            </MenuItem>
                        })}
                    </DropdownButton>
                    <Button style={{marginLeft: '5px'}}>Trigger Type</Button>
                </div>
                <div 
                    className={this.props.activeIn ? "active junction" : "junction"}
                    onClick={(event) => this.props.handleClickCircle(event, true)}
                    style={{left: '0px'}}
                />
                <div 
                    className={this.props.activeOut ? "active junction" : "junction"}
                    onClick={(event) => this.props.handleClickCircle(event, false)}
                    style={{right: '0px', transform: 'translate(50%, -50%)'}}
                />
                <div 
                    className="option-button fa fa-trash"
                    onClick={this.props.handleClickOptions}
                />
                <div style={{margin: '10px 0px'}}>
                    <Button style={{marginRight: '5px'}}>Type</Button>
                    <Button style={{marginRight: '5px'}}>Condition</Button>
                    <Button>Config</Button>
                </div>
            </CardBody>
        </Card>
    }

    renderTextArea() {
        return <foreignObject
            x={this.props.x} 
            y={this.props.y} 
            width={nodeSizes.nodeWidth} 
            height={nodeSizes.nodeHeight}
            onMouseDown={this.props.handleMouseDown} 
            onMouseUp={this.props.handleMouseUp}
            style={{overflow: 'visible', position: 'relative'}}
        >
            {this.renderCardContent()}
        </foreignObject>
    }

    render() {
        return <g>
            {this.renderTextArea()}
        </g>
    }
}