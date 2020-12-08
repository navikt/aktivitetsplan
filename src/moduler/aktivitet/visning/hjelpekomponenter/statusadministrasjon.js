import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import PT from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { MOTE_TYPE, SAMTALEREFERAT_TYPE, STILLING_AKTIVITET_TYPE } from '../../../../constant';
import VisibleIfDiv from '../../../../felles-komponenter/utils/visible-if-div';
import * as AppPT from '../../../../proptypes';
import { selectErBruker } from '../../../identitet/identitet-selector';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import DeleLinje from '../delelinje/delelinje';
import OppdaterAktivitetEtikett from '../etikett-oppdatering/OppdaterAktivitetEtikett';
import ForhandsorienteringArenaAktivitet from '../forhandsorientering/forhandsorientering-arena-aktivitet';
import OppdaterAktivitetStatus from '../status-oppdatering/oppdater-aktivitet-status';

function Statusadministrasjon(props) {
    const { aktivitet, arenaAktivitet, erBruker, erManuellKrrKvpBruker } = props;
    const { type } = aktivitet;

    const skalViseForhandsorienteringsKomponent = !erBruker && !erManuellKrrKvpBruker;

    const alertTekst = erBruker
        ? 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.'
        : 'For å endre aktiviteten må du gå til Arena.';

    const visAdministreresAvVeileder = (
        <>
            <div className="aktivitetvisning__underseksjon">
                <AlertStripeInfo>{alertTekst}</AlertStripeInfo>
            </div>
            <DeleLinje />
            <div className="aktivitetvisning__underseksjon">
                <ForhandsorienteringArenaAktivitet
                    visible={skalViseForhandsorienteringsKomponent}
                    aktivitet={aktivitet}
                />
            </div>
            <DeleLinje hidden={!skalViseForhandsorienteringsKomponent} />
        </>
    );

    const visOppdaterStatusContainer = (
        <div>
            <VisibleIfDiv visible={type === STILLING_AKTIVITET_TYPE}>
                <OppdaterAktivitetEtikett aktivitet={aktivitet} />
                <DeleLinje />
            </VisibleIfDiv>
            <OppdaterAktivitetStatus aktivitet={aktivitet} />
            <DeleLinje />
        </div>
    );

    if ([SAMTALEREFERAT_TYPE, MOTE_TYPE].includes(type) && erBruker) {
        return null;
    }

    return arenaAktivitet ? visAdministreresAvVeileder : visOppdaterStatusContainer;
}

Statusadministrasjon.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    arenaAktivitet: PT.bool.isRequired,
    erBruker: PT.bool.isRequired,
    erManuellKrrKvpBruker: PT.bool.isRequired,
};

const mapStateToProps = (state) => ({
    erBruker: selectErBruker(state),
    erManuellKrrKvpBruker: selectErBrukerManuell(state) || selectErUnderKvp(state) || selectReservasjonKRR(state),
});

export default connect(mapStateToProps)(Statusadministrasjon);
