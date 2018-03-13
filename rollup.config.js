import json from 'rollup-plugin-json';

export default {
  input: 'src/bundler.js',
  output: {
    file: 'dist/useractionsBundle.js',
    format: 'iife'
  },
  plugins: [
    json({
      exclude: [
        'node_modules/**'
      ]
    })
  ]
};
