import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom'

import { VSMEdit } from './pages/VSMEdit';

class App extends Component {

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/vsm/edit/:id" component={VSMEdit} />
        </Switch>
      </div>
    );
  }
}

export default App;