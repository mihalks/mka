const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const {
  NODE_ENV,
  SERVER_HOST,
  SERVER_PORT,
  SERVER_WEB_HOST,
  SERVER_WEB_PORT,
} = process.env;

const proxy = `http://${SERVER_HOST}:${SERVER_PORT}`;
console.log(proxy);

module.exports = {
  mode: NODE_ENV || 'production',
  entry: "./src/index.tsx",
  devtool: NODE_ENV !== 'production' ? 'inline-source-map' : '',
  output: {
    publicPath: "/",
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist")
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },

  module: {
    rules: [
      { 
        test: /\.tsx?$/, 
        use: [
          {
            loader: 'ts-loader',
            options: {
              compilerOptions: {noEmit: false},
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(css|s[ac]ss)$/i,
        use: [
          { loader: 'style-loader' },
          {
            loader: "css-loader", options: {
              importLoaders: 1,
              // modules: true
            }
          },
          "sass-loader"
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg$)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      favicon: "./public/favicon.ico",
      filename: "index.html",
      inject: "body",
      hash: true
    })
  ],

  devServer: {
    allowedHosts: [
      SERVER_HOST,
      'localhost',
    ],
    historyApiFallback: true,
    open: true,
    hot: true,
    host: SERVER_WEB_HOST,
    port: SERVER_WEB_PORT,
    proxy: {
      '/api': proxy,
      '/acc': proxy,
      '/auth': proxy,
      '/socket.io': {
        target: proxy,
        ws: true
      },
      '/images': proxy
    }
  }
};
