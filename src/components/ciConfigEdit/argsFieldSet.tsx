import React, { Component } from "react";
import { 
    FormControl, 
    FormGroup, 
    ControlLabel, 
    Button, 
    Row, 
    Col 
} from 'patternfly-react'

export interface ArgsFieldSetState {
    args: Array<{ key: string, value: String }>;
}

export default class ArgsFieldSet extends Component<any, ArgsFieldSetState> {

    constructor(props: any) {
        super(props);
        this.state = {
            args: [{
                key: "",
                value: ""
            }],
        }
    }

    createUniqueId = (fieldType: string, index: number) => {
        return `args-${fieldType}-${index}`;
    }

    shouldAddMore = () => {
        let len = this.state.args.length;
        return !(this.state.args[len - 1].key && this.state.args[len - 1].value);
    }

    addMore = () => {
        let state = {
            args: [...this.state.args, { key: "", value: "" }],
        };
        this.setState(state);
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>, key: string, index: number) => {
        let state = this.state;
        state.args[index][key] = event.target.value;
        this.props.callbackFromCIConfig(this.state.args);
        this.setState(state);
    }

    handleChangeWrapper = (key: string, index: number): ((event: React.ChangeEvent<HTMLInputElement>) => void) => {
        return (event: React.ChangeEvent<HTMLInputElement>) => this.handleChange(event, key, index)
    }

    render() {
        var self = this;
        return (
            <div className="args">
                <h5 className="bold">Args</h5>
                <hr></hr>
                {this.state.args.map(function (arg, index) {
                    return (
                        <Row key={index}>
                            <Col xs={6} sm={6}>
                                <FormGroup
                                    controlId={self.createUniqueId('key', index)}>
                                    <ControlLabel>Key</ControlLabel>

                                    <FormControl
                                        type="text"
                                        value={arg.key}
                                        placeholder="Key"
                                        onChange={self.handleChangeWrapper("key", index)} />
                                </FormGroup>
                            </Col>

                            <Col xs={6} sm={6} lg={6}>
                                <FormGroup
                                    controlId={self.createUniqueId('value', index)}>
                                    <ControlLabel>Value</ControlLabel>

                                    <FormControl
                                        type="text"
                                        value={arg.value}
                                        placeholder="Value"
                                        onChange={self.handleChangeWrapper('value', index)} />
                                </FormGroup>
                            </Col>
                        </Row>
                    )
                })}

                <Button type="button" bsStyle="default" bsClass="align-right"
                    disabled={this.shouldAddMore()}
                    onClick={this.addMore}>Add More</Button>

                <hr></hr>
            </div>

        );
    }
}