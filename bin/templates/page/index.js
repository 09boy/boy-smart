/*
 * 入口文件. 强烈建议只当作 Factory 去使用
 */

import React from 'react';
import { render } from 'react-dom';

import './style';
import { App } from './App';

'use strict'; 

const contentEl = document.createElement('div');

render(<App />,contentEl);

document.querySelector('#page').appendChild(contentEl);