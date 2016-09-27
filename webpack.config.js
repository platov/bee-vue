let path = require('path'),
    webpack = require('webpack');

module.exports = {
    context: path.resolve('src'),

    entry: ['./index'],

    output: {
        path    : path.resolve('dist'),
        filename: 'bee-vue.min.js'
    },

    externals: {
        'jquery': 'jQuery',
        'vue'   : 'Vue'
    },

    module: {
        loaders: [
            {
                test   : /\.js$/,
                include: [path.resolve('src')],
                loader : 'babel'
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            exclude  : /node_modules/,
            sourceMap: false,
            compress : {
                warnings: false
            }
        })
    ]
};