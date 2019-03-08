import {Host, Routes } from '../config/constants';

export interface gitRepositoriesType {
    authMode: string;
    id: string;
    name: string;
    password: string;
    url: string;
    userName: string;
}

export const dummyData = [{
    authMode: "USERNAME_PASSWORD",
    id: "1",
    name: "abc-git-1",
    password: "demo password",
    url: "https://git-abc-1.com",
    userName: "demoUser"
},{
    authMode: "USERNAME_PASSWORD",
    id: "2",
    name: "abc-git-1",
    password: "demo password",
    url: "https://git-abc-1.com",
    userName: "demoUser"
},{
    authMode: "USERNAME_PASSWORD",
    id: "3",
    name: "abc-git-1",
    password: "demo password",
    url: "https://git-abc-1.com",
    userName: "demoUser"
},{
    authMode: "USERNAME_PASSWORD",
    id: "4",
    name: "abc-git-1",
    password: "demo password",
    url: "https://git-abc-1.com",
    userName: "demoUser"
}]

export const getGitRepositoryList = () => {
    const URL = `${Host}${Routes.GIT_REPO_CONFIG}`;
    return fetch(URL, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
    })
    .then(response => response.json())
    .then(response => {
        /*
            putting dummdata for now
            if you have modal you never have to change keys of
            json in your component 
            keep all the apis outside of component so that 
            you never have to change your component
        */
        return response;
    })
    // return new Promise((resolve, reject) => {
    //     resolve({
    //         code: 200,
    //         errors: undefined,
    //         result: {
    //             GitRepos: gitRepositoryParse(dummyData)
    //         }
    //     })
    // })
}

export const gitRepositoryParse = (repositories) => {
    if(repositories.length) {
        return repositories.map(repository => {
            return {
                authMode: repository.authMode,
                id: repository.id,
                name: repository.name,
                url: repository.url,
                userName: repository.userName
            }
        })
    }
    else { 
        return [];
    }
}