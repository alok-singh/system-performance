import React, {Component} from 'react';

import {
	Card,
	CardTitle,
	CardBody
} from 'patternfly-react';

export default class DefaultComponent extends Component {

    renderPageTitle() {
        return <Card>
            <CardTitle>
                This component is yet to be build
            </CardTitle>
            <CardBody>
                This is some some dummy text this is This is some some dummy text this is This is some some dummy text this is 
            </CardBody>
        </Card>
    }

    render() {
		return <div className="fallback">
			{this.renderPageTitle()}
			This component is yet to be build
		</div>
    }
}