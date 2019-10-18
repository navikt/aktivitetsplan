import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import Tekstomrade from 'nav-frontend-tekstomrade';
import * as AppPT from '../../proptypes';
import { autobind, formaterDatoEllerTidSiden } from '../../utils';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import Accordion from '../../felles-komponenter/accordion';
import AktivitetsmalModal from './aktivitetsmal-modal';
import { div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';
import { HiddenIfHovedknapp } from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import { hentMal, selectMalStatus, selectGjeldendeMal } from './aktivitetsmal-reducer';
import { selectMalListe, selectMalListeStatus } from './aktivitetsmal-selector';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging, selectHarSkriveTilgang } from '../oppfolging-status/oppfolging-selector';
import { fjernMalListe, hentMalListe } from './malliste-reducer';
import { selectErVeileder } from '../identitet/identitet-selector';

const identitetMap = (erVeileder, endretAv) => {
    if (erVeileder) {
        return { BRUKER: 'bruker', VEILEDER: 'NAV' }[endretAv];
    }
    return { BRUKER: 'deg', VEILEDER: 'NAV' }[endretAv];
};

function malListeVisning(gjeldendeMal, erVeileder) {
    return (
        <article key={gjeldendeMal.dato} className="aktivitetmal__historikk">
            <span className="aktivitetmal__historikk-skrevetav">
                {gjeldendeMal.mal ? 'Skrevet av' : 'Mål slettet av'}
                <span>{identitetMap(erVeileder, gjeldendeMal.endretAv)}</span>
            </span>{' '}
            {formaterDatoEllerTidSiden(gjeldendeMal.dato)}
            <Tekstomrade className="aktivitetmal__historikk-tekst">{gjeldendeMal.mal || ''}</Tekstomrade>
        </article>
    );
}

class AktivitetsMal extends Component {
    constructor(props) {
        super(props);
        autobind(this);
        this.state = {};
    }

    componentDidMount() {
        const { doHentMal, doHentMalListe } = this.props;
        doHentMal();
        doHentMalListe();
    }

    toggleHistoriskeMal = e => {
        e.preventDefault();
        const { visHistoriskeMal } = this.state;
        this.setState({
            visHistoriskeMal: !visHistoriskeMal
        });
    };

    render() {
        const {
            avhengigheter,
            mal,
            historiskeMal,
            historiskVisning,
            harSkriveTilgang,
            history,
            underOppfolging,
            erVeileder
        } = this.props;

        const harMal = !!mal;
        const { historikkVises } = this.state;

        return (
            <Innholdslaster avhengigheter={avhengigheter}>
                <section className="aktivitetmal">
                    <div className="aktivitetmal__innhold">
                        <Tekstomrade className="aktivitetmal__tekst">
                            {mal || 'Det ble ikke skrevet mål i denne perioden'}
                        </Tekstomrade>
                        <HiddenIfHovedknapp
                            onClick={() => history.push('mal/endre')}
                            hidden={historiskVisning}
                            disabled={!harSkriveTilgang || !underOppfolging}
                        >
                            {harMal ? 'Rediger' : 'Opprett ditt mål'}
                        </HiddenIfHovedknapp>
                    </div>
                    <HiddenIfDiv hidden={historiskeMal.length === 0}>
                        <hr className="aktivitetmal__delelinje" />
                        <div className="aktivitetmal__footer">
                            <Accordion
                                labelId={historikkVises ? 'aktivitetsmal.skjul' : 'aktivitetsmal.vis'}
                                apen={historikkVises}
                                onClick={this.toggleHistoriskeMal}
                            >
                                {historiskeMal.map(m => malListeVisning(m, erVeileder))}
                            </Accordion>
                        </div>
                    </HiddenIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

AktivitetsMal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string,
    historiskeMal: AppPT.malListe.isRequired,
    historiskVisning: PT.bool.isRequired,
    doHentMal: PT.func.isRequired,
    doHentMalListe: PT.func.isRequired,
    doFjernMalListe: PT.func.isRequired,
    harSkriveTilgang: PT.bool.isRequired,
    history: AppPT.history.isRequired,
    underOppfolging: PT.bool.isRequired,
    erVeileder: PT.bool.isRequired
};

AktivitetsMal.defaultProps = {
    mal: undefined
};

const mapStateToProps = state => ({
    avhengigheter: [selectMalStatus(state), selectMalListeStatus(state)],
    mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
    historiskeMal: selectMalListe(state),
    historiskVisning: selectViserHistoriskPeriode(state),
    harSkriveTilgang: selectHarSkriveTilgang(state),
    underOppfolging: selectErUnderOppfolging(state),
    erVeileder: selectErVeileder(state)
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
    doHentMalListe: () => dispatch(hentMalListe()),
    doFjernMalListe: () => dispatch(fjernMalListe())
});

export default AktivitetsmalModal(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(AktivitetsMal)
);
