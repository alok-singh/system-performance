import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import FlowChart from './components/flowChart/main';
import CreateDocker from './components/createDocker/main';
import Graphs from './components/graphs/main';
import AppList from './components/appList/main';
import DockerRegistryList from './components/dockerRegistryList/main';
import DockerRegistryConfigEdit from './components/dockerRegistryEdit/main';
import CIConfigEdit from './components/ciConfigEdit/main';
import SourceConfigEdit from './components/sourceConfigEdit/main';
import DeploymentConfigEdit from './components/deploymentConfigEdit/main';
import GitRepositoryConfigEdit from './components/gitRepositoryConfigEdit/main';
import GitRepoList from './components/gitRepoList/main';
import AppDetails from './components/appDetails/main';
import EnvironmentRegister from './components/environmentRegister/main';
import PropertiesForm from './components/propertiesEdit/main';
import FallbackComponent from './components/fallback/main';

import Navigation from './components/common/navigation';
import { navigationListProvider } from './config/navigationConfig';


import 'patternfly/dist/css/patternfly.css';
import 'patternfly/dist/css/patternfly-additions.css';
import 'patternfly/dist/css/rcue.css';
import 'patternfly/dist/css/rcue-additions.css';
import 'patternfly-react/dist/css/patternfly-react.css';
import 'patternfly-react-extensions/dist/css/patternfly-react-extensions.css';
import './css/base.css';
import './css/navigation.css';


export default class App extends Component <any, any> {	

	render() {
	    return <Navigation items={navigationListProvider(location.pathname)}>
        	<Switch>
            	
            	<Route exact path="/create-docker" component={CreateDocker} />
	            
	            <Route exact path="/form-setup/ci-config" component={CIConfigEdit} />
	            <Route exact path="/form-setup/source-config" component={SourceConfigEdit} />
	            <Route exact path="/form-setup/deployment-template" component={DeploymentConfigEdit} />
	            <Route exact path="/form-setup/flow-chart" component={FlowChart} />
            	<Route exact path="/form-setup/properties" component={PropertiesForm} />
	            
	            <Route exact path="/form-global/git-repo-config" component={GitRepositoryConfigEdit} />
	            <Route exact path="/form-global/git-repo-config/:repoId" component={GitRepositoryConfigEdit} />
	            <Route exact path="/form-global/environment-register" component={EnvironmentRegister} />
            	<Route exact path="/form-global/docker-register" component={DockerRegistryConfigEdit} />
            	<Route exact path="/form-global/docker-register/:id" component={DockerRegistryConfigEdit} />

            	<Route exact path="/list/apps" component={AppList} />
				<Route exact path="/list/docker-registries" component={DockerRegistryList} />
	            <Route exact path="/list/git-repos" component={GitRepoList} />

            	<Route exact path="/details/app/:appId" component={AppDetails} />
            	<Route exact path="/details/graphs" component={Graphs} />

            	<Route component={FallbackComponent} />

        	</Switch>
        </Navigation>
  	}
}