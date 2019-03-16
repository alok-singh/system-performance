export const ItemTypes = {
    CARD: 'card'
}
export const ArrowEndPointClass: string = "arrow-container";

export const Host = "http://localhost:3001";

export const Routes = {

    GET_SAVED_DEPLOYMENT_TEMPLATE: "",
    // GET_DOCKER_REPOSITORY: "/config/git-repo-config",
    GET_ACCOUNT: "/config/docker-registry-config",

    CI_CONFIG: "/pipeline-config/ci/save",
    SOURCE_CONFIG: "/pipeline-config/app/create",
    DEPLOYMENT_TEMPLATE: "/pipeline-config/deployment-template",

    APP_LIST: "",
    CHART_REPO: "/pipeline-config/chart-repo",
    REFERENCE_TEMPLATE: "/pipeline-config/ref-temp",
    DOCKER_REGISTRY_CONFIG: "/config/docker-registry-config",
    GIT_REPO_CONFIG: "/config/git-repo-config",
    INSTANCE_LIST: "/logs/instances",
    LOGS: "/logs",
    PROPS: "/pipeline-config/props",
    GIT_REPO: "/config/git-repo",
    MIGRATION_TOOLS: "/config/mig-tools",
    DATABASE: "/config/databases",
    DB_MIGRATION_CONFIGURATION: "/config/db-migration-config",
    PROPERTIES: "/config/properties",
    PROPERTY_OPTIONS: "properties-options",
    ENVIRONMENT: "/config/environment",
    TRIGGER_NODE_LIST: "/trigger-nodes"
}
export const FormType = {
    SAVE: "SAVE",
    UPDATE: "UPDATE"
}

export const RequestMethod = {
    GET: "GET",
    PUT: "PUT",
    DELETE: "DELETE",
    POST: "POST"
}