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
import ForhandsorienteringArenaAktivitet from '../forhandsorientering/forhandsorientering-arena-aktivitet';
import { selectFeatureData } from '../../../../felles-komponenter/feature/feature-selector';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import {
    FORHANDSORIENTERING,
    harFeature,
} from '../../../../felles-komponenter/feature/feature';
import { selectErBrukerMedIServiceGruppeSTS } from '../../../oppfoelgingsstatus/oppfoelgingsstatus-selector';

function Statusadministrasjon({
    valgtAktivitet,
    arenaAktivitet,
    erBruker,
    erManuellKrrKvpBruker,
    erSpecieltTilpassetInnsatsBruker,
    features,
}) {
    const { status, type, id } = valgtAktivitet;

    const skalViseForhandsorienteringsKomponent =
        harFeature(FORHANDSORIENTERING, features) &&
        erSpecieltTilpassetInnsatsBruker &&
        !erBruker &&
        !erManuellKrrKvpBruker;

    const visAdministreresAvVeileder = (
        <div className="aktivitetvisning__underseksjon">
            <AlertStripeInfo className="aktivitetvisning__alert">
                <FormattedMessage id="aktivitetvisning.administreres-av-veileder" />
            </AlertStripeInfo>
            <ForhandsorienteringArenaAktivitet
                visible={skalViseForhandsorienteringsKomponent}
                valgtAktivitet={valgtAktivitet}
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
    features: selectFeatureData(state),
    erManuellKrrKvpBruker:
        selectErBrukerManuell(state) ||
        selectErUnderKvp(state) ||
        selectReservasjonKRR(state),
    erSpecieltTilpassetInnsatsBruker: selectErBrukerMedIServiceGruppeSTS(state),
});

export default connect(mapStateToProps)(Statusadministrasjon);
