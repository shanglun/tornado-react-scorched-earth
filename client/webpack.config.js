var webpack = require('webpack');

module.exports = {
	entry: [
		//'webpack-dev-server/client?http://localhost:8080',
		'./src/index.jsx'
	],
	module:{
		loaders:[{
			test: /\.jsx?$/,
			exclude: /node_modules/,
			loader:'babel'
		}]
	},
	resolve: {
		extensions: ['', '.js','.jsx']
	},
	output: {
		path: __dirname+'/output',
		publicPath:'/',
		filename: 'output.js'
	},
	devServer:{
		contentBase:"./output",
		hot: true
	},
	plugins: [

	]
};
