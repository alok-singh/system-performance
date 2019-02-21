import 'fetch';

export const post = (url, data, headers) => {
    return fetchAPI(url, 'POST', data, headers);
}

export const get = (url, headers) => {
    return fetchAPI(url, 'GET', null, headers);
}

export const deleteReq = (url, headers) => {
    return fetchAPI(url, 'DELETE', null, headers);
}

const fetchAPI = (url, type, data, headers) => {
    let options = {
        method: type,
        headers: {
            'Accept': (headers && headers.accept) ? headers.accept : 'application/json',
            'Content-Type': (headers && headers.contentType) ? headers.contentType : 'application/json'
        }
    };
    options.headers.authorization = (headers && headers.authorization) ? headers.authorization : undefined;
    options.body = data ? JSON.stringify(data) : undefined;
    return fetch(url, options).then(response => response.json())
}