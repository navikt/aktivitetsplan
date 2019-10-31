import React from 'react';
import { shallow } from 'enzyme';
import { DialogerPure } from './dialoger';

const dialogerEskalering = [
    {
        // venter på nav
        id: '1',
        overskrift: '',
        venterPaSvar: false,
        ferdigBehandlet: false,
        henvendelser: []
    },
    {
        // venter på nav
        id: '2',
        overskrift: '',
        venterPaSvar: false,
        ferdigBehandlet: false,
        egenskaper: ['ESKALERINGSVARSEL'],
        henvendelser: []
    }
];

const dialogerVenterPaNoen = [
    {
        // venter på bruker
        id: '1',
        overskrift: '',
        venterPaSvar: true,
        ferdigBehandlet: true,
        henvendelser: []
    },
    {
        // venter på nav
        id: '2',
        overskrift: '',
        venterPaSvar: false,
        ferdigBehandlet: false,
        henvendelser: []
    },
    {
        // venter på begge
        id: '3',
        overskrift: '',
        sisteDato: '2017-07-01T14:09:59.334+02:00',
        venterPaSvar: true,
        ferdigBehandlet: false,
        henvendelser: []
    }
];

const gjeldendeVarsel = {
    tilhorendeDialogId: 2
};

describe('<Dialoger/>', () => {
    it('Veileder skal se gjeldende eskaleringsvarsel øverst', () => {
        const wrapper = shallow(
            <DialogerPure
                dialoger={dialogerEskalering}
                aktiviteter={[]}
                erBruker={false}
                gjeldendeEskaleringsvarsel={gjeldendeVarsel}
                history={{
                    goBack: () => null,
                    push: () => null,
                    replace: () => null
                }}
            />
        );
        const dialogerSortert = wrapper.instance().dialogIderSortert;

        expect(dialogerSortert).toEqual(['2', '1']);
    });

    it('Bruker skal se gjeldende eskaleringsvarsel øverst', () => {
        const wrapper = shallow(
            <DialogerPure
                dialoger={dialogerEskalering}
                aktiviteter={[]}
                erBruker
                gjeldendeEskaleringsvarsel={gjeldendeVarsel}
                history={{
                    goBack: () => null,
                    push: () => null,
                    replace: () => null
                }}
            />
        );
        const dialogerSortert = wrapper.instance().dialogIderSortert;

        expect(dialogerSortert).toEqual(['2', '1']);
    });

    it('Bruker skal se sortering etter dato hvis eskalering ikke er gjeldende', () => {
        const wrapper = shallow(
            <DialogerPure
                dialoger={dialogerEskalering}
                aktiviteter={[]}
                erBruker
                gjeldendeEskaleringsvarsel={null}
                history={{
                    goBack: () => null,
                    push: () => null,
                    replace: () => null
                }}
            />
        );
        const dialogerSortert = wrapper.instance().dialogIderSortert;

        expect(dialogerSortert).toEqual(['1', '2']);
    });

    it('Veileder skal se sortering etter dato hvis eskalering ikke er gjeldende', () => {
        const wrapper = shallow(
            <DialogerPure
                dialoger={dialogerEskalering}
                aktiviteter={[]}
                erBruker={false}
                gjeldendeEskaleringsvarsel={null}
                history={{
                    goBack: () => null,
                    push: () => null,
                    replace: () => null
                }}
            />
        );
        const dialogerSortert = wrapper.instance().dialogIderSortert;

        expect(dialogerSortert).toEqual(['1', '2']);
    });

    it('Bruker skal se dialoger som venter på begge først og så de som venter på bruker', () => {
        const wrapper = shallow(
            <DialogerPure
                dialoger={dialogerVenterPaNoen}
                aktiviteter={[]}
                erBruker
                gjeldendeEskaleringsvarsel={null}
                history={{
                    goBack: () => null,
                    push: () => null,
                    replace: () => null
                }}
            />
        );
        const dialogerSortert = wrapper.instance().dialogIderSortert;

        expect(dialogerSortert).toEqual(['3', '1', '2']);
    });

    it('Veileder skal se dialoger som venter på begge først og så ikke ferdigbehandlede ', () => {
        const wrapper = shallow(
            <DialogerPure
                dialoger={dialogerVenterPaNoen}
                aktiviteter={[]}
                erBruker={false}
                gjeldendeEskaleringsvarsel={null}
                history={{
                    goBack: () => null,
                    push: () => null,
                    replace: () => null
                }}
            />
        );
        const dialogerSortert = wrapper.instance().dialogIderSortert;

        expect(dialogerSortert).toEqual(['3', '2', '1']);
    });
});
