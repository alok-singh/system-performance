import React, {Component} from 'react';
import {generateNode} from '../helpers/stepGenerator';

import {
	Card,
	CardTitle,
	CardBody,
	Button,
	CardFooter,
	Dropdown,
	MenuItem,
	Grid,
	Form,
	FormGroup,
	FormControl,
	Col,
	CardHeading,
	EmptyState,
	EmptyStateIcon,
	EmptyStateAction
} from 'patternfly-react';

interface Step {
	id: string;
	command: string;
}

interface CreateDockerState {
	steps: Step[]
}

export default class CreateDockerPage extends Component <{}, CreateDockerState>{

	constructor(props) {
		super(props);
		this.state = {
			steps: [generateNode()]
		}
		this.handleClickAddStep = this.handleClickAddStep.bind(this);
		this.handleClickClearAll = this.handleClickClearAll.bind(this);
	}

	handleStepsRemove(index) {
		let {steps} = this.state;
		steps = steps.slice(0, index).concat(steps.slice(index + 1));
		this.setState({steps});
	}

	handleStepsInsert(index) {
		let {steps} = this.state;

	}

	handleClickAddStep() {
		let {steps} = this.state;
		steps.push(generateNode());
		this.setState({steps});
	}

	handleInputChange(value: string, key: string, index: number){
		let {steps} = this.state;
		steps[index][key] = value;
		this.setState({
			steps
		});
	}

	handleClickClearAll() {
		this.setState({
			steps: [
				generateNode()
			]
		});
	}

   	renderDescription() {
   	    return <Card>
   	        <CardTitle>
   	            Create Docker file
   	        </CardTitle>
   	        <CardBody>
   	            This is some basic text about how to create docker file and it also describes how the file is generated ant how it is used
   	        </CardBody>
   	        <CardFooter>
   	        	<Button bsStyle="danger" onClick={this.handleClickClearAll}>Clear All</Button>
   	        	<Button style={{marginLeft: '10px'}} bsStyle="success">Save</Button>
   	        </CardFooter>
   	    </Card>
   	}

   	renderCardList() {
   		return <div style={{height: 'calc(100vh - 256px)', overflowY: 'scroll'}}>
   			{this.state.steps.map((step, index) => {
   				let showAddButton = (index == (this.state.steps.length - 1));
		   		return <CardBody key={`step-${step.id}`} style={{margin: '0px'}}>
		            <Grid>
		            	<Col sm={2} style={{textAlign: 'right'}}>
		            		Step {index + 1}
		            	</Col>
		            	<Col sm={10}>
			            	<Form inline>
			   	            <FormGroup controlId="command" disabled={false}>
			   	            	<FormControl type="text" placeholder="command" disabled={false} style={{width: '400px'}} value={step.command} onChange={({target}) => {this.handleInputChange(target.value, 'command', index)}} />
			   	            	{index ? <Button bsStyle="danger" onClick={() => this.handleStepsRemove(index)} style={{marginLeft: '10px'}}>-</Button> : null}
			   	            	{showAddButton ? <Button bsStyle="primary" style={{marginLeft: '10px'}} onClick={this.handleClickAddStep}>+</Button> : null}
			   	            </FormGroup>
			   	            </Form>
		   	        	</Col>
		   	        </Grid>
		        </CardBody>
		    })}
		</div>
   	}

    render() {
		return <div className="docker-container">
			{this.renderDescription()}
			{this.renderCardList()}
		</div>
    }
}