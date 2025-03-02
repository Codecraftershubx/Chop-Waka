import express from 'express';
import { createEngine } from 'express-react-views';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const app = express();

// Configure view engine for ESM
app.engine('jsx', createEngine({
  transformViews: false,
  babel: {
    presets: ['@babel/preset-react', '@babel/preset-env'],
    plugins: ['@babel/plugin-transform-modules-commonjs']
  }
}));

// ... rest of server config remains the same