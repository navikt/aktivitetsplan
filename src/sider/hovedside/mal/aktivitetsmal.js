import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Tekstomrade from 'nav-frontend-tekstomrade';
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
import { HiddenIfHovedknapp } from '../../../felles-komponenter/hidden-if/hidden-if-knapper';
import {
    selectGjeldendeMal,
    selectMalListe,
    selectMalReducer,
} from '../../../moduler/mal/mal-selector';
import { selectViserHistoriskPeriode } from '../../../moduler/filter/filter-reducer';

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
                    {{ BRUKER: 'bruker', VEILEDER: 'NAV' }[malet.endretAv] ||
                        malet.endretAv}
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
        const { mal, malListe, malReducer, historiskVisning } = this.props;
        const malet = mal && mal.mal;
        const malOpprettet = !!malet;
        const historikkVises = this.state.visHistoriskeMal;

        return (
            <Innholdslaster avhengigheter={[malReducer]}>
                <section className="aktivitetmal">
                    <div className="aktivitetmal__innhold">
                        {!malOpprettet &&
                            <p>
                                <FormattedMessage id="aktivitetsmal.opprett-mal-tekst" />
                            </p>}
                        <Tekstomrade className="aktivitetmal__tekst">
                            {malet}
                        </Tekstomrade>
                        <HiddenIfHovedknapp
                            onClick={() => history.push('mal/endre')}
                            hidden={historiskVisning}
                        >
                            <FormattedMessage
                                id={
                                    malOpprettet
                                        ? 'aktivitetsmal.rediger'
                                        : 'aktivitetsmal.opprett'
                                }
                            />
                        </HiddenIfHovedknapp>
                    </div>
                    <div>
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
                                {malListe
                                    .slice(1, malListe.length)
                                    .map(m => malListeVisning(m))}
                            </Accordion>
                        </div>
                    </div>
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
    malReducer: AppPT.reducer.isRequired,
    historiskVisning: PT.bool.isRequired,
};

const mapStateToProps = state => ({
    mal: selectGjeldendeMal(state),
    malListe: selectMalListe(state),
    malReducer: selectMalReducer(state),
    historiskVisning: selectViserHistoriskPeriode(state),
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => dispatch(hentMal()),
    doHentMalListe: () => dispatch(hentMalListe()),
    doFjernMalListe: () => dispatch(fjernMalListe()),
});

export default AktivitetsmalModal(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetsMal)
);
