import React from 'react';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import * as AppPT from '../../../../proptypes';
import { TILLAT_SLETTING, TILLAT_SET_AVTALT } from '~config'; // eslint-disable-line
import OppdaterAktivitetStatus from '../status-oppdatering/oppdater-aktivitet-status';
import OppdaterAktivitetEtikett from '../etikett-oppdatering/oppdater-aktivitet-etikett';
import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';

function Statusadministrasjon({ valgtAktivitet, arenaAktivitet, paramsId }) {
    const { status, type } = valgtAktivitet;

    const visAdministreresAvVeileder = (
        <div className="aktivitetvisning__underseksjon">
            <AlertStripeInfo className="aktivitetvisning__alert">
                <FormattedMessage id="aktivitetvisning.administreres-av-veileder" />
            </AlertStripeInfo>
        </div>
    );

    const visOppdaterStatusContainer = (
        <div>
            <OppdaterAktivitetStatus
                status={status}
                paramsId={paramsId}
                className="aktivitetvisning__underseksjon"
            />

            <VisibleIfDiv visible={type === STILLING_AKTIVITET_TYPE}>
                <hr className="aktivitetvisning__delelinje" />
                <OppdaterAktivitetEtikett
                    status={status}
                    paramsId={paramsId}
                    className="aktivitetvisning__underseksjon"
                />
            </VisibleIfDiv>
        </div>
    );

    return arenaAktivitet
        ? visAdministreresAvVeileder
        : visOppdaterStatusContainer;
}

Statusadministrasjon.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    arenaAktivitet: PT.bool.isRequired,
};

export default Statusadministrasjon;
