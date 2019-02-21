'use strict';

import http from 'http';
import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import {loginController} from './controllers/loginController';
import {gatewayPostController, gatewayGetController, gatewayDeleteController} from './controllers/apiController';


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/templates'));

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get('/login', (req, res) => {
	requestGateway(req, res, loginController);
});

app.get('/build/*', (req, res) => {
	let filePath = "." + req.url;
	let contentType = req.url.split('.').pop();
	contentType = contentType == 'css' ? {'Content-Type': 'text/css'} : {'Content-Type': 'application/javascript'};
	getFileFromPath(filePath, res, contentType);
});

app.get('/images/*', (req, res) => {
	let filePath = path.resolve("./images" + decodeURI(req.url.split("images").pop()));
	getFileFromPath(filePath, res, {
		'Content-Type': 'image/jpg', 
		'Cache-Control': 'public, max-age=31557600'
	});
});

app.get('/api/*', (req, res) => {
	gatewayGetController(req, res);
});

app.get('/*', (req, res) => {
	sendTo404(res);
});

app.post('/api/*', (req, res) => {
	gatewayPostController(req, res);
});

app.delete('/api/*', (req, res) => {
	gatewayDeleteController(req, res);
})

const requestGateway = (req, res, controller) => {
	try{
		controller(req, res);
	}
	catch(err) {
		console.log(err);
		sendTo404(res);
	}
}

const getFileFromPath = (filePath, res, contentType)  => {
	fs.readFile(filePath, (err, data) => {
		if(err){
			sendTo404(res);
		}
		else{
			res.writeHead(200, contentType);
			res.write(data);
			res.end();
		}
	});
}

const sendTo404 = (res) => {
	res.writeHead(404, {'Content-Type': 'text'});
	res.write("404 Not found");
	res.end();
}


// *********************** server start ************************** //

http.createServer(app).listen(3000);

console.log("server started in port 3000");




