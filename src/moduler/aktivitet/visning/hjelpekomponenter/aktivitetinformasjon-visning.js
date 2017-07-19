import React from 'react';
import PT from 'prop-types';
import { Sidetittel } from 'nav-frontend-typografi';
import { Hovedknapp } from 'nav-frontend-knapper';
import { FormattedMessage } from 'react-intl';
import AktivitetIngress from '../aktivitetingress/aktivitetingress';
import history from '../../../../history';
import AktivitetsDetaljer from './aktivitetsdetaljer';
import { TILLAT_SLETTING, TILLAT_SET_AVTALT } from '~config'; // eslint-disable-line
import {
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    AVTALT_MED_NAV,
} from '../../../../constant';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import AktivitetEtikett from '../../../../felles-komponenter/aktivitet-etikett';
import { endreAktivitetRoute } from '../../../../routing';
import * as AppPT from '../../../../proptypes';

function AktivitetinformasjonVisning({ valgtAktivitet, arenaAktivitet }) {
    const { tittel, type, avtalt, etikett } = valgtAktivitet;

    const tillattEndring =
        (valgtAktivitet.avtalt !== true || !!TILLAT_SET_AVTALT) &&
        (valgtAktivitet.status !== STATUS_FULLFOERT &&
            valgtAktivitet.status !== STATUS_AVBRUTT);

    const gaTilEndreAktivitet = () =>
        history.push(endreAktivitetRoute(valgtAktivitet.id));

    return (
        <div>
            <div className="aktivitetvisning__underseksjon">
                <Sidetittel id="modal-aktivitetsvisning-header">
                    {tittel}
                </Sidetittel>

                <AktivitetIngress type={type} />

                <div className="aktivitetskort__etiketter blokk-s">
                    <AktivitetEtikett
                        visible={avtalt}
                        etikett={AVTALT_MED_NAV}
                        id={AVTALT_MED_NAV}
                    />

                    <AktivitetEtikett
                        visible={!!etikett}
                        etikett={etikett}
                        id={`etikett.${etikett}`}
                    />
                </div>

                <AktivitetsDetaljer
                    className="aktivitetvisning__detaljer"
                    valgtAktivitet={valgtAktivitet}
                />

                <VisibleIfDiv visible={tillattEndring && !arenaAktivitet}>
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
    arenaAktivitet: PT.bool.isRequired,
};

export default AktivitetinformasjonVisning;
