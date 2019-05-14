'use strict';

const os = require('os');
const ifaces = os.networkInterfaces();

exports.getNetworkIp = function () {
    return new Promise((resolve, reject) => {
        let ips;
        Object.keys(ifaces).forEach(function(ifname) {
            ips = ifaces[ifname].filter(
                i => i.family === 'IPv4' && i.internal === false
            );
            if (ips.length === 1) resolve(ips[0].address);
        });
        reject('Fant ikke ip');
    });
};
