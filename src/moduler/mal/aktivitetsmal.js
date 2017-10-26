import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import * as AppPT from '../../../proptypes';
import { autobind, formaterDatoEllerTidSiden } from '../../../utils';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import Identitet from '../../../moduler/identitet/identitet';
import Accordion from '../../../felles-komponenter/accordion';
import history from '../../../history';
import AktivitetsmalModal from './aktivitetsmal-modal';
import hiddenIf, {
    div as HiddenIfDiv,
} from '../../felles-komponenter/hidden-if/hidden-if';
import {
    HiddenIfHovedknapp,
    HiddenIfKnapp,
} from '../../felles-komponenter/hidden-if/hidden-if-knapper';
import {
    hentMal,
    selectMalStatus,
    selectGjeldendeMal,
} from '../../../moduler/mal/mal-reducer';
import {
    selectMalListe,
    selectMalListeStatus,
} from './aktivitetsmal-selector';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { selectErBruker } from '../identitet/identitet-selector';
import { fjernMalListe, hentMalListe } from './malliste-reducer';

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

function malListeVisning(gjeldendeMal) {
    return (
        <article key={gjeldendeMal.dato} className="aktivitetmal__historikk">
            <span className="aktivitetmal__historikk-skrevetav">
                <FormattedMessage
                    id={
                        gjeldendeMal.mal
                            ? 'aktivitetsmal.skrevet-av'
                            : 'aktivitetsmal.slettet-av'
                    }
                />
                <Identitet>
                    {identitetMap[gjeldendeMal.endretAv] ||
                        gjeldendeMal.endretAv}
                </Identitet>
            </span>{' '}
            {formaterDatoEllerTidSiden(gjeldendeMal.dato)}
            <Tekstomrade className="aktivitetmal__historikk-tekst">
                {gjeldendeMal.mal || ''}
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
            avhengigheter,
            mal,
            historiskeMal,
            historiskVisning,
            kanSletteMal,
        } = this.props;

        const harMal = !!mal;
        const historikkVises = this.state.visHistoriskeMal;

        return (
            <Innholdslaster avhengigheter={avhengigheter}>
                <section className="aktivitetmal">
                    <div className="aktivitetmal__innhold">
                        <ManglendeMalInformasjon
                            hidden={harMal}
                            historiskVisning={historiskVisning}
                        />
                        <Tekstomrade className="aktivitetmal__tekst">
                            {mal || ''}
                        </Tekstomrade>
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
                        <HiddenIfKnapp
                            onClick={() => history.push('mal/slett/')}
                            className="aktivitetmal__slett-knapp"
                            hidden={!harMal || !kanSletteMal}
                        >
                            <FormattedMessage id="aktivitetvisning.slett-knapp" />
                        </HiddenIfKnapp>
                    </div>
                    <HiddenIfDiv hidden={historiskeMal.length === 0}>
                        <hr className="aktivitetmal__delelinje" />
                        <div className="aktivitetmal__footer">
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
    mal: '',
};

AktivitetsMal.propTypes = {
    avhengigheter: AppPT.avhengigheter.isRequired,
    mal: PT.string.isRequired,
    historiskeMal: AppPT.malListe.isRequired,
    historiskVisning: PT.bool.isRequired,
    kanSletteMal: PT.bool.isRequired,
    doHentMal: PT.func.isRequired,
    doHentMalListe: PT.func.isRequired,
    doFjernMalListe: PT.func.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectMalStatus(state), selectMalListeStatus(state)],
    mal: selectGjeldendeMal(state) && selectGjeldendeMal(state).mal,
    historiskeMal: selectMalListe(state),
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
