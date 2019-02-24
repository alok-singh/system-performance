import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom'

import FlowChart from './components/flowChart/main';

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
            <Route exact path="/flow-chart" component={FlowChart} />
        </Switch>
    );
  }
}

export default App;