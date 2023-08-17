import { HistoriskOppfolgingsperiode } from '../../../datatypes/oppfolgingTypes';
import { datoErIPeriode } from './filter-utils';

describe('datoErIPeriode', () => {
    it('Skal returnere true når det er ingen historiske perioder', () => {
        const dato = '';
        const valgtHistorisk = undefined;
        const sistePeriodeSlutt = undefined;
        const resultat = datoErIPeriode(dato, valgtHistorisk, sistePeriodeSlutt);

        expect(resultat).toBeTruthy();
    });

    it('Skal returnere true når dato er i periode', () => {
        const dato = '2020-01-24T12:00:00+00:00';
        const valgtHistorisk = {
            startDato: '2020-01-23T12:00:00+00:00',
            sluttDato: '2020-01-25T12:00:00+00:00',
        } as HistoriskOppfolgingsperiode;

        const sistePeriodeSlutt = undefined;
        const resultat = datoErIPeriode(dato, valgtHistorisk, sistePeriodeSlutt);

        expect(resultat).toBeTruthy();
    });

    it('Skal returnere true når dato er i periode - forskjellig tidssone', () => {
        const dato = '2020-01-24T12:00:00+00:00';
        const valgtHistorisk = {
            startDato: '2020-01-24T13:00:00+02:00', //11
            sluttDato: '2020-01-24T15:00:00+02:00', //13
        } as HistoriskOppfolgingsperiode;

        const sistePeriodeSlutt = undefined;
        const resultat = datoErIPeriode(dato, valgtHistorisk, sistePeriodeSlutt);

        expect(resultat).toBeTruthy();
    });

    it('Skal returnere false når dato ikke er i periode', () => {
        const dato = '2020-01-24T12:00:00+00:00';
        const valgtHistorisk = {
            startDato: '2020-01-25T12:00:00+00:00',
            sluttDato: '2020-01-26T12:00:00+00:00',
        } as HistoriskOppfolgingsperiode;

        const sistePeriodeSlutt = undefined;
        const resultat = datoErIPeriode(dato, valgtHistorisk, sistePeriodeSlutt);

        expect(resultat).toBeFalsy();
    });

    it('Skal returnere false når ikke dato er i periode - forskjellig tidssone', () => {
        const dato = '2020-01-24T14:00:00+02:00'; //12
        const valgtHistorisk = {
            startDato: '2020-01-24T13:00:00+00:00',
            sluttDato: '2020-01-24T15:00:00+00:00',
        } as HistoriskOppfolgingsperiode;

        const sistePeriodeSlutt = undefined;
        const resultat = datoErIPeriode(dato, valgtHistorisk, sistePeriodeSlutt);

        expect(resultat).toBeFalsy();
    });

    it('Skal returnere true når dato er lik historisk', () => {
        const dato = '2020-01-24T14:00:00+02:00';
        const valgtHistorisk = {
            startDato: '2020-01-24T14:00:00+02:00',
            sluttDato: '2020-01-24T14:00:00+02:00',
        } as HistoriskOppfolgingsperiode;

        const sistePeriodeSlutt = undefined;
        const resultat = datoErIPeriode(dato, valgtHistorisk, sistePeriodeSlutt);

        expect(resultat).toBeTruthy();
    });

    it('Skal returnere true når dato er i gjeldende oppfølgingsperiode når filter ikke er valgt', () => {
        //arenaaktiviteteter kan være opprettet etter sistePeriodeSluttDato men FØR gjeldende periode starter
        //derfor kan vi ikke skjekke på gjeldende periode fradato
        const dato = '2020-01-24T14:00:00+02:00';
        const valgtHistorisk = undefined;

        const sistePeriodeSlutt = '2020-01-23T14:00:00+02:00';
        const resultat = datoErIPeriode(dato, valgtHistorisk, sistePeriodeSlutt);

        expect(resultat).toBeTruthy();
    });

    it('Skal returnere true når dato er i gjeldende oppfølgingsperiode når filter ikke er valgt - forskjellig tidssone', () => {
        const dato = '2020-01-24T14:00:00+02:00';
        const valgtHistorisk = undefined;

        const sistePeriodeSlutt = '2020-01-23T14:00:00+02:00';
        const resultat = datoErIPeriode(dato, valgtHistorisk, sistePeriodeSlutt);

        expect(resultat).toBeTruthy();
    });
});
