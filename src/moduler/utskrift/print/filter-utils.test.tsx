import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../datatypes/dialogTypes';
import { EgenAktivitet, VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { KvpPeriode } from '../../../datatypes/oppfolgingTypes';
import { FellesTransaksjonsTyper } from '../../../datatypes/transaksjonstyperTypes';
import { filtrerAktiviteter, filtrerDialoger } from './filter-utils';

const kvpPeriode: KvpPeriode = {
    opprettetDato: '2019-07-01T10:41:50.761983+02:00',
    avsluttetDato: '2019-07-29T10:41:50.761983+02:00',
};

const aktivitetIKvp: EgenAktivitet = {
    type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
    avtalt: false,
    historisk: false,
    lagtInnAv: 'BRUKER',
    tittel: '',
    transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
    versjon: '1',
    id: 'aktivitetIKvp',
    opprettetDato: '2019-07-01T11:41:50.761983+02:00',
    status: 'GJENNOMFORES',
    endretAv: '',
};

const aktivitetIKvpUTC0: EgenAktivitet = {
    type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
    avtalt: false,
    historisk: false,
    lagtInnAv: 'BRUKER',
    tittel: '',
    transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
    versjon: '1',
    id: 'aktivitetIKvpUTC0',
    opprettetDato: '2019-07-01T09:41:50.206+00:00',
    status: 'GJENNOMFORES',
    endretAv: '',
};
const aktivitetForKvp: EgenAktivitet = {
    type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
    avtalt: false,
    historisk: false,
    lagtInnAv: 'BRUKER',
    tittel: '',
    transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
    versjon: '1',
    id: 'aktivitetForKvp',
    opprettetDato: '2019-07-01T09:41:50.761983+02:00',
    status: 'GJENNOMFORES',
    endretAv: '',
};
const aktivitetEtterKvp: EgenAktivitet = {
    type: VeilarbAktivitetType.EGEN_AKTIVITET_TYPE,
    avtalt: false,
    historisk: false,
    lagtInnAv: 'BRUKER',
    tittel: '',
    transaksjonsType: FellesTransaksjonsTyper.OPPRETTET,
    versjon: '1',
    id: 'aktivitetEtterKvp',
    opprettetDato: '2019-07-29T11:41:50.761983+02:00',
    status: 'GJENNOMFORES',
    endretAv: '',
};

const dialogForKvp: Dialog = {
    id: 'dialogForKvp',
    overskrift: 'overskrift',
    sisteDato: '2019-07-01T09:41:50.761983+02:00',
    opprettetDato: '2019-07-01T09:41:50.761983+02:00',
};

const dialogIKvp: Dialog = {
    id: 'dialogIKvp',
    overskrift: 'overskrift',
    sisteDato: '2019-07-01T11:41:50.761983+02:00',
    opprettetDato: '2019-07-01T11:41:50.761983+02:00',
};
const dialogIKvpUTC0: Dialog = {
    id: 'dialogIKvpUTC0',
    overskrift: 'overskrift',
    sisteDato: '2019-07-01T09:41:50.206+00:00',
    opprettetDato: '2019-07-01T09:41:50.206+00:00',
};

const dialogEtterKvp: Dialog = {
    id: 'dialogEtterKvp',
    overskrift: 'overskrift',
    sisteDato: '2019-07-29T11:41:50.761983+02:00',
    opprettetDato: '2019-07-29T11:41:50.761983+02:00',
};

describe('filtrerAktiviteter', () => {
    it('Skal returnere aktiviteter i KVP-perioden', () => {
        const aktiviteter: AlleAktiviteter[] = [aktivitetIKvp];
        const resultat = filtrerAktiviteter(undefined, undefined, kvpPeriode, aktiviteter);
        expect(resultat).toHaveLength(1);
    });

    it('Skal ikke returnere aktiviteter før KVP-perioden', () => {
        const aktiviteter: AlleAktiviteter[] = [aktivitetForKvp];
        const resultat = filtrerAktiviteter(undefined, undefined, kvpPeriode, aktiviteter);
        expect(resultat).toHaveLength(0);
    });

    it('Skal ikke returnere aktiviteter etter KVP-perioden', () => {
        const aktiviteter: AlleAktiviteter[] = [aktivitetEtterKvp];
        const resultat = filtrerAktiviteter(undefined, undefined, kvpPeriode, aktiviteter);
        expect(resultat).toHaveLength(0);
    });

    it('Skal returnere aktiviteter i KVP-perioden utc 00', () => {
        const aktiviteter: AlleAktiviteter[] = [aktivitetIKvpUTC0];
        const resultat = filtrerAktiviteter(undefined, undefined, kvpPeriode, aktiviteter);
        expect(resultat).toHaveLength(1);
    });

    it('Skal returnere aktiviteter utenfor KVP-perioden', () => {
        const aktiviteter: AlleAktiviteter[] = [aktivitetForKvp, aktivitetIKvp, aktivitetIKvpUTC0, aktivitetEtterKvp];
        const kvpPerioder = [kvpPeriode];
        const resultat = filtrerAktiviteter('aktivitetsplan', kvpPerioder, undefined, aktiviteter);
        const riktigeaktiviteter = resultat?.filter(
            (d) => d.id === aktivitetForKvp.id || d.id === aktivitetEtterKvp.id
        );

        expect(resultat).toHaveLength(2);
        expect(riktigeaktiviteter).toHaveLength(2);
    });
});

describe('filtrerDialoger', () => {
    it('Skal returnere dialoger i KVP-perioden', () => {
        const dialoger: Dialog[] = [dialogIKvp];

        const resultat = filtrerDialoger('helePlanen', undefined, kvpPeriode, dialoger);
        expect(resultat).toHaveLength(1);
    });

    it('Skal ikke returnere dialoger før KVP-perioden', () => {
        const dialoger: Dialog[] = [dialogForKvp];
        const resultat = filtrerDialoger('helePlanen', undefined, kvpPeriode, dialoger);
        expect(resultat).toHaveLength(0);
    });

    it('Skal ikke returnere dialoger etter KVP-perioden', () => {
        const dialoger: Dialog[] = [dialogEtterKvp];
        const resultat = filtrerDialoger('helePlanen', undefined, kvpPeriode, dialoger);
        expect(resultat).toHaveLength(0);
    });

    it('Skal returnere dialoger i KVP-perioden utc 00', () => {
        const dialoger: Dialog[] = [dialogIKvpUTC0];
        const resultat = filtrerDialoger('helePlanen', undefined, kvpPeriode, dialoger);
        expect(resultat).toHaveLength(1);
    });

    it('Skal returnere dialoger utenfor KVP-perioden', () => {
        const dialoger: Dialog[] = [dialogForKvp, dialogIKvpUTC0, dialogIKvp, dialogEtterKvp];
        const kvpPerioder = [kvpPeriode];
        const resultat = filtrerDialoger('aktivitetsplan', kvpPerioder, undefined, dialoger);
        const riktigeDialoger = resultat?.filter((d) => d.id === dialogForKvp.id || d.id === dialogEtterKvp.id);

        expect(resultat).toHaveLength(2);
        expect(riktigeDialoger).toHaveLength(2);
    });
});
