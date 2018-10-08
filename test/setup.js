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
const dom = new JSDOM('<!doctype html><html><body></body></html>');
var window = dom.window;

global.document = window.document;
global.document.cookie = '';
global.window = window;
global.URL = url.URL;

window.aktivitetsplan = {
    veilarbdialog_url: 'http://localhost:8080/veilarbdialog/api',
    veilarbaktivitet_url: 'http://localhost:8080/veilarbaktivitet/api',
    veilarboppfolging_url: 'http://localhost:8080/veilarboppfolging/api',
    veilarboppgave_url: 'http://localhost:8080/veilarboppgave/api',
    veilarbperson_url: 'http://localhost:8080/veilarbperson/api',
    veilarbportefolje_url: 'http://localhost:8080/veilarbportefolje/api',
    veilarbveileder_url: 'http://localhost:8080/veilarbveileder/api',
    veilarbmalverk_url: 'http://localhost:8080/veilarbmalverk/api',
    feature_endpoint_url: 'https://feature-t6.nais.preprod.local/feature',
    onboarding_video_url:
        'https://publisher.qbrick.com/Embed.aspx?mcid=C1F23FB93342C49E',
    sone: 'FSS',
};

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
