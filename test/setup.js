'use strict';

require('babel-core/register');
require('core-js/shim');

const url = require('url');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiEnzyme = require('chai-enzyme');
chai.use(chaiAsPromised);
chai.use(chaiEnzyme());

const Module = require('module').Module;

var jsdom = require('jsdom');
const { JSDOM } = jsdom;
var dom = new JSDOM('<!doctype html><html><body></body></html>', {
    url: 'http://localhost',
});

var window = dom.window;
window.call = function() {};
window.URL = url.URL;

global.document = dom.window.document;
global.document.cookie = '';
global.window = window;

propagateToGlobal(window);

function propagateToGlobal(window) {
    for (let key in window) {
        if (!window.hasOwnProperty(key)) {
            continue;
        }

        if (key in global) {
            continue;
        }
        global[key] = window[key];
    }
}

const mockedModules = {
    '~config': 'test/noop.js',
};

const old = Module._resolveFilename;
Module._resolveFilename = function(moduleName) {
    return mockedModules[moduleName] || old.apply(this, arguments);
};
