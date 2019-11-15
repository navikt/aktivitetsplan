import React from 'react';
import PT from 'prop-types';
import { Sidetittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import AktivitetIngress from '../aktivitetingress/aktivitetingress';
import Aktivitetsdetaljer from './aktivitetsdetaljer';
import * as AppPT from '../../../../proptypes';
import {
    BEHANDLING_AKTIVITET_TYPE,
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE
} from '../../../../constant';
import InternLenke from '../../../../felles-komponenter/utils/internLenke';
import loggEvent, { APNE_ENDRE_AKTIVITET } from '../../../../felles-komponenter/utils/logging';
import { endreAktivitetRoute } from '../../../../routes';
import DeleLinje from '../delelinje/delelinje';
import AvtaltMarkering from '../../avtalt-markering/avtalt-markering';

function visningsIngress(type) {
    if (
        [EGEN_AKTIVITET_TYPE, IJOBB_AKTIVITET_TYPE, STILLING_AKTIVITET_TYPE, BEHANDLING_AKTIVITET_TYPE].includes(type)
    ) {
        return null;
    }

    return <AktivitetIngress aktivitetsType={type} />;
}

function AktivitetinformasjonVisning({ valgtAktivitet, tillatEndring, laster, underOppfolging }) {
    const { tittel, type, arenaAktivitet } = valgtAktivitet;

    return (
        <div>
            <div className="aktivitetvisning__underseksjon">
                <div className="aktivitetvisning__header">
                    <Sidetittel id="modal-aktivitetsvisning-header" className="softbreak">
                        {tittel}
                    </Sidetittel>
                    <InternLenke
                        className="endreknapp"
                        role="button"
                        hidden={!tillatEndring || arenaAktivitet}
                        href={endreAktivitetRoute(valgtAktivitet.id)}
                        onClick={() => loggEvent(APNE_ENDRE_AKTIVITET)}
                        disabled={laster || !underOppfolging}
                    >
                        <FormattedMessage id="aktivitetvisning.endre-knapp" />
                    </InternLenke>
                </div>
                {visningsIngress(type)}
                <AvtaltMarkering visible={valgtAktivitet.avtalt} className="aktivitetvisning__etikett" />
                <Aktivitetsdetaljer valgtAktivitet={valgtAktivitet} />
            </div>
            <DeleLinje />
        </div>
    );
}

AktivitetinformasjonVisning.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    tillatEndring: PT.bool.isRequired,
    laster: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired
};

export default AktivitetinformasjonVisning;
