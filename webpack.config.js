const path = require('path');

module.exports = [
  // CommonJS build
  {
    entry: './src/index.ts',
    mode: 'production',
    target: 'node',
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'commonjs2',
      },
      clean: true,
    },
    externals: {
      axios: 'axios',
    },
  },
  // ESM build
  {
    entry: './src/index.ts',
    mode: 'production',
    target: 'node',
    experiments: {
      outputModule: true,
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js'],
    },
    output: {
      filename: 'index.esm.js',
      path: path.resolve(__dirname, 'dist'),
      library: {
        type: 'module',
      },
      clean: false,
    },
    externals: {
      axios: 'axios',
    },
  },
];
