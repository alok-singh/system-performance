import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import FlowChart from './components/flowChart/main';
import CreateDocker from './components/createDocker/main';

import Navigation from './components/common/navigation';
import { navigationListProvider } from './components/config/navigationConfig';

import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import 'patternfly/dist/css/rcue.css';
import 'patternfly/dist/css/rcue-additions.css';
import 'patternfly-react/dist/css/patternfly-react.css';
import './App.css';


class App extends Component {
	render() {
	    return (
	        <Switch>
	        	<Navigation item={navigationListProvider(location.pathname)}>
	            	<Route exact path="/flow-chart" component={FlowChart} />
	            	<Route exact path="/create-docker" component={CreateDocker} />
	            </Navigation>
	        </Switch>
	    );
  	}
}

export default App;