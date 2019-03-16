import React, { Component } from 'react';
import {nodeSizes} from '../../config/sizes';
import {nodeColors} from '../../config/colors';

import {Card, CardTitle, CardBody, Label, Button, DropdownButton, Tooltip, OverlayTrigger, Tabs, Tab, AccessConsoles} from 'patternfly-react';

interface InputMaterials {
    time: string;
    user: string;
    commitLink: string;
    isActive: boolean;
}

export interface TriggerNodeType {
    x: number;
    y: number;
    key: string;
    id: string;
    downstreams?: string[];
    appName: string;
    environmentName: string;
    colorCode: string;  
    triggerMetaData: string[];
    inputMaterialsNew: InputMaterials[];
    inputMaterialsSuccess: InputMaterials[];
    inputMaterialsFailed: InputMaterials[];
    showOverlay: () => void;
    onChangeInputMaterial: (inputMaterial: InputMaterials, eventKey: string, index: number) => void;
}

export default class TriggerNode extends Component <TriggerNodeType>{

    renderTab(inputMaterialList, eventKey, title) {
        return <Tab eventKey={eventKey} title={title}>
            {inputMaterialList.map((inputMaterial, index) => {
                return <div className={`material-tooltip-row ${inputMaterial.isActive ? 'active' : ''}`}>
                    <div>Time: {inputMaterial.time}</div>
                    <div>User: {inputMaterial.user}</div>
                    <div>Commit: <a href={`${inputMaterial.commitLink}`}>Go to Commit</a></div>
                    {inputMaterial.isActive ? null : <Button onClick={() => {this.props.onChangeInputMaterial(inputMaterial, eventKey, index)}}>Activate</Button>}
                </div>
            })}
        </Tab>
    }

    renderFlyoutHistoryTabs() {
        return <Tooltip id={`flyout-${this.props.id}`} className="trigger-flyout">
            <Tabs> 
                {this.renderTab(this.props.inputMaterialsNew, 'inputMaterialsNew', "New")}
                {this.renderTab(this.props.inputMaterialsFailed, 'inputMaterialsFailed', "Failed")}
                {this.renderTab(this.props.inputMaterialsSuccess, 'inputMaterialsSuccess', "Success")}
            </Tabs>
        </Tooltip>
    }

	renderCardContent() {
        return <div className="trigger-node">
        	<div className="title-wrapper">
                <Label bsStyle="warning" className="color-code-icon" onClick={() => this.props.showOverlay()} style={{padding: '5px', color: this.props.colorCode, backgroundColor: this.props.colorCode, cursor: 'pointer'}}>
                    Options
                    <div id={`tooltip-${this.props.id}`} className="hover-tooltip">
                        <div className="tooltip-title">Trigger Meta Data</div>
                        {this.props.triggerMetaData.map((metaData, index) => {
                            return <div className="tooltip-row" key={`tooltip-list-${this.props.id}-${index+1}`}>{index+1}. {metaData}</div>
                        })}
                        <div className="tooltip-arrow"></div>
                    </div>
                </Label>
        		<div className="name-wrapper">
           			<div className="environment-name">
           				<Label bsStyle="primary">{this.props.environmentName}</Label>
           			</div>
           			<div className="app-name">
           				<Label bsStyle="primary">{this.props.appName}</Label>
           			</div>
           		</div>
           	</div>
           	<div className="junction" style={{left: '0px'}} />
            <div className="junction" style={{right: '0px', transform: 'translate(50%, -50%)'}} />
            <div className="button-wrapper">
	            <div>
	            	<Button bsStyle="success">Deploy</Button>
                    <OverlayTrigger overlay={this.renderFlyoutHistoryTabs()} placement="left" trigger={['click']} rootClose={true} >
                        <Button>Material <i className="fa fa-chevron-down"></i></Button>
                    </OverlayTrigger>
	            </div>
            	<Button bsStyle="primary">Rollback</Button>
            </div>
        </div>
    }

	render() {
		return <foreignObject x={this.props.x} y={this.props.y} width={nodeSizes.triggerWidth} height={nodeSizes.triggerHeight} style={{overflow: 'visible', position: 'relative'}}>
            {this.renderCardContent()}
        </foreignObject>
	} 
}