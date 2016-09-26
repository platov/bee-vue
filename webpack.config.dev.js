let path = require('path');

module.exports = {
    context: path.resolve('src'),

    devtool: 'inline-source-map',

    entry: ['./index'],

    output: {
        path         : path.resolve('dist'),
        filename     : 'bee-vue.js'
    },

    module: {
        loaders: [
            {
                test   : /\.js$/,
                include: [path.resolve('src'), path.resolve('node_modules/bee-core')],
                loader : 'babel'
            }
        ]
    }
};