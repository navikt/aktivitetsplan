'use strict';

require('babel-core/register');
require('core-js/shim');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const chaiEnzyme = require('chai-enzyme');
chai.use(chaiAsPromised);
chai.use(chaiEnzyme());

const Module = require('module').Module;

var jsdom = require('jsdom');
var document = jsdom.jsdom('<!doctype html><html><body></body></html>');
var window = document.defaultView;
window.call = function() {};

global.document = document;
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
    '~config': 'test/mock/config.js',
};

const old = Module._resolveFilename;
Module._resolveFilename = function(moduleName) {
    return mockedModules[moduleName] || old.apply(this, arguments);
};
