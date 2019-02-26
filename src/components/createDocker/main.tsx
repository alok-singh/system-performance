import React, {Component} from 'react';

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
			steps: [
				{
					id: '123',
					command: 'rm -rf ./dist'
				}
			]
		}
		this.handleClickAddStep = this.handleClickAddStep.bind(this);
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
		steps.push({
			id: `S${(new Date()).getTime().toString(36)}`,
			command: ''
		});
		this.setState({steps});
	}

	handleInputChange(value: string, key: string, index: number){
		let {steps} = this.state;
		steps[index][key] = value;
		this.setState({
			steps
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
   	        	<Button bsStyle="danger">Clear All</Button>
   	        	<Button style={{marginLeft: '10px'}} bsStyle="success">Save</Button>
   	        </CardFooter>
   	    </Card>
   	}

   	renderCardList() {
   		return <Card>
   			{this.state.steps.map((step, index) => {
   				let showAddButton = (index == (this.state.steps.length - 1));
		   		return <CardBody key={`step-${step.id}`}>
		            <Grid>
		            	<Col sm={1}>
		            		Step {index + 1}
		            	</Col>
		            	<Col sm={11}>
			            	<Form inline>
			   	            <FormGroup controlId="command" disabled={false}>
			   	            	<FormControl type="text" placeholder="command" disabled={false} style={{width: '400px'}} value={step.command} onChange={({target}) => {this.handleInputChange(target.value, 'command', index)}} />
			   	            	{index ? <Button bsStyle="danger" onClick={() => this.handleStepsRemove(index)} style={{marginLeft: '10px'}}>Remove</Button> : null}
			   	            	{index ? <Button bsStyle="primary" onClick={() => this.handleStepsInsert(index)} style={{marginLeft: '10px'}}>Add Above</Button> : null}
			   	            	{showAddButton ? <Button bsStyle="primary" style={{marginLeft: '10px'}} onClick={this.handleClickAddStep}>Add More</Button> : null}
			   	            </FormGroup>
			   	            </Form>
		   	        	</Col>
		   	        </Grid>
		        </CardBody>
		    })}
		</Card>
   	}

    render() {
		return <div className="docker-container">
			{this.renderDescription()}
			{this.renderCardList()}
		</div>
    }
}