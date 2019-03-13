export interface Description {
    id: string;
    name: string;
}

export interface DeploymentConfigType{
    json: {
        obj: any;
        value: string;
    };
    subset: {
        obj: any;
        value: string;
        yaml: string;
    };
}