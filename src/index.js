import _ from 'lodash';
import './style.css';

const content = document.getElementById('content');

const helloText = document.createElement('div');
helloText.classList.add('hello');
helloText.innerText = 'Hello';

content.append(helloText);