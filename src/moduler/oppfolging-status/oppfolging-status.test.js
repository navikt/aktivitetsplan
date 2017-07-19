/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { shallow } from 'enzyme';
import {
    GodkjennVilkarMedVarsling,
    Alert,
    oppfolgingStatusKomponent,
} from './oppfolging-status';
import AktiverDigitalOppfolging from '../aktiver-digital-oppfolging/aktiver-digital-oppfolging';

function TestKomponent() {
    return <div />;
}

describe('oppfolging-status', () => {
    describe('godkjenn vilkar med varsling', () => {
        it('Skal vise alert når vilkar ikke skal vises og bruker har avslatt vilkar', () => {
            const wrapper = shallow(
                <GodkjennVilkarMedVarsling visVilkar={false} brukerHarAvslatt />
            );

            expect(wrapper).to.have.descendants(Alert);
        });
    });

    describe('oppfolgingStatusKomponent', () => {
        it('Skal vise children når bruker er veileder', () => {
            const Komp = () =>
                oppfolgingStatusKomponent({
                    children: <TestKomponent />,
                    erVeileder: true,
                });
            const wrapper = shallow(<Komp />);

            expect(wrapper).to.contain(<TestKomponent />);
        });
        it('Skal vise aktiver digital oppfolging når bruker er manuell', () => {
            const Komp = () =>
                oppfolgingStatusKomponent({
                    children: <TestKomponent />,
                    manuell: true,
                });
            const wrapper = shallow(<Komp />);

            expect(wrapper).to.contain(<AktiverDigitalOppfolging />);
        });
        it('Skal vise godkjenn vilkar med varsling hvis viklar må besvares', () => {
            const Komp = () =>
                oppfolgingStatusKomponent({
                    children: <TestKomponent />,
                    vilkarMaBesvares: true,
                });
            const wrapper = shallow(<Komp />);

            expect(wrapper).to.have.descendants(GodkjennVilkarMedVarsling);
        });
        it('Skal vise children hvis ikke noe av det over', () => {
            const Komp1 = () =>
                oppfolgingStatusKomponent({
                    children: <TestKomponent />,
                    brukerHarAvslatt: true,
                });
            const Komp2 = () =>
                oppfolgingStatusKomponent({
                    children: <TestKomponent />,
                    visVilkar: true,
                });
            const Komp3 = () =>
                oppfolgingStatusKomponent({
                    children: <TestKomponent />,
                });

            const wrapper1 = shallow(<Komp1 />);
            const wrapper2 = shallow(<Komp2 />);
            const wrapper3 = shallow(<Komp3 />);

            expect(wrapper1).to.contain(<TestKomponent />);
            expect(wrapper2).to.contain(<TestKomponent />);
            expect(wrapper3).to.contain(<TestKomponent />);
        });
    });
});
