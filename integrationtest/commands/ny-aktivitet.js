const { AktivitetsType } = require('../data/aktivitet-type');

module.exports = {
    velgAktivitetsType(navn, nesteSide) {
        const pageItems = this.elements;
        const internPageItems = this.section.InternSection.elements;
        let timeout = this.api.globals.timeout;
        switch (navn) {
            case AktivitetsType.STILLING:
                this.click(pageItems.btnStilling.selector);
                break;
            case AktivitetsType.EGENAKTIVITET:
                this.click(pageItems.btnEgenaktivitet.selector);
                break;
            case AktivitetsType.JOBBJEGHAR:
                this.click(pageItems.btnJobb.selector);
                break;
            case AktivitetsType.MOTE:
                this.click(internPageItems.btnMote.selector);
                break;
            case AktivitetsType.AVTALE:
                this.click(internPageItems.btnSokeAvtale.selector);
                break;
            case AktivitetsType.MEDISINSKBEHANDLING:
                this.click(internPageItems.btnBehandling.selector);
                break;
            case AktivitetsType.SAMTALEREFERAT:
                this.click(internPageItems.btnSamtale.selector);
                break;
            default:
                return undefined;
        }

        this.waitForElementVisible(nesteSide.elements.side.selector, timeout);
        return nesteSide;
    },
};
