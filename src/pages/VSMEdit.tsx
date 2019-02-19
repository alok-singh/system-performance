import React, { Component } from 'react';

import { GridWithDrag } from '../components/vsm/edit/GridWithDrag';
import { Navigation } from '../components/Navigation';
import { RouteComponentProps } from 'react-router';

interface VSMEditRouterProps {
    appName: string
}

interface VSMEditProps extends RouteComponentProps<VSMEditRouterProps> {

}

export class VSMEdit extends Component<VSMEditProps> {

  render() {
      console.log(this.props.match.params.appName);
    return (
        <Navigation >
            <GridWithDrag />
        </Navigation>
    );
  }
}