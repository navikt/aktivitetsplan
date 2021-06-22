import { mount, shallow } from 'enzyme';
import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { createStore } from 'redux';

import { MOTE_TYPE } from '../../../../constant';
import reducer from '../../../../reducer';
import MoteAktivitetForm, { defaultBeskrivelse } from './MoteAktivitetForm';

const initialState = {
    data: {
        oppfolging: { data: { underOppfolging: true } },
        aktiviteter: [],
    },
};

const dirtyRef = { current: false };
const store = createStore(reducer, initialState);

function mountWithIntl(node) {
    return mount(<ReduxProvider store={store}>{node}</ReduxProvider>);
}

describe('MoteAktivitetForm', () => {
    it('Skal vise error summary når man submitter uten å oppgi påkrevde verdier', () => {
        const wrapper = mountWithIntl(<MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} />);

        expect(wrapper.find('Feiloppsummering').length).toEqual(0);

        wrapper.simulate('submit');

        const error = wrapper.find('Feiloppsummering');

        expect(error.length).toEqual(1);
        expect(error.find('.lenke').length).toEqual(3);
    });
    it('Skal ikke vise feil når obligatoriske felter er oppgitt', () => {
        const aktivitet = {
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            type: MOTE_TYPE,
            adresse: 'Slottet',
            kanal: 'OPPMOTE',
            beskrivelse: 'jfioew',
            forberedelser: 'jfioewjfe',
            erAvtalt: false,
        };
        const wrapper = mountWithIntl(
            <MoteAktivitetForm
                onSubmit={() => new Promise(() => null)}
                isDirtyRef={dirtyRef}
                aktivitet={aktivitet}
                endre
            />
        );

        wrapper.simulate('submit');
        expect(wrapper.find('Feiloppsummering').length).toEqual(0);
    });
    it('Skal populere felter når aktivitet er satt', () => {
        const aktivitet = {
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            type: MOTE_TYPE,
            adresse: 'Slottet',
        };
        const wrapper = shallow(
            <MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} aktivitet={aktivitet} />
        );

        expect(wrapper.find('Input[label="Tema for møtet *"]').prop('initialValue')).toEqual(aktivitet.tittel);
        expect(wrapper.find('DatovelgerWrapper').prop('initialValue')).toEqual(aktivitet.fraDato);
        expect(wrapper.find('Input[label="Klokkeslett *"]').prop('initialValue')).toEqual('07:00');
        expect(wrapper.find('Input[label="Varighet *"]').prop('initialValue')).toEqual('01:00');
        expect(wrapper.find('Input[label="Møtested eller annen praktisk informasjon *"]').prop('initialValue')).toEqual(
            aktivitet.adresse
        );
    });

    it('Skal populere beskrivelse(hensikt) med defaultverdi', () => {
        const aktivitet = undefined;
        const wrapper = shallow(
            <MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} aktivitet={aktivitet} endre={false} />
        );

        expect(wrapper.find('Textarea[label="Hensikt med møtet *"]').prop('initialValue')).toEqual(defaultBeskrivelse);
    });

    it('Skal ikke populere beskrivelse(hensikt) med defaultverdi når man endrer', () => {
        const aktivitet = undefined;
        const wrapper = shallow(
            <MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} aktivitet={aktivitet} endre />
        );

        expect(wrapper.find('Textarea[label="Hensikt med møtet *"]').prop('initialValue')).toEqual('');
    });

    it('Skal være disablede felter ved endring av aktivitet', () => {
        const aktivitet = {
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            adresse: 'Slottet',
            type: MOTE_TYPE,
            avtalt: true,
        };
        const wrapper = shallow(
            <MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} aktivitet={aktivitet} endre />
        );
        expect(wrapper.find('Input[label="Tema for møtet *"]').prop('disabled')).toBeTruthy();
        expect(wrapper.find('DatovelgerWrapper').prop('disabled')).not.toBeTruthy();
        expect(wrapper.find('Input[label="Klokkeslett *"]').prop('disabled')).not.toBeTruthy();
        expect(wrapper.find('Input[label="Varighet *"]').prop('disabled')).not.toBeTruthy();
        expect(wrapper.find('VelgKanal').prop('disabled')).toBeFalsy();
        expect(
            wrapper.find('Input[label="Møtested eller annen praktisk informasjon *"]').prop('disabled')
        ).not.toBeTruthy();
        expect(wrapper.find('Textarea[label="Hensikt med møtet *"]').prop('disabled')).toBeTruthy();
        expect(wrapper.find('Textarea[label="Forberedelser til møtet"]').prop('disabled')).toBeTruthy();
    });
});
