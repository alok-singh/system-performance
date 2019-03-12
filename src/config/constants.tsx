export const ItemTypes = {
    CARD: 'card'
}
export const ArrowEndPointClass: string = "arrow-container";

export const Host = "http://localhost:3001";

export const Routes = {

    GET_SAVED_DEPLOYMENT_TEMPLATE: "",
    GET_DOCKER_REPOSITORY: "/config/git-repo-config",
    GET_ACCOUNT: "/config/docker-registry-config",

    SAVE_CI: "/pipeline-config/ci/save",
    SAVE_SOURCE_CONFIG: "/pipeline-config/app/create",
    SAVE_DEPLOYMENT_TEMPLATE: "",

    APP_LIST: "",
    DOCKER_REGISTRY_CONFIG: "/config/docker-registry-config",
    GIT_REPO_CONFIG: "/config/git-repo-config",
    INSTANCE_LIST: "/logs/instances",
    LOGS: "/logs",
    PROPERTIES: "/config/properties",
    PROPERTY_OPTIONS: "properties-options",
    ENVIRONMENT: "/config/environment"
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