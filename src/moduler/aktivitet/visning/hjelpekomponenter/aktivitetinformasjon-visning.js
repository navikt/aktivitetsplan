import React from 'react';
import PT from 'prop-types';
import { Sidetittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import AktivitetIngress from '../aktivitetingress/aktivitetingress';
import history from '../../../../history';
import AktivitetsDetaljer from './aktivitetsdetaljer';
import { TILLAT_SLETTING, TILLAT_SET_AVTALT } from '~config'; // eslint-disable-line
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import AktivitetEtikettGruppe from '../../../../felles-komponenter/aktivitet-etikett/aktivitet-etikett-gruppe';
import { endreAktivitetRoute } from '../../../../routing';
import * as AppPT from '../../../../proptypes';

function AktivitetinformasjonVisning({ valgtAktivitet, tillatEndring }) {
    const { tittel, type, avtalt, etikett, arenaAktivitet } = valgtAktivitet;

    const gaTilEndreAktivitet = () =>
        history.push(endreAktivitetRoute(valgtAktivitet.id));

    return (
        <div>
            <div className="aktivitetvisning__underseksjon">
                <Sidetittel id="modal-aktivitetsvisning-header">
                    {tittel}
                </Sidetittel>

                <AktivitetIngress type={type} />

                <AktivitetEtikettGruppe
                    avtalt={avtalt}
                    etikett={etikett}
                    className="aktivitetvisning__etikett"
                />

                <AktivitetsDetaljer
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
};

export default AktivitetinformasjonVisning;
