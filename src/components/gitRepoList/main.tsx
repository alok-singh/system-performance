import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router';

import GitRepositoryList from './gitRepoList';

interface GitRepoListRouterProps {

}

interface GitRepoListProps extends RouteComponentProps<GitRepoListRouterProps> {
    
}

export default class GitRepoListPage extends Component<GitRepoListProps>{
    render() {
        return <GitRepositoryList />
    }
}