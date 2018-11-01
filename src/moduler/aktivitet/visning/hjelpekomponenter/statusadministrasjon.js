import React from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import * as AppPT from '../../../../proptypes';
import OppdaterAktivitetStatus from '../status-oppdatering/oppdater-aktivitet-status';
import OppdaterAktivitetEtikett from '../etikett-oppdatering/oppdater-aktivitet-etikett';
import {
    STILLING_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
} from '../../../../constant';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import { selectErBruker } from '../../../identitet/identitet-selector';
import ForhandsorienteringArenaAktivitetForm from '../forhandsorientering/forhandsorientering-arena-aktivitet';

function Statusadministrasjon({ valgtAktivitet, arenaAktivitet, erBruker }) {
    const { status, type, id } = valgtAktivitet;

    const visAdministreresAvVeileder = (
        <div className="aktivitetvisning__underseksjon">
            <AlertStripeInfo className="aktivitetvisning__alert">
                <FormattedMessage id="aktivitetvisning.administreres-av-veileder" />
            </AlertStripeInfo>
            <ForhandsorienteringArenaAktivitetForm
                valgtAktivitet={valgtAktivitet}
                erBruker={erBruker}
            />
        </div>
    );

    const visOppdaterStatusContainer = (
        <div>
            <VisibleIfDiv visible={type === STILLING_AKTIVITET_TYPE}>
                <OppdaterAktivitetEtikett
                    status={status}
                    paramsId={id}
                    className="aktivitetvisning__underseksjon"
                />
                <hr className="aktivitetvisning__delelinje" />
            </VisibleIfDiv>
            <OppdaterAktivitetStatus
                status={status}
                aktivitetId={id}
                className="aktivitetvisning__underseksjon"
            />
            <hr className="aktivitetvisning__delelinje" />
        </div>
    );

    if ([SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker) {
        return null;
    }

    return arenaAktivitet
        ? visAdministreresAvVeileder
        : visOppdaterStatusContainer;
}

Statusadministrasjon.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    arenaAktivitet: PT.bool.isRequired,
    erBruker: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    erBruker: selectErBruker(state),
});

export default connect(mapStateToProps)(Statusadministrasjon);
