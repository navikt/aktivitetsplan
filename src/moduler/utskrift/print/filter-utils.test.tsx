import { Aktivitet } from '../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../datatypes/dialogTypes';
import { KvpPeriode } from '../../../datatypes/oppfolgingTypes';
import { filtrerAktiviteter, filtrerDialoger } from './filter-utils';

const kvpPeriode: KvpPeriode = {
    opprettetDato: '2019-07-01T10:41:50.761983+02:00',
    avsluttetDato: '2019-07-29T10:41:50.761983+02:00',
};

const aktivitetIKvp: Aktivitet = {
    id: 'aktivitetIKvp',
    opprettetDato: '2019-07-01T11:41:50.761983+02:00',
    status: 'GJENNOMFORES',
    type: 'EGEN',
    endretAv: '',
};

const aktivitetIKvpUTC0: Aktivitet = {
    id: 'aktivitetIKvpUTC0',
    opprettetDato: '2019-07-01T09:41:50.206+00:00',
    status: 'GJENNOMFORES',
    type: 'EGEN',
    endretAv: '',
};
const aktivitetForKvp: Aktivitet = {
    id: 'aktivitetForKvp',
    opprettetDato: '2019-07-01T09:41:50.761983+02:00',
    status: 'GJENNOMFORES',
    type: 'EGEN',
    endretAv: '',
};
const aktivitetEtterKvp: Aktivitet = {
    id: 'aktivitetEtterKvp',
    opprettetDato: '2019-07-29T11:41:50.761983+02:00',
    status: 'GJENNOMFORES',
    type: 'EGEN',
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
        const aktiviteter: Aktivitet[] = [aktivitetIKvp];
        const resultat = filtrerAktiviteter(undefined, undefined, kvpPeriode, aktiviteter);
        expect(resultat).toHaveLength(1);
    });

    it('Skal ikke returnere aktiviteter før KVP-perioden', () => {
        const aktiviteter: Aktivitet[] = [aktivitetForKvp];
        const resultat = filtrerAktiviteter(undefined, undefined, kvpPeriode, aktiviteter);
        expect(resultat).toHaveLength(0);
    });

    it('Skal ikke returnere aktiviteter etter KVP-perioden', () => {
        const aktiviteter: Aktivitet[] = [aktivitetEtterKvp];
        const resultat = filtrerAktiviteter(undefined, undefined, kvpPeriode, aktiviteter);
        expect(resultat).toHaveLength(0);
    });

    it('Skal returnere aktiviteter i KVP-perioden utc 00', () => {
        const aktiviteter: Aktivitet[] = [aktivitetIKvpUTC0];
        const resultat = filtrerAktiviteter(undefined, undefined, kvpPeriode, aktiviteter);
        expect(resultat).toHaveLength(1);
    });

    it('Skal returnere aktiviteter utenfor KVP-perioden', () => {
        const aktiviteter: Aktivitet[] = [aktivitetForKvp, aktivitetIKvp, aktivitetIKvpUTC0, aktivitetEtterKvp];
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
