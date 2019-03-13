export interface ArgsFieldSetState {
    args: Array<{ key: string, value: string }>;
}

export interface CIConfigFormProps {
    id: string;
}

export interface DockerRepository {
    id: string;
    registryURL: string;
    isDefault: boolean;
}

export interface CIConfigFormState {
    repositoryOptions: Array<DockerRepository>;
    buttonLabel: string;
    code: 0,
    errors: {
        code: number;
        internalMessage: string;
        moreInfo: string;
        userMessage: string;
    }[],
    successMessage: string | null,

    form: {
        appId: string | null;
        dockerFilePath: string;
        tagPattern: string;
        args: Array<{ key: string, value: string }>;
        repository: string;
        dockerfile: string;
    }

    isValid: {
        dockerFilePath: boolean;
        tagPattern: boolean;
        args: boolean;
        repository: boolean;
        dockerfile: boolean;
    }

}
