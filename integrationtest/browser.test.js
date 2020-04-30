import { ClientFunction, Selector } from 'testcafe';
import uaParser from 'ua-parser-js';
import Startside from './startside-model';

import { getNetworkIp } from './getNetworkIp';

const getUA = ClientFunction(() => navigator.userAgent);

// eslint-disable-next-line no-undef
fixture`Browsertester`.before(async ctx => {
    ctx.ip = await getNetworkIp();
});

const startside = new Startside();
test('Validere startside', async t => {
    const browserName = uaParser(await getUA()).browser.name;
    await t
        .navigateTo(`http://${t.fixtureCtx.ip}:4502`)
        .expect(startside.side.exists)
        .ok()
        .expect(startside.btnMittMal.exists)
        .ok()
        .takeScreenshot(`${browserName}/forside.png`);
});
test('Åpne printmeny', async t => {
    const browserName = uaParser(await getUA()).browser.name;
    await t
        .navigateTo(`http://${t.fixtureCtx.ip}:4502`)
        .expect(startside.btnPrint.visible)
        .ok()
        .click(startside.btnPrint)
        .expect(Selector('.printmodal-body').visible)
        .ok()
        .expect(Selector('.printmodal-header__printknapp').visible)
        .ok()
        .takeScreenshot(`${browserName}/print.png`);
});
