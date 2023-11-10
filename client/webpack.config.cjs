const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: path.join(__dirname, "client/src", "index.jsx"),
    output: {
        file: "output.js",
        path: path.resolve(__dirname, "dist"),
    },
    module: {
        rules: [
            {
                test: /\.m?(js|jsx)$/,
                include: path.resolve(__dirname, 'src'),
                type: "javascript/auto",
                exclude: /node_modules/,
                use: ["babel-loader", "jsx-loader"],
                resolve: {
                    extensions: ['.js', '.jsx'],
                    fullySpecified: false,
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(png|jp(e*)g|svg|gif)$/,
                use: ['file-loader'],
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "client/public", "index.html"),
        }),
    ]
}
