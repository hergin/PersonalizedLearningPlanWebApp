module.exports = {
    presets: [
        "@babel/preset-env",
        "@babel/preset-react" 
    ]
};

module.rules = {
    test: /\.m?js$/,
    resolve: {
        fullySpecified: false,
    },
};
