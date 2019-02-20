import React, { Component } from 'react'
import { Navigation } from '../../components/Navigation';
import { KuberneteGraph } from '../components/KubernetesGraph';

export class KubernetesDashboard extends Component {

    render() {
        return (
            <Navigation>
                <KuberneteGraph></KuberneteGraph>
            </Navigation>
        );
    }
}