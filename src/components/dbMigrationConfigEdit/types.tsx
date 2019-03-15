import { RouteComponentProps } from 'react-router';
import { Error } from '../../modals/commonTypes';

export interface DBMigrationConfigRouterProps {
    id: string;
}

export interface DBMigrationnConfigProps extends RouteComponentProps<DBMigrationConfigRouterProps> {

}

export interface DBMigrationConfigFormState {
    code: number;
    errors: Error[];
    successMessage: string | null;
    buttonLabel: string;
    migrationTools: any[];
    databases: any[];
    
    dbMigrationConfig: {
        appId: number | null;
        gitRepositoryURL: string;
        scriptSource: string;
        migrationTool: string;
        database: string;
    }
}