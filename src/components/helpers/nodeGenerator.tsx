import {DeploymentTemplateList, TriggerTypeList} from '../../config/buildConfigurations';

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
        deploymentTemplates: JSON.parse(JSON.stringify(DeploymentTemplateList)),
        triggerTypeLists: JSON.parse(JSON.stringify(TriggerTypeList)),
        downstreams: []
    }
}