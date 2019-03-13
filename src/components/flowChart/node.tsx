import * as React from 'react';
import {nodeSizes} from '../../config/sizes';
import {nodeColors} from '../../config/colors';

import {DeploymentTemplateType, TriggerType} from '../../config/buildConfigurations';

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
    condition: string;
    triggerType: string;
    buildType: string;
    deploymentTemplates: DeploymentTemplateType[];
    triggerTypeLists: TriggerType[];
    handleMouseUp(event: any): void;
    handleMouseDown(event: any): void;
    handleTitleChange(event: any): void;
    handleClickConnector(event:any, isInput:boolean): void;
    handleClickOptions(event: any): void;
    handleMouseEnter(event: any): void;
    onChangeConfiguration(key: string, listIndex: number, id: string): void;
    onClickEnvironmentConfiguration(event: any): void;
}

export default class Node extends React.Component <NodeProps>{

    renderCardContent() {
        let deploymentTemplateTitle = this.props.deploymentTemplates.filter(env => env.isActive)[0].title;
        let triggerTypeListsTitle = this.props.triggerTypeLists.filter(env => env.isActive)[0].title;
        return <Card style={{position: 'relative', height: '100%', padding: '0px', margin: '0px', cursor: 'move'}}>
            <CardTitle style={{padding: '5px 10px', margin: '0px', borderBottom: '1px solid #d1d1d1'}}>
                <input placeholder="Add title" value={this.props.title} onChange={this.props.handleTitleChange} style={{border: 'none', fontSize: '14px', lineHeight: '14px', width: '90%'}} />
            </CardTitle>
            <CardBody style={{padding: '3px 8px', margin: '0px'}} >
                <div style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap'}}>
                    <DropdownButton bsStyle="default" title={deploymentTemplateTitle} id="dropdown-example">
                        {this.props.deploymentTemplates.map((deploymentTemplate, index) => {
                            return <MenuItem key={`env-${index}`} eventKey={index} active={deploymentTemplate.isActive} onClick={() => this.props.onChangeConfiguration('deploymentTemplates', index, deploymentTemplate.id)}>
                                {deploymentTemplate.title}
                            </MenuItem>
                        })}
                    </DropdownButton>
                    <DropdownButton bsStyle="default" title={triggerTypeListsTitle} id="dropdown-example" style={{marginTop: '5px'}}>
                        {this.props.triggerTypeLists.map((triggerType, index) => {
                            return <MenuItem key={`env-${index}`} eventKey={index} active={triggerType.isActive} onClick={() => this.props.onChangeConfiguration('triggerTypeLists', index, triggerType.id)}>
                                {triggerType.title}
                            </MenuItem>
                        })}
                    </DropdownButton>
                </div>
                <div 
                    className={this.props.activeIn ? "active junction" : "junction"}
                    onClick={(event) => this.props.handleClickConnector(event, true)}
                    style={{left: '0px'}}
                />
                <div 
                    className={this.props.activeOut ? "active junction" : "junction"}
                    onClick={(event) => this.props.handleClickConnector(event, false)}
                    style={{right: '0px', transform: 'translate(50%, -50%)'}}
                />
                <div 
                    className="option-button fa fa-trash"
                    onClick={this.props.handleClickOptions}
                />
                <div style={{marginTop: '5px'}}>
                    <Button style={{width: '100%'}} onClick={this.props.onClickEnvironmentConfiguration}>Environment Config</Button>
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
            onMouseEnter={this.props.handleMouseEnter}
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