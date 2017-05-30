/* eslint-env browser */
import 'whatwg-fetch';
import 'core-js/shim';

if (!global.Intl) {
    require('intl'); // eslint-disable-line global-require
    require('intl/locale-data/jsonp/nb-NO.js'); // eslint-disable-line global-require
}

// Vår egen polyfill for console
(function consolepolyfill(con = {}) {
    if (con) {
        return;
    }

    const empty = {};
    const dummy = function dummy() {};
    const properties = 'memory'.split(',');
    const methods = ('assert,clear,count,debug,dir,dirxml,error,exception,group,' +
        'groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,' +
        'show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn').split(
        ','
    );
    properties.forEach(prop => {
        con[prop] = empty; // eslint-disable-line no-param-reassign
    });
    methods.forEach(method => {
        con[method] = dummy; // eslint-disable-line no-param-reassign
    });
    window.console = con;
})(window.console);
