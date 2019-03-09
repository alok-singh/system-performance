
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
    accountOptions: Array<Account>;

    account: Array<string>;
    url: string;
    path: string;
    appName: string;
    productionBranch: string;
    ciBranch: string
    ctBranch: string;
    gitProvider: number;
}
