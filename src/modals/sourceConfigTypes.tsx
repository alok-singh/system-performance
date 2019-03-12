
export interface Account {
    name: string;
    id: number;
    url: string;
}

export interface SourceConfigResponse {
    success: boolean;
    response: [];
    error: { message: string } | null;
}

export interface SourceConfigFormState {
    accountOptions: Account[];
    tagPattterOptions: { value: string, label: string }[];
    form: {
        account: Array<string>;
        url: string;
        path: string;
        appName: string;
        ciBranch: {
            name: string;
            tagPatternType: string;
            tagPattern: string;
        }
        ctBranch: {
            name: string;
            tagPatternType: string;
            tagPattern: string;
        }
        productionBranch: {
            name: string;
            tagPatternType: string;
            tagPattern: string;
        }
        gitProvider: number;
    }
}
