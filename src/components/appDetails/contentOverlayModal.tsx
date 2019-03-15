import React, {Component} from 'react';
import {
	ModelessOverlay,
	Modal,
	Row,
	Col,
	FormControl,
	FormGroup,
	ControlLabel,
	Tabs,
	Tab
} from 'patternfly-react';


export default class ContentOverlayModal extends Component <any>{
	
	scrollToBottom() {
	    let element: any = document.querySelector(".fixed-height-logs-container.active");
	    if(element) {
	        element.scrollTo(0, element.scrollHeight);
	    }
	}

	render() {
		return <ModelessOverlay show={this.props.showOverlay} size="lg" className="modaless-overlay-pf-custom">
            <Modal.Header>
                <Modal.CloseButton onClick={this.props.toggleOverlay}>X</Modal.CloseButton>
                <Modal.Title>Containers</Modal.Title>
            </Modal.Header>

            <Modal.Body style={{ position: 'relative' }}>
                <Row className="m-lr-0">
                    <Col lg={12}>
                        <FormGroup controlId="currentInstanceIndex">
                            <ControlLabel>Select Instance</ControlLabel>
                            <FormControl
                                componentClass="select"
                                value={this.props.currentInstanceIndex}
                                onChange={(event) => { this.props.handleInstanceAndContainerChange(event, event.target.value, -1) }}
                                placeholder="Select Current Instance" >
                                {this.props.instances.map(
                                    (instance, index) => {
                                        return (
                                            <option key={index} value={index}>{instance.name}</option>
                                        )
                                    }
                                )}
                            </FormControl>
                        </FormGroup>
                    </Col>

                    {/* <Col lg={5}>
                        <FormGroup controlId="maxLogs">
                            <ControlLabel>Enter Maximum Logs</ControlLabel>

                            <FormControl type="text"
                                value={this.props.maxLogs}
                                onChange={(event) => { }}
                                placeholder="Enter Max Logs" >
                            </FormControl>
                        </FormGroup>
                    </Col> */}

                </Row>

                <Tabs onSelect={(activeKey) => this.props.handleInstanceAndContainerChange(null, -1, activeKey)}
                    defaultActiveKey={0} animation={true} id="container">
                    {this.props.containers.map((container, index) => {
                        let logs = this.props.logs;
                        return <Tab className="fixed-height-logs-container" eventKey={index} title={container.name} key={index}>
                            {logs.map((log, logIndex) => {
                                return <li key={logIndex}>{log}</li>
                            })}
                        </Tab>
					})}
                </Tabs>
                <button type="button" className="button-scroll-bottom" onClick={this.scrollToBottom}>
                    <i className="fa fa-arrow-down"></i>
                </button>
            </Modal.Body>
        </ModelessOverlay>
	}
}