export interface Description {
    id: string;
    name: string;
}

export interface DeploymentConfigType{
    json: {
        obj: any;
        value: string;
    };
    jsonSubset: {
        obj: any;
        value: string;
    };
    
    yamlSubset: any;

}