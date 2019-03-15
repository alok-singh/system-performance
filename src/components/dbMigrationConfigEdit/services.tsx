import { Host, Routes } from '../../config/constants';

export const getGitRepo = (id) => {
    const URL = `${Host}${Routes.GIT_REPO}/${id}`;

    return fetch(URL, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
    })
        .then(response => response.json())
        .then(response => {
            return response;
        })

}

export const getMigrationTools = () => {
    const URL = `${Host}${Routes.MIGRATION_TOOLS}`;

    return fetch(URL, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
    })
        .then(response => response.json())
        .then(
            (response) => {
                return response
            },
        )
}

export const getDatabases = () => {
    const URL = `${Host}${Routes.DATABASE}`;

    return fetch(URL, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
    })
        .then(response => response.json())
        .then(
            (response) => {
                return response;
            },

        )
}

export const saveMigrationConfig = (request) => {
    const URL = `${Host}${Routes.DB_MIGRATION_CONFIGURATION}`;

    return fetch(URL, {
        method: 'POST',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(request)
    })
        .then(response => response.json())
        .then(
            (response) => {
                return response;
            },

        )
}

export const updateMigrationConfig = (request, id:number) => {
    const URL = `${Host}${Routes.DB_MIGRATION_CONFIGURATION}/${id}`;

    return fetch(URL, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(request)
    })
        .then(response => response.json())
        .then(
            (response) => {
                return response;
            },

        )
}

export const getDBMigrationConfig = (id: number) => {
    const URL = `${Host}${Routes.DB_MIGRATION_CONFIGURATION}/${id}`;

    return fetch(URL, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
    })
        .then(response => response.json())
        .then(
            (response) => {
                return response;
            },

        )
}

