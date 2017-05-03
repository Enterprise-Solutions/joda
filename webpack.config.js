var webpack = require('webpack');
//var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: './public/javascripts/app/boot.ts',
    output: {
        path: './public/dist',
        filename: 'app.bundle.js'
    },
    module: {
        loaders: [
            {test: /\.ts$/, exclude: /target/, loader: 'ts'},
            {test: /\.html$/, loader: 'raw'},
            {test: /\.css$/, loader: 'raw'},
            {test: /\.scss$/, loader: 'raw!postcss-loader!sass'}
        ]
    },
    resolve: {
        extensions: ['', '.js', '.ts', '.html', '.css']
    },
    plugins: [
        /*new HtmlWebpackPlugin({
         template: './src/index.html'
         })*/
        new webpack.DefinePlugin({
            app: {
                environment: JSON.stringify(process.env.APP_ENVIRONMENT || 'development')
            }
        })
    ]
};