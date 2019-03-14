import { Error } from './commonTypes';

export interface DockerRegistryConfig {
    id: string | null;
    pluginId: string;
    registryURL: string;
    registryType: string;
    aWSAccessKeyId: string;
    aWSSecretAccessKey: string;
    aWSRegion: string;
    username: string;
    password: string;
    isDefault: boolean;
}

export interface DockerRegistryConfigFormState {
    //Response code and errors
    code: number;
    successMessage: string | null;

    errors: Error[],

    buttonLabel: string;
    dockerRegistryConfig: DockerRegistryConfig;

    isValid: {
        pluginId: boolean;
        registryURL: boolean;
        registryType: boolean;
        aWSAccessKeyId: boolean;
        aWSSecretAccessKey: boolean;
        aWSRegion: boolean;
        username: boolean;
        password: boolean;
    }
}

export interface DockerRegistryConfigFormProps {
    id: string;
}


export interface DockerRegistryListState {
    //Response code and errors
    code: number;
    errors: Error[],

    //Data
    rows: Array<DockerRegistryConfig>;

}
