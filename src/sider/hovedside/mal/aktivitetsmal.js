import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { hentMal, hentMalListe, fjernMalListe } from '../../../ducks/mal';
import * as AppPT from '../../../proptypes';
import { formaterDatoEllerTidSiden } from '../../../utils';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import Identitet from '../../../moduler/identitet/identitet';
import Accordion from '../../../felles-komponenter/accordion';
import history from '../../../history';
import AktivitetsmalModal from './aktivitetsmal-modal';
import { HiddenIfHovedknapp } from '../../../felles-komponenter/hidden-if/hidden-if-knapper';

const identitetMap = { BRUKER: 'bruker', VEILEDER: 'NAV' };

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
    componentDidMount() {
        this.props.doHentMal();
    }

    hentMalListe = e => {
        e.preventDefault();
        const { malListe, doHentMalListe, doFjernMalListe } = this.props;
        if (malListe.length === 0) {
            doHentMalListe();
        } else {
            doFjernMalListe();
        }
    };

    render() {
        const { mal, malListe, malReducer, historiskVisning } = this.props;
        const malOpprettet = !!mal.mal;
        const historikkVises = malListe.length !== 0;

        return (
            <Innholdslaster avhengigheter={[malReducer]}>
                <section className="aktivitetmal">
                    <div className="aktivitetmal__innhold">
                        {!malOpprettet &&
                            <p>
                                <FormattedMessage id="aktivitetsmal.opprett-mal-tekst" />
                            </p>}
                        <Tekstomrade className="aktivitetmal__tekst">
                            {mal.mal}
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
                                onClick={this.hentMalListe}
                            >
                                {malListe
                                    .slice(1, malListe.length)
                                    .map(malet => malListeVisning(malet))}
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

const mapStateToProps = state => {
    const stateData = state.data;
    const malReducer = stateData.mal;
    const historiskVisning = !!stateData.filter.historiskPeriode;
    return {
        mal: malReducer.gjeldende,
        malListe: malReducer.liste,
        malReducer,
        historiskVisning,
    };
};

const mapDispatchToProps = dispatch => ({
    doHentMal: () => hentMal()(dispatch),
    doHentMalListe: () => hentMalListe()(dispatch),
    doFjernMalListe: () => fjernMalListe()(dispatch),
});

export default AktivitetsmalModal(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetsMal)
);
