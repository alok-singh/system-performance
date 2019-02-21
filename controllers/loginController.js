import React from 'react';
import {renderToString} from 'react-dom/server';
import LoginComponent from '../src/components/login/loginComponent';


export const loginController = (req, res) => {
	res.render('common', {
		pageTitle: 'Login',
		jsPath: '/build/js/bundle.login.js',
		cssPath: '/build/css/bundle.main.css',
		innerHTML: renderToString(<LoginComponent />)
	});
}