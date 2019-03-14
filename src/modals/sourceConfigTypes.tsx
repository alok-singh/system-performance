import { Error } from './commonTypes';

export interface Repository {
    name: string;
    id: number;
    url: string;
}
export interface SourceTypeConfig {
    //tag pattern type
    type: string;
    value: string;
    name: string;
}
export interface GitMaterial {
    id: number | null;
    name: string;
    url: string;
    gitProviderId: number;
    path: string;
    ciSource: SourceTypeConfig;
    ctSource: SourceTypeConfig;
    productionSource: SourceTypeConfig;
}
export interface SourceConfigFormState {
    repositoryOptions: Repository[];
    tagOptions: { label: string, value: string }[];

    code: number;
    status: string;
    errors: Error[];
    successMessage: string | null;
    buttonLabel: string;

    app: {
        appId: number | null;
        appName: string;
        material: GitMaterial[];
    }
}
