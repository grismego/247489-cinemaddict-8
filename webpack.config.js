const path = require(`path`);
const WorkboxPlugin = require(`workbox-webpack-plugin`);

module.exports = {
  mode: `development`,
  entry: `./src/main.js`,
  plugins: [
    new WorkboxPlugin.InjectManifest({
      swSrc: `./src/sw.js`,
      swDest: `sw.js`
    })
  ],
  output: {
    filename: `bundle.js`,
    path: path.join(__dirname, `public`),
  },
  resolve: {
    alias: {
      app: path.join(__dirname, `src`),
    },
  },
  devtool: `source-map`,
  devServer: {
    contentBase: path.join(__dirname, `public`),
    publicPath: `http://localhost:8080/`,
    hot: true,
    compress: true
  }
};
