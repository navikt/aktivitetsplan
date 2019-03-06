const nyAktivitet = require('../commands/ny-aktivitet.js');

module.exports = {
    url: function() {
        return this.api.globals.baseUrl + '/aktivitet/ny';
    },

    commands: [nyAktivitet],

    elements: {
        side: '//section[@class="ny-aktivitet-visning"]',
        btnStilling:
            '//a[substring(@href, string-length(@href) - 21 ) = "/aktivitet/ny/stilling"]',
        btnEgenaktivitet:
            '//a[substring(@href, string-length(@href) - 17 ) = "/aktivitet/ny/egen"]',
        btnJobb:
            '//a[substring(@href, string-length(@href) - 18 ) = "/aktivitet/ny/ijobb"]',
    },
    sections: {
        InternSection: {
            selector: '//section[@class="ny-aktivitet-visning"]',
            elements: {
                btnMote:
                    '//a[substring(@href, string-length(@href) - 17 ) = "/aktivitet/ny/mote"]',
                btnSokeAvtale:
                    '//a[substring(@href, string-length(@href) - 23 ) = "/aktivitet/ny/sokeavtale"]',
                btnBehandling:
                    '//a[substring(@href, string-length(@href) - 23 ) = "/aktivitet/ny/behandling"]',
                btnSamtale:
                    '//a[substring(@href, string-length(@href) - 27 ) = "/aktivitet/ny/samtalereferat"]',
            },
        },
    },
};
