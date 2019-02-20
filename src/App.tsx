import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

import { VSMEdit } from './pages/VSMEdit';
import { KubernetesDashboard } from './monitoring/pages/KubernetesDashboard';

class App extends Component {

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/vsm/edit/:appName" component={VSMEdit} />
          <Route exact path="/graph" component={KubernetesDashboard} />
        </Switch>
      </div>
    );
  }
}

export default App;