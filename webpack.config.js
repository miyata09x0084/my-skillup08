const path = require("path");

module.exports = {
    mode: 'development',
    entry: {app: './src/index.js'},
    output: {
        path: path.join(__dirname, "./"),
        filename: '[name].js',
    },
    devtool: 'inline-source-map',

    devServer: {
        open: false,
        openPage: "index.html",
        contentBase: path.join(__dirname, './'),
        watchContentBase: true,
        port: 4000,
    }
};