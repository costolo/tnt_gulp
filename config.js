var config = {};

//name of directory ***must be empty string or directory name***
config.directory = '';

//name of css file
config.cssFile = config.directory + 'challA.css';

//name of js file
config.jsFile = config.directory + 'challA.js';

//name of challenger
config.challenger = 'challA.html';

//enable ES2015 transpiling
config.babel = true;

//do not minify files
config.verbose = false;

//do not delete minified files
config.preserveMinFiles = false;

module.exports = config;