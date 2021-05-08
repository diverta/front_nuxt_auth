const path = require('path');

module.exports = {
    resolve: {
        alias: {
            '~': path.resolve(rootPath, '/src'),
            '@': path.resolve(rootPath, '/src')
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
        ]
    }
};
