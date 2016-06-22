/*
 * 入口文件
 */

import React from 'react';
import { render } from 'react-dom';

// eslint unable to resolve ./style
import './style.scss';
import App from './App';

const contentEl = document.createElement('div');

render(<App />,contentEl);

document.querySelector('#page').appendChild(contentEl);
