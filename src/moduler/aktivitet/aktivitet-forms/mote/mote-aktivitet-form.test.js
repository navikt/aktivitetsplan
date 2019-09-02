import React from 'react';
import { IntlProvider } from 'react-intl';
import { mount, shallow } from 'enzyme';
import { Provider as ReduxProvider } from 'react-redux';
import configureStore from 'redux-mock-store';
import MoteAktivitetForm, { defaultBeskrivelse } from './mote-aktivitet-form';
import { STATUS } from '../../../../ducks/utils';

const initialState = {
    data: {
        identitet: { data: { erVeileder: false }, status: STATUS.OK },
        oppfolging: { data: { underOppfolging: true } },
        status: STATUS.OK,
        aktiviteter: [],
    },
};

const mockStore = configureStore();
const store = mockStore(initialState);

function mountWithIntl(node) {
    return mount(
        <ReduxProvider store={store}>
            <IntlProvider defaultLocale="nb" locale="nb" messages={{}}>
                {node}
            </IntlProvider>
        </ReduxProvider>
    );
}

describe('MoteAktivitetForm', () => {
    it('Skal vise error summary når man submitter uten å oppgi påkrevde verdier', () => {
        const dirtyRef = { current: false };
        const wrapper = mountWithIntl(
            <MoteAktivitetForm onSubmit={() => null} isDirtyRef={dirtyRef} />
        );

        expect(wrapper.find('Error').length).toEqual(0);

        wrapper.simulate('submit');

        const error = wrapper.find('Error');

        expect(error.length).toEqual(5);
        expect(error.find('[href="#tittel"]').length).toEqual(1);
        expect(error.find('[href="#dato"]').length).toEqual(1);
        expect(error.find('[href="#klokkeslett"]').length).toEqual(1);
        expect(error.find('[href="#varighet"]').length).toEqual(1);
        expect(error.find('[href="#adresse"]').length).toEqual(1);
    });

    it('Skal ikke vise feil når obligatoriske felter er oppgitt', () => {
        const dirtyRef = { current: false };
        const aktivitet = {
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
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
        expect(wrapper.find('Error').length).toEqual(0);
    });

    it('Skal populere felter når aktivitet er satt', () => {
        const dirtyRef = { current: false };
        const aktivitet = {
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            adresse: 'Slottet',
        };
        const wrapper = shallow(
            <MoteAktivitetForm
                onSubmit={() => null}
                isDirtyRef={dirtyRef}
                aktivitet={aktivitet}
            />
        );

        expect(
            wrapper.find('Input[label="Tema for møtet *"]').prop('initialValue')
        ).toEqual(aktivitet.tittel);
        expect(wrapper.find('DatoField').prop('initialValue')).toEqual(
            aktivitet.fraDato
        );
        expect(
            wrapper.find('Select[label="Klokkeslett *"]').prop('initialValue')
        ).toEqual('420');
        expect(
            wrapper.find('Select[label="Varighet *"]').prop('initialValue')
        ).toEqual('60');
        expect(
            wrapper
                .find(
                    'Input[label="Møtested eller annen praktisk informasjon *"]'
                )
                .prop('initialValue')
        ).toEqual(aktivitet.adresse);
    });

    it('Skal populere beskrivelse(hensikt) med defaultverdi', () => {
        const dirtyRef = { current: false };
        const aktivitet = undefined;

        const wrapper = shallow(
            <MoteAktivitetForm
                onSubmit={() => null}
                isDirtyRef={dirtyRef}
                aktivitet={aktivitet}
                endre={false}
            />
        );

        expect(
            wrapper
                .find('Textarea[label="Hensikt med møtet"]')
                .prop('initialValue')
        ).toEqual(defaultBeskrivelse);
    });

    it('Skal ikke populere beskrivelse(hensikt) med defaultverdi når man endrer', () => {
        const dirtyRef = { current: false };
        const aktivitet = undefined;
        const wrapper = shallow(
            <MoteAktivitetForm
                onSubmit={() => null}
                isDirtyRef={dirtyRef}
                aktivitet={aktivitet}
                endre
            />
        );

        expect(
            wrapper
                .find('Textarea[label="Hensikt med møtet"]')
                .prop('initialValue')
        ).toEqual('');
    });

    it('Skal være disablede felter ved endring av aktivitet', () => {
        const dirtyRef = { current: false };
        const aktivitet = {
            tittel: 'Dette er en test',
            opprettetDato: '2019-08-31T05:00:00.000Z',
            fraDato: '2019-08-31T05:00:00.000Z',
            tilDato: '2019-08-31T06:00:00.000Z',
            adresse: 'Slottet',
            avtalt: true,
        };

        const wrapper = shallow(
            <MoteAktivitetForm
                onSubmit={() => null}
                isDirtyRef={dirtyRef}
                aktivitet={aktivitet}
                endre
            />
        );

        expect(
            wrapper.find('Input[label="Tema for møtet *"]').prop('disabled')
        ).toBeTruthy();
        expect(wrapper.find('DatoField').prop('disabled')).not.toBeTruthy();
        expect(
            wrapper.find('Select[label="Klokkeslett *"]').prop('disabled')
        ).not.toBeTruthy();
        expect(
            wrapper.find('Select[label="Varighet *"]').prop('disabled')
        ).not.toBeTruthy();
        expect(wrapper.find('VelgKanal').prop('disabled')).toBeTruthy();
        expect(
            wrapper
                .find(
                    'Input[label="Møtested eller annen praktisk informasjon *"]'
                )
                .prop('disabled')
        ).not.toBeTruthy();
        expect(
            wrapper.find('Textarea[label="Hensikt med møtet"]').prop('disabled')
        ).toBeTruthy();
        expect(
            wrapper
                .find('Textarea[label="Forberedelser til møtet"]')
                .prop('disabled')
        ).toBeTruthy();
    });
});
