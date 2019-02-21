/*
    The main purpose of this file is
    to convert es6 to es5
*/

require('babel-register')({
	presets: [ 'es2015' ]
});

require('./server');