module.exports = {
  entry: {
    "./popup/bundle": "./popup/src/index.js",
    "./background/bundle": "./background/src/index.js",
    "./profiles/bundle": "./profiles/src/index.js"
  },
  output: {
    path: __dirname,
    filename: "[name].js"
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devtool: 'inline-source-map'
};
