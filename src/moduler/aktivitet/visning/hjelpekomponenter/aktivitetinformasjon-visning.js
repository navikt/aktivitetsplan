import React from 'react';
import PT from 'prop-types';
import { Sidetittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import AktivitetIngress from '../aktivitetingress/aktivitetingress';
import Aktivitetsdetaljer from './aktivitetsdetaljer';
import AktivitetEtikettGruppe from '../../../../felles-komponenter/aktivitet-etikett/aktivitet-etikett-gruppe';
import { endreAktivitetRoute } from '../../../../routing';
import * as AppPT from '../../../../proptypes';
import {
    EGEN_AKTIVITET_TYPE,
    IJOBB_AKTIVITET_TYPE,
    STILLING_AKTIVITET_TYPE,
} from '../../../../constant';
import Lenke from '../../../../felles-komponenter/utils/lenke';
import loggEvent, {
    APNE_ENDRE_AKTIVITET,
} from '../../../../felles-komponenter/utils/logging';

function visningsIngress(type) {
    if (
        [
            EGEN_AKTIVITET_TYPE,
            IJOBB_AKTIVITET_TYPE,
            STILLING_AKTIVITET_TYPE,
        ].includes(type)
    ) {
        return null;
    }

    return <AktivitetIngress type={type} />;
}

function AktivitetinformasjonVisning({
    valgtAktivitet,
    tillatEndring,
    laster,
    underOppfolging,
}) {
    const { tittel, type, arenaAktivitet } = valgtAktivitet;

    return (
        <div>
            <div className="aktivitetvisning__underseksjon">
                <div className="aktivitetvisning__header">
                    <Sidetittel
                        id="modal-aktivitetsvisning-header"
                        className="softbreak"
                    >
                        {tittel}
                    </Sidetittel>
                    <Lenke
                        className="endreknapp"
                        role="button"
                        visible={tillatEndring && !arenaAktivitet}
                        href={endreAktivitetRoute(valgtAktivitet.id)}
                        onClick={() => loggEvent(APNE_ENDRE_AKTIVITET)}
                        disabled={laster || !underOppfolging}
                    >
                        <FormattedMessage id="aktivitetvisning.endre-knapp" />
                    </Lenke>
                </div>

                {visningsIngress(type)}

                <AktivitetEtikettGruppe
                    aktivitet={valgtAktivitet}
                    className="aktivitetvisning__etikett"
                />

                <Aktivitetsdetaljer valgtAktivitet={valgtAktivitet} />
            </div>
            <hr className="aktivitetvisning__delelinje" />
        </div>
    );
}

AktivitetinformasjonVisning.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    tillatEndring: PT.bool.isRequired,
    laster: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
};

export default AktivitetinformasjonVisning;
