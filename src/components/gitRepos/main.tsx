import React, {Component} from 'react';
import {dummyData, gitRepositoryParse, gitRepositoriesType} from '../../modals/gitRepositories';
import {
	Col,
	Card,
	CardBody,
	Button,
	CardFooter,
	CardTitle,
	FormControl,
	CardGrid,
	Row
} from 'patternfly-react';

interface RepositoryState {
	searchInput: string;
	repositories: any[];
}

export default class Graph extends Component <any, RepositoryState> {
	
	constructor(props) {
		super(props);
		this.state = {
			searchInput: '',
			repositories: []
		}
	}

	handleInputChange(key: string, value: string) {
		let state = this.state;
		state[key] = value;
		this.setState(state);
	}

	componentDidMount() {
		// TODO api request to get list of git repositories
		this.setState({
			repositories: gitRepositoryParse(dummyData)
		})
	}

	renderRepositoryCard(repository: gitRepositoriesType) {
		return <Col md={3}>
			<Card matchHeight accented>
				<CardBody>
					{Object.keys(repository).map(key => {
						return <div>
							<span style={{fontWeight: 'bold'}}>{key.toUpperCase()}: </span>
							<span>{repository[key]}</span>
						</div>
					})}
				</CardBody>
				<CardFooter>
					<Button style={{marginRight: '10px'}} bsStyle="danger">Delete</Button>
					<Button bsStyle="primary">Edit</Button>
				</CardFooter>
			</Card>
		</Col>
	}

	renderRepositoryList() {
		if(this.state.repositories.length){
			return <CardGrid matchHeight>
				<Row>
					{this.state.repositories.map(repository => {
						return this.renderRepositoryCard(repository);
					})}
				</Row>
			</CardGrid>
		}
		else{
			return <div>
				No Repos Yet
			</div>
		}

	}

	renderDescription() {
	    return <Card>
	        <CardTitle>
	            Repositories
	            <Button style={{marginLeft: '10px', display: 'inline-block', verticalAlign: 'middle'}} bsStyle="success">Add</Button>
	        </CardTitle>
	        <CardBody>
	            You have currently following repositories registerd.
	        </CardBody>
	        <CardFooter>
	        	<FormControl type="text" placeholder="Search" disabled={false} style={{width: '400px', display: 'inline-block', verticalAlign: 'middle'}} value={this.state.searchInput} onChange={({target}) => {this.handleInputChange('searchInput', target.value)}} />
	        	<Button style={{marginLeft: '10px', display: 'inline-block', verticalAlign: 'middle'}} bsStyle="primary">Search</Button>
	        </CardFooter>
	    </Card>
	}

	render() {
		return <div className="repository-container">
			{this.renderDescription()}
			{this.renderRepositoryList()}
		</div>
	}
}

