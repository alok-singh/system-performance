import {deleteReq, post, get} from '../service/api';

export const gatewayDeleteController = (req, res) => {
	deleteReq(req.url, req.headers).then(response => {
		res.writeHead(response.statusCode, {'Content-Type': 'application/JSON'});
		res.write(JSON.stringify(response.body));
		res.end();
	}, (error) => {
		res.writeHead(500, {'Content-Type': 'application/JSON'});
		res.write(error.message);
		res.end();
	})
}

export const gatewayPostController = (req, res) => {
	post(req.url, req.body, req.headers).then((response) => {
		res.writeHead(response.statusCode, {'Content-Type': 'application/JSON'});
		res.write(JSON.stringify(response.body));
		res.end();
	}, (error) => {
		res.writeHead(500, {'Content-Type': 'application/JSON'});
		res.write(error.message);
		res.end();
	})
}

export const gatewayGetController = (req, res) => {
	get(req.url, req.headers).then((response) => {
		res.writeHead(response.statusCode, {'Content-Type': response.headers['content-type']});
		res.write(JSON.stringify(response.body));
		res.end();
	}, (error) => {
		res.writeHead(500, {'Content-Type': 'application/JSON'});
		res.write(error.message);
		res.end();
	})
}