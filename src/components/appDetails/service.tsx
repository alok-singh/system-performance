import { Host, Routes } from '../../config/constants';


export const getInstances = () => {
    const URL = `${Host}${Routes.INSTANCE_LIST}`;
    return fetch(URL, {
        method: 'GET',
        headers: { 'Content-type': 'application/json' },
    })
    .then(response => response.json())
    .then(response => {
        return response;
    })

}