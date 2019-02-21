import request from 'request';

const baseURL = 'http://13.67.94.139';

export const post = (url, data, headers) => {
	return requestAPI(url, 'POST', data, headers);
}

export const get = (url, headers) => {
	return requestAPI(url, 'GET', null, headers);
}

export const deleteReq = (url, headers) => {
	return requestAPI(url, 'DELETE', null, headers);
}

export const requestAPI = (url, method, data, headers) => {
	url = baseURL + url;
	const options = { 
		method: method,
	  	url: url,
	  	headers: { 
	    	'cache-control': 'no-cache',
     		'content-type': 'application/json'
	    },
	  	body: data,
	 	json: true 
	};
	options.headers.authorization = headers.authorization;
	return new Promise((resolve, reject) => {
		request(options, (err, res, body) => {  
		    if(err){
		    	reject(err)
		    }
		    else{
		    	resolve(res, body)
		    }
		});
		
	})
	
}