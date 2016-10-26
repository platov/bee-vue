let path = require('path');

module.exports = {
    context: path.resolve('src'),

    devtool: '#inline-source-map',

    entry: ['./index'],

    output: {
        path    : path.resolve('dist'),
        filename: 'bee-vue.js',
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
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
        })
    ]
};