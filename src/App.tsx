import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import FlowChart from './components/flowChart/main';
import CreateDocker from './components/createDocker/main';
import Graphs from './components/graphs/main';
import AppList from './components/appList/main';
import DockerRegistryList from './components/dockerRegistry/main';
import DockerRegistryConfigEdit from './components/dockerRegistryEdit/main';
import CIConfigEdit from './components/ciConfigEdit/main';
import SourceConfigEdit from './components/sourceConfigEdit/main';
import DeploymentConfigEdit from './components/deploymentConfigEdit/main';
import GitRepositoryConfigEdit from './components/gitRepositoryConfigEdit/main';
import GitRepoList from './components/gitRepoList/main';


import Navigation from './components/common/navigation';
import { navigationListProvider } from './config/navigationConfig';


import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import 'patternfly/dist/css/rcue.css';
import 'patternfly/dist/css/rcue-additions.css';
import 'patternfly-react/dist/css/patternfly-react.css';
import './css/base.css';


class App extends Component {
	render() {
	    return (
	        <Switch>
	        	<Navigation item={navigationListProvider(location.pathname)}>
	            	<Route exact path="/flow-chart" component={FlowChart} />
	            	<Route exact path="/create-docker" component={CreateDocker} />
	            	<Route exact path="/graphs" component={Graphs} />
	            	<Route exact path="/list/apps" component={AppList} />
					<Route exact path="/list/docker-registries" component={DockerRegistryList} />
	            	<Route exact path="/form/docker-register" component={DockerRegistryConfigEdit} />
	            	<Route exact path="/form/docker-register/:id" component={DockerRegistryConfigEdit} />
	            	<Route exact path="/form/ci-config" component={CIConfigEdit} />
	            	<Route exact path="/form/source-config" component={SourceConfigEdit} />
	            	<Route exact path="/form/deployment-template" component={DeploymentConfigEdit} />
	            	<Route exact path="/form/git-repo-config" component={GitRepositoryConfigEdit} />
	            	<Route exact path="/form/git-repo-config/:repoId" component={GitRepositoryConfigEdit} />
	            	<Route exact path="/list/git-repos" component={GitRepoList} />
	            </Navigation>
	        </Switch>
	    );
  	}
}

export default App;