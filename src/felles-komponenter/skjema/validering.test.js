import { pakrevd, maksLengde } from './validering';

describe('pakrevd', () => {
    it('skal gi feilmelding hvis feltet ikke har noen verdi', () => {
        expect(pakrevd('feilmeldingID')(null)).toBeDefined();
        expect(pakrevd('feilmeldingID')('harVerdi')).toEqual(undefined);
    });

    it('skal ignorere valideringen hvis hvisIkke metoden kicker inn', () => {
        expect(pakrevd('feilmeldingID').hvisIkke(() => true)(null)).toEqual(
            undefined
        );
        expect(pakrevd('feilmeldingID').hvisIkke(() => true)('verdi')).toEqual(
            undefined
        );
    });

    it('skal ikke ignorere valideringen hvis hvisIkke metoden ikke kicker inn', () => {
        expect(
            pakrevd('feilmeldingID').hvisIkke(() => false)(null)
        ).toBeDefined();
        expect(
            pakrevd('feilmeldingID').hvisIkke(() => false)('verdi')
        ).toEqual(undefined);
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
        ).toBeDefined();

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
        ).toEqual(undefined);
    });
});

describe('maksLengde', () => {
    it('skal gi feilmelding hvis feltet har større lengde enn maksLengde', () => {
        expect(maksLengde("Don't care", 0)('hahaha')).toBeDefined();
        expect(maksLengde("Don't care", 100)('hahaha')).toEqual(undefined);
    });

    it('skal ignorere valideringen hvis hvisIkke metoden kicker inn', () => {
        expect(
            maksLengde("Don't care", 0).hvisIkke(() => true)('hahaha')
        ).toEqual(undefined);
        expect(
            maksLengde("Don't care", 100).hvisIkke(() => true)('hahaha')
        ).toEqual(undefined);
    });
});
