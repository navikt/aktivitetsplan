import { connect } from 'react-redux';
import React from 'react';
import PT from 'prop-types';
import { Container } from 'nav-frontend-grid';
import Varslinger from '../moduler/varslinger/varslinger';
import AktivitetsTavle from './tavle/aktivitetstavle';
import Navigasjonslinje from './navigasjonslinje/navigasjonslinje';
import OppfolgingStatus from '../moduler/oppfolging-status/oppfolging-status';
import VerktoylinjeToggle from '../moduler/verktoylinje/verktoylinjeToggle';
import HovedsideFeilmelding from '../moduler/feilmelding/hovedsidefeilmelding';
import ArenaFeilmelding from '../moduler/feilmelding/arenafeilmelding';
import PrivateFeilmelding from '../moduler/feilmelding/private-feilmelding';
import VisValgtFilterOrignalToggle from '../moduler/filtrering/filter-vis-label-orginal';
import MitMaal from './maalLinje/mitt-maal';
import Routing, { PublicRouting } from '../routing';
import { getFodselsnummer } from '../bootstrap/fnr-util';
import { selectErVeileder } from '../moduler/identitet/identitet-selector';
import loggEvent from '../felles-komponenter/utils/logging';

const LOGGING_ANTALLBRUKERE = 'aktivitetsplan.antallBrukere';

function loggingAntallBrukere(typeEvent, hvem) {
    const { erVeileder } = hvem;
    if (erVeileder !== undefined) {
        loggEvent(typeEvent, hvem);
    }
}

function Hovedside({ erVeileder }) {
    const fnr = getFodselsnummer();

    loggingAntallBrukere(LOGGING_ANTALLBRUKERE, { erVeileder });
    return (
        <div className="hovedside" key={fnr}>
            <div className="hovedsideinnhold">
                <HovedsideFeilmelding />
                <ArenaFeilmelding />
                <OppfolgingStatus>
                    <Navigasjonslinje />
                    <PrivateFeilmelding />
                    <Varslinger />
                    <Container>
                        <MitMaal />
                        <VerktoylinjeToggle />
                        <VisValgtFilterOrignalToggle />
                    </Container>
                    <AktivitetsTavle />
                    <Routing />
                </OppfolgingStatus>
                <PublicRouting />
            </div>
        </div>
    );
}

Hovedside.propTypes = {
    harNyVerktoylinje: PT.bool.isRequired,
    erVeileder: PT.bool.isRequired,
};
const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
});

export default connect(mapStateToProps)(Hovedside);
