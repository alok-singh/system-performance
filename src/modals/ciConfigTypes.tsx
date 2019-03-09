export interface ArgsFieldSetState {
    args: Array<{ key: string, value: String }>;
}

export interface CIConfigResponse {
    success: boolean;
    response: any[];
    error: { message: string } | null;
}

export interface DockerRepository {
    id: string;
    registryUrl: string;
    isDefault: boolean;
}

export interface CIConfigFormState {
    repositoryOptions: Array<DockerRepository>;

    form: {
        dockerFilePath: string;
        tagPattern: string;
        args: Array<{ key: string, value: string }>;
        repository: string;
        dockerfile: string;
    }

    validation: {
        dockerFilePath: string;
        tagPattern: string;
        args: string;
        repository: string;
        dockerfile: string;
    }
}
