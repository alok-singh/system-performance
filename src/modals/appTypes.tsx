import {Host, Routes} from '../config/constants';

export interface App {
    appName: string;
    appId: number;
    timesDeployed: number;

    lastDeployed: {
        time: Date,
        sourceRef: string,
        deployedBy: string;
        dockerTag: string;
    };

    currentInstanceCount: number;
    instanceConfig: {
        ram: number;
        cpu: number;
    };

    inprogressDeploymentDetail: {
        time: Date;
        sourceRef: string;
        deployedBy: string;
        dockerTag: string;
        rolloutStatus: string;
    };

    deploymentStatus: string;
    appEndpoint: Array<string>;

}


export interface AppListData {
    environmentId: string;
    environmentName: string;
    rows: Array<App>;

    sortingColumns: {
        name: {
            direction: string;
            position: number;
        }
    };
    columns: Array<any>;
    pagination: {
        page: number;
        perPage: number;
        perPageOptions: Array<number>;
    }
    itemCount: number;
}


export interface ContainersState {
    containers: Container[];
}
export interface ContainersProps {

}
export interface AppDetailsProps {
    appId: string;
}
export class Container {
    name: string;
    id: string;
    URL: string;
    logs: any[];
    //ref
    eventSourceRef;

    constructor(container, instanceId) {
        this.name = container.name;
        this.id = container.id;
        this.URL = `${Host}${Routes.LOGS}/${container.id}/${instanceId}`;
        this.logs = [];
    }
}

export class Instance {
    id: number;
    name: string;
    cpu: number;
    ram: number;
    status: string;
    containers: Container[];

    constructor(instance) {
        this.id = instance.id;
        this.name = instance.name;
        this.cpu = instance.cpu;
        this.ram = instance.ram;
        this.status = instance.status;
        this.containers = [];
        let newContainer;

        for (let i = 0; i < instance.containers.length; i++) {
            newContainer = new Container(instance.containers[i], instance.id)
            this.containers.push(newContainer);
        }

    }
}
export interface AppDetailsState {

    code: number;
    successMessage: string | null;
    errors: {
        code: number;
        internalMessage: string,
        moreInfo: string,
        userMessage: string,
    }[],


    deploymentDetails: {
        appId: number;
        time: string,
        sourceRef: string,
        deployedBy: string;
        dockerTag: string;
    },
    instances: Instance[];

    linkouts: {
        displayName: string;
        url: string;
    }[];
    //index
    currentInstanceIndex: number;
    currentContainerIndex: number;

    maxLogs: number;
    showOverlay: boolean,

}
