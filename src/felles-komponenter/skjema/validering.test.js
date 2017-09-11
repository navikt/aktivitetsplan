/* eslint-env mocha */
import { expect } from 'chai';
import { pakrevd, maksLengde } from './validering';

describe('pakrevd', () => {
    it('skal gi feilmelding hvis feltet ikke har noen verdi', () => {
        expect(pakrevd('feilmeldingID')(null)).to.not.equal(undefined);
        expect(pakrevd('feilmeldingID')('harVerdi')).to.equal(undefined);
    });

    it('skal ignorere valideringen hvis hvisIkke metoden kicker inn', () => {
        expect(pakrevd('feilmeldingID').hvisIkke(() => true)(null)).to.equal(
            undefined
        );
        expect(pakrevd('feilmeldingID').hvisIkke(() => true)('verdi')).to.equal(
            undefined
        );
    });

    it('skal ikke ignorere valideringen hvis hvisIkke metoden ikke kicker inn', () => {
        expect(
            pakrevd('feilmeldingID').hvisIkke(() => false)(null)
        ).to.not.equal(undefined);
        expect(
            pakrevd('feilmeldingID').hvisIkke(() => false)('verdi')
        ).to.equal(undefined);
    });

    it('skal kunne chaine flere hvis ikke valideringen', () => {
        expect(
            pakrevd('feilmeldingID')
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)(null)
        ).to.not.equal(undefined);

        expect(
            pakrevd('feilmeldingID')
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => false)
                .hvisIkke(() => true)(null)
        ).to.equal(undefined);
    });
});

describe('maksLengde', () => {
    it('skal gi feilmelding hvis feltet har større lengde enn maksLengde', () => {
        expect(maksLengde("Don't care", 0)('hahaha')).to.not.equal(undefined);
        expect(maksLengde("Don't care", 100)('hahaha')).to.equal(undefined);
    });

    it('skal ignorere valideringen hvis hvisIkke metoden kicker inn', () => {
        expect(
            maksLengde("Don't care", 0).hvisIkke(() => true)('hahaha')
        ).to.equal(undefined);
        expect(
            maksLengde("Don't care", 100).hvisIkke(() => true)('hahaha')
        ).to.equal(undefined);
    });
});
