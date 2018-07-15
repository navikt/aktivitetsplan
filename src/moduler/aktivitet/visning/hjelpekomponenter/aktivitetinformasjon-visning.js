import React from 'react';
import PT from 'prop-types';
import { Sidetittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import AktivitetIngress from '../aktivitetingress/aktivitetingress';
import { Aktivitetsdetaljer } from './aktivitetsdetaljer';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import AktivitetEtikettGruppe from '../../../../felles-komponenter/aktivitet-etikett/aktivitet-etikett-gruppe';
import { endreAktivitetRoute } from '../../../../routing';
import * as AppPT from '../../../../proptypes';

function AktivitetinformasjonVisning({
    valgtAktivitet,
    tillatEndring,
    history,
}) {
    const { tittel, type, arenaAktivitet } = valgtAktivitet;

    const gaTilEndreAktivitet = () =>
        history.push(endreAktivitetRoute(valgtAktivitet.id));

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

                <VisibleIfDiv visible={tillatEndring && !arenaAktivitet}>
                    <Hovedknapp
                        onClick={gaTilEndreAktivitet}
                        className="knapp-liten modal-footer__knapp"
                    >
                        <FormattedMessage id="aktivitetvisning.endre-knapp" />
                    </Hovedknapp>
                </VisibleIfDiv>
            </div>
            <hr className="aktivitetvisning__delelinje" />
        </div>
    );
}

AktivitetinformasjonVisning.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    tillatEndring: PT.bool.isRequired,
    history: AppPT.history.isRequired,
};

export default withRouter(AktivitetinformasjonVisning);
