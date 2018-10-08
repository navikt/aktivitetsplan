import React from 'react';
import PT from 'prop-types';
import { Sidetittel } from 'nav-frontend-typografi';
import { FormattedMessage } from 'react-intl';
import Lenkeknapp from '../../../../felles-komponenter/utils/lenkeknapp';
import AktivitetIngress from '../aktivitetingress/aktivitetingress';
import { Aktivitetsdetaljer } from './aktivitetsdetaljer';
import AktivitetEtikettGruppe from '../../../../felles-komponenter/aktivitet-etikett/aktivitet-etikett-gruppe';
import { endreAktivitetRoute } from '../../../../routing';
import * as AppPT from '../../../../proptypes';

function AktivitetinformasjonVisning({
    valgtAktivitet,
    tillatEndring,
    laster,
}) {
    const { tittel, type, arenaAktivitet } = valgtAktivitet;

    return (
        <div>
            <div className="aktivitetvisning__underseksjon">
                <Sidetittel
                    id="modal-aktivitetsvisning-header"
                    className="softbreak"
                >
                    {tittel}
                </Sidetittel>

                <AktivitetIngress type={type} />

                <AktivitetEtikettGruppe
                    aktivitet={valgtAktivitet}
                    className="aktivitetvisning__etikett"
                />

                <Aktivitetsdetaljer
                    className="aktivitetvisning__detaljer"
                    valgtAktivitet={valgtAktivitet}
                />

                <Lenkeknapp
                    visible={tillatEndring && !arenaAktivitet}
                    type="hoved"
                    href={endreAktivitetRoute(valgtAktivitet.id)}
                    disabled={laster}
                >
                    <FormattedMessage id="aktivitetvisning.endre-knapp" />
                </Lenkeknapp>
            </div>
            <hr className="aktivitetvisning__delelinje" />
        </div>
    );
}

AktivitetinformasjonVisning.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    tillatEndring: PT.bool.isRequired,
    laster: PT.bool.isRequired,
};

export default AktivitetinformasjonVisning;
