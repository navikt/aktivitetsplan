const fasitUrl =
    'https://testbrukere.nais.preprod.local/testbrukere/api/miljo/';

export function getFasitUsers(miljo) {
    console.log('Henter testbrukere fra fasit...');
    return getUsersJson(miljo).then(usersJson => {
        return getCookies(usersJson);
    });
}

export function getUsersJson(miljo) {
    const https = require('https');
    const fetch = require('node-fetch');
    const agent = new https.Agent({
        rejectUnauthorized: false,
    });

    return new Promise((resolve, reject) => {
        fetch(fasitUrl + miljo, { agent })
            .then(fasitResponse => {
                resolve(fasitResponse.json());
            })
            .catch(e => {
                reject('Kunne ikke hente fasitbrukere: ' + e);
            });
    });
}

function getCookies(usersJson) {
    const brukerSBS = usersJson.eksternbrukere[0];
    const brukerFSS = usersJson.veiledere[0];

    const cookiesSBS = brukerSBS.cookies.map(cookie => {
        return createCookie(cookie, true);
    });
    const cookiesFSS = brukerFSS.cookies.map(cookie => {
        return createCookie(cookie, false);
    });

    return {
        FSS: { brukerNavn: brukerFSS.testuser.username, cookies: cookiesFSS },
        SBS: { brukerNavn: brukerSBS.testuser.username, cookies: cookiesSBS },
    };
}

export function setBrowserCookies(browser, testbrukere) {
    console.log('Setter browsercookies...');
    const veilederCookies = testbrukere.FSS.cookies;
    const brukerCookies = testbrukere.SBS.cookies;

    return new Promise((resolve, reject) => {
        if (brukerCookies.length !== 1)
            reject('Forventet en cookie for bruker');
        if (veilederCookies.length !== 2)
            reject('Forventet to cookies for veileder');

        browser
            .url(browser.globals.SBSUrl)
            .setCookie(brukerCookies[0])
            .url(browser.globals.FSSUrl)
            .setCookie(veilederCookies[0])
            .setCookie(veilederCookies[1], () => {
                resolve('Satte cookies');
            });
    });
}

function createCookie(cookie, ekstern) {
    return {
        name: cookie.name,
        value: cookie.value,
        domain: ekstern ? '.nav.no' : '.adeo.no',
        path: '/',
        secure: true,
        httpOnly: true,
        expiry: new Date(Date.now() + 10 * 60 * 1000),
    };
}
