let path = require('path'),
    webpack = require('webpack');

module.exports = {
    context: path.resolve('src'),

    entry: ['./index'],

    output: {
        path    : path.resolve('dist'),
        filename: 'bee-vue.min.js',
        library      : 'beeVue',
        libraryTarget: 'umd'
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
                loader : 'babel',
                include: [
                    path.resolve('src'),
                    /bee-core\\src/
                ],
                query  : {
                    presets: ['es2015'],
                    plugins: ['transform-runtime']
                }
            }
        ]
    },

    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: false,
            compress : {
                warnings: false
            }
        })
    ]
};