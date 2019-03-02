import {EnvironmentList as environments} from '../config/buildConfigurations';

export const generateNode = () => {
    return {
        x: 200,
        y: 200,
        title: '',
        id: `N${(new Date()).getTime().toString(36)}`,
        activeIn: false,
        activeOut: false,
        condition: '',
        triggerType: '',
        buildType: '',
        environments: JSON.parse(JSON.stringify(environments)),
        downstreams: []
    }
}