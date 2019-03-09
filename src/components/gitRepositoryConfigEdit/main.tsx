import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import GitRepositoryConfigForm from './gitRepositoryConfigForm';

interface GitRepositoryConfigRouterProps {
  repoId: string;
}

interface GitRepositoryConfigProps extends RouteComponentProps<GitRepositoryConfigRouterProps> {

}

export default class GitRepositoryConfigEdit extends Component<GitRepositoryConfigProps> {
    render() {
        return <GitRepositoryConfigForm repoId={this.props.match.params.repoId} />
    }
}