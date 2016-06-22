/*
 * 入口文件
 */

import React from 'react';
import { render } from 'react-dom';

import './style';
import App from './App';

'use strict'; 

const contentEl = document.createElement('div');

render(<App />,contentEl);

document.querySelector('#page').appendChild(contentEl);