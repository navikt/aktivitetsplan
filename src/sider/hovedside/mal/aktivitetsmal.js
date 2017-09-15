import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import {
    hentMal,
    hentMalListe,
    fjernMalListe,
} from '../../../moduler/mal/mal-reducer';
import * as AppPT from '../../../proptypes';
import { autobind, formaterDatoEllerTidSiden } from '../../../utils';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import Identitet from '../../../moduler/identitet/identitet';
import Accordion from '../../../felles-komponenter/accordion';
import history from '../../../history';
import AktivitetsmalModal from './aktivitetsmal-modal';
import hiddenIf, {
    div as HiddenIfDiv,
} from '../../../felles-komponenter/hidden-if/hidden-if';
import {
    HiddenIfHovedknapp,
    HiddenIfKnapp,
} from '../../../felles-komponenter/hidden-if/hidden-if-knapper';
import {
    selectGjeldendeMal,
    selectMalListe,
    selectMalStatus,
} from '../../../moduler/mal/mal-selector';
import { selectViserHistoriskPeriode } from '../../../moduler/filtrering/filter/filter-selector';
import { selectErUnderOppfolging } from '../../../moduler/situasjon/situasjon-selector';
import { selectErBruker } from '../../../moduler/identitet/identitet-selector';

const identitetMap = { BRUKER: 'bruker', VEILEDER: 'NAV' };

const ManglendeMalInformasjon = hiddenIf(({ historiskVisning }) => {
    if (historiskVisning) {
        return (
            <AlertStripeInfoSolid>
                <FormattedMessage id="aktivitetsmal.mangler-historisk-mal" />
            </AlertStripeInfoSolid>
        );
    }
    return (
        <p>
            <FormattedMessage id="aktivitetsmal.opprett-mal-tekst" />
        </p>
    );
});

function malListeVisning(malet) {
    return (
        <article key={malet.dato} className="aktivitetmal__historikk">
            <span className="aktivitetmal__historikk-skrevetav">
                <FormattedMessage
                    id={
                        malet.mal
                            ? 'aktivitetsmal.skrevet-av'
                            : 'aktivitetsmal.slettet-av'
                    }
                />
                <Identitet>
                    {identitetMap[malet.endretAv] || malet.endretAv}
                </Identitet>
            </span>{' '}
            {formaterDatoEllerTidSiden(malet.dato)}
            <Tekstomrade className="aktivitetmal__historikk-tekst">
                {malet.mal}
            </Tekstomrade>
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
        this.props.doHentMal();
        this.props.doHentMalListe();
    }

    toggleHistoriskeMal = e => {
        e.preventDefault();
        this.setState({
            visHistoriskeMal: !this.state.visHistoriskeMal,
        });
    };

    render() {
        const {
            mal,
            malListe,
            malStatus,
            historiskVisning,
            kanSletteMal,
        } = this.props;
        const malet = mal && mal.mal;
        const harMal = !!malet;
        const historikkVises = this.state.visHistoriskeMal;
        const historiskeMal = malListe.slice(1, malListe.length);

        return (
            <Innholdslaster avhengigheter={[malStatus]}>
                <section className="aktivitetmal">
                    <div className="aktivitetmal__innhold">
                        <ManglendeMalInformasjon
                            hidden={harMal}
                            historiskVisning={historiskVisning}
                        />
                        <Tekstomrade className="aktivitetmal__tekst">
                            {malet}
                        </Tekstomrade>
                        <HiddenIfKnapp
                            onClick={() => history.push('mal/slett/')}
                            className="aktivitetmal__slett-knapp"
                            hidden={!harMal || !kanSletteMal}
                        >
                            <FormattedMessage id="aktivitetvisning.slett-knapp" />
                        </HiddenIfKnapp>
                        <HiddenIfHovedknapp
                            onClick={() => history.push('mal/endre')}
                            hidden={historiskVisning}
                        >
                            <FormattedMessage
                                id={
                                    harMal
                                        ? 'aktivitetsmal.rediger'
                                        : 'aktivitetsmal.opprett'
                                }
                            />
                        </HiddenIfHovedknapp>
                    </div>
                    <HiddenIfDiv hidden={historiskeMal.length === 0}>
                        <hr className="aktivitetmal__delelinje" />
                        <div className="aktivitetmal__innhold">
                            <Accordion
                                labelId={
                                    historikkVises
                                        ? 'aktivitetsmal.skjul'
                                        : 'aktivitetsmal.vis'
                                }
                                apen={historikkVises}
                                onClick={this.toggleHistoriskeMal}
                            >
                                {historiskeMal.map(m => malListeVisning(m))}
                            </Accordion>
                        </div>
                    </HiddenIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

AktivitetsMal.defaultProps = {
    mal: null,
    malListe: null,
};

AktivitetsMal.propTypes = {
    mal: AppPT.mal,
    malListe: PT.arrayOf(AppPT.mal),
    doHentMal: PT.func.isRequired,
    doHentMalListe: PT.func.isRequired,
    doFjernMalListe: PT.func.isRequired,
    malStatus: AppPT.status.isRequired,
    historiskVisning: PT.bool.isRequired,
    kanSletteMal: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    mal: selectGjeldendeMal(state),
    malListe: selectMalListe(state),
    malStatus: selectMalStatus(state),
    historiskVisning: selectViserHistoriskPeriode(state),
    kanSletteMal: !selectErUnderOppfolging(state) && selectErBruker(state),
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
    doHentMalListe: () => dispatch(hentMalListe()),
    doFjernMalListe: () => dispatch(fjernMalListe()),
});

export default AktivitetsmalModal(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetsMal)
);
