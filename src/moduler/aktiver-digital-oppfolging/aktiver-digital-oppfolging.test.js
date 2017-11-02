/* eslint-env mocha */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { expect } from 'chai';
import { BrowserRouter } from 'react-router-dom';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import {
    shallowWithIntl,
    mountWithIntl,
} from '../../../test/intl-enzyme-test-helper';
import {
    AktiverDigitalOppfolgingPure,
} from './aktiver-digital-oppfolging';
import AktiverDigitalOppfolgingVarsel from './aktiver-digital-oppfolging-varsel'

import { AdvarselVarsling } from '../varslinger/varsel-alertstriper';

describe('aktiver-digital-oppfolging', () => {
    describe('komponent', () => {
        it('Skal vise et varsel og knapp', () => {
            const wrapper = shallowWithIntl(
                <AktiverDigitalOppfolgingPure
                    reservertIKRR={false}
                    settDigitalFeilet={false}
                />
            );

            expect(wrapper).to.have.descendants(AktiverDigitalOppfolgingVarsel);
        });
    });

    describe('varsel', () => {
        it('Skal vise enkel varsling når bruker ikke er reservert i KRR', () => {
            const wrapper = shallowWithIntl(
                <AktiverDigitalOppfolgingVarsel
                    reservertIKRR={false}
                    settDigitalFeilet={false}
                />
            );

            expect(wrapper).to.have.descendants(AlertStripeInfoSolid);
        });

        it('Skal vise varsling med lenke når bruker er reservert i KRR', () => {
            const wrapper = mountWithIntl(
                <BrowserRouter>
                    <AktiverDigitalOppfolgingVarsel
                        reservertIKRR
                        settDigitalFeilet={false}
                    />
                </BrowserRouter>
            );

            expect(wrapper).to.have.descendants(AlertStripeInfoSolid);
        });

        it('Skal vise advarsel hvis sett digital feiler', () => {
            const wrapper = mountWithIntl(
                <AktiverDigitalOppfolgingVarsel
                    reservertIKRR
                    settDigitalFeilet
                />
            );

            expect(wrapper).to.have.descendants(AdvarselVarsling);
        });
    });
});
