import React, {Component} from 'react';

import {
	Card,
	CardTitle,
	CardBody,
    Form,
    FormGroup,
    ControlLabel,
    FormControl,
    Button
} from 'patternfly-react';

interface EnvironmentRegisterState {
    name: string;
    url: string;
    authToken: string;
}

export default class EnvironmentRegister extends Component <{}, EnvironmentRegisterState> {
    
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            url: '',
            authToken: ''
        }
    }

    onSubmitEnvironment() {
        console.log('on submit form')
    }

    handleChangeInput(value, key) {
        let state = this.state;
        state[key] = value;
        this.setState(state);
    }

    isFormValid() {
        let requiredFields = ['name', 'url', 'authToken'];
        return requiredFields.reduce((isValid, field) => {
            return isValid && this.state[field].length;
        }, true);
    }

    renderPageTitle() {
        return <Card>
            <CardTitle>
                Environment Registration
            </CardTitle>
            <CardBody>
                This is some basic text about how to register a environment and it also describes how it will be used.
            </CardBody>
        </Card>
    }

    renderForm() {
        return (
            <div style={{padding: '0 10px', width: '50%'}}>
                <FormGroup controlId="name">
                    <ControlLabel>Environment Name</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.name}
                        placeholder="Enter Environment Name"
                        onChange={({target}) => this.handleChangeInput(target.value, 'name')} 
                    />
                </FormGroup>
                <FormGroup controlId="url">
                    <ControlLabel>URL</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.url}
                        placeholder="Enter Environment Name"
                        onChange={({target}) => this.handleChangeInput(target.value, 'url')} 
                    />
                </FormGroup>
                <FormGroup controlId="authToken">
                    <ControlLabel>Authentication Token</ControlLabel>
                    <FormControl
                        type="text"
                        value={this.state.authToken}
                        placeholder="Enter Authentication Token"
                        onChange={({target}) => this.handleChangeInput(target.value, 'authToken')} 
                    />
                </FormGroup>
                <Button type="button" bsStyle="success" disabled={!this.isFormValid()}>Save</Button>
            </div>
        )
    }

    render() {
		return <div className="environment-register">
            {this.renderPageTitle()}
			{this.renderForm()}
		</div>
    }
}