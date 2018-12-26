var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');
var fs = require('fs');

/* helper function to get into build directory */
var libPath = function(name) {
  if ( undefined === name ) {
    return 'dist';
  }

  return name;
}

/* helper to clean leftovers */
var outputCleanup = function(dir) {
  if (false == fs.existsSync(libPath())){
    return;
  }

  var list = fs.readdirSync(dir);
  for(var i = 0; i < list.length; i++) {
    var filename = path.join(dir, list[i]);
    var stat = fs.statSync(filename);

    if(filename == '.' || filename == '..') {
      // pass these files
      } else if(stat.isDirectory()) {
        // outputCleanup recursively
        outputCleanup(filename, false);
      } else {
        // rm fiilename
        fs.unlinkSync(filename);
      }
  }
  fs.rmdirSync(dir);
};

var webpack_opts = {
  entry: './index.ts',
  target: 'node',
  mode: process.env.NODE_ENV || 'production',
  output: {
    filename: libPath('index.js'),
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['.ts', '.js'],
    modules: [
      'node_modules',
      'src',
    ]
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.ts$/,
        loader: 'tslint-loader',
        exclude: /node_modules/,
      }, {
        test: /\.ts$/,
        loader: 'ts-loader',
        exclude: [
          /node_modules/
        ],
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new webpack.LoaderOptionsPlugin({
      options: {
        tslint: {
          emitErrors: true,
          failOnHint: true
        }
      }
    }),
  ]
}

module.exports = webpack_opts;
