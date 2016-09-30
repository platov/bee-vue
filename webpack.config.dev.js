let path = require('path');

module.exports = {
    context: path.resolve('src'),

    devtool: '#inline-source-map',

    entry: ['./index'],

    output: {
        path    : path.resolve('dist'),
        filename: 'bee-vue.js'
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
    }
};