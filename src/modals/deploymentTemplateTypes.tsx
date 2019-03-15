export interface Description {
    id: number;
    name: string;
}

export interface DeploymentConfigType {
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


export interface DeploymentTemplateFormState {
    code: number;
    errors: [];
    successMessage: string | null;

    chartRepositoryOptions: Description[];
    referenceTemplateOptions: Description[];
    validationMessage: string;
    buttonLabel: string;

    deploymentTemplate: {
        pipelineGroupId: number | null,
        chartRepositoryId: number;
        referenceTemplateId: number;
        deploymentConfig: DeploymentConfigType;
    }
}