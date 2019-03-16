import React, {Component} from 'react';
import {
	ModelessOverlay,
	Modal,
	Tabs,
	Tab,
    AccessConsoles,
    SerialConsoleConnector
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
                <Modal.CloseButton onClick={this.props.closeOverlay}>X</Modal.CloseButton>
                <Modal.Title>Console</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{position: 'relative'}}>
                <Tabs defaultActiveKey={1} animation={true} id="console-container">
                     <Tab className="fixed-height-logs-container" eventKey={1} title="Console 1" key={1}>
                        comething in tab 1
                    </Tab>
                    <Tab className="fixed-height-logs-container" eventKey={2} title="Console 2" key={2}>
                        comething in tab 2
                    </Tab>
                    <Tab className="fixed-height-logs-container" eventKey={3} title="Console 3" key={3}>
                        comething in tab 3
                    </Tab>
                </Tabs>
            </Modal.Body>
        </ModelessOverlay>
	}
}