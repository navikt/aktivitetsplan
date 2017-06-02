import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Hovedknapp } from 'nav-frontend-knapper';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { hentMal, hentMalListe, fjernMalListe } from '../../../ducks/mal';
import * as AppPT from '../../../proptypes';
import AktivitetsmalForm from './aktivitetsmal-form';
import { formaterDatoDatoEllerTidSiden } from '../../../utils';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import Identitet from '../../../felles-komponenter/identitet';
import Accordion from '../../../felles-komponenter/accordion';
import VisibleIfDiv from '../../../felles-komponenter/utils/visible-if-div';
import './aktivitetsmal.less';

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
            </span> {formaterDatoDatoEllerTidSiden(malet.dato)}
            <Tekstomrade className="aktivitetmal__historikk-tekst">
                {malet.mal}
            </Tekstomrade>
        </article>
    );
}

class AktivitetsMal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redigering: false,
        };
    }

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

    toggleRedigering = () => {
        this.setState({
            redigering: !this.state.redigering,
        });
    };

    render() {
        const { mal, malListe } = this.props;
        const malOpprettet = !!mal.mal;
        const historikkVises = malListe.length !== 0;

        return (
            <Innholdslaster avhengigheter={[this.props.malData]}>
                <section className="aktivitetmal">
                    <VisibleIfDiv
                        className="aktivitetmal__innhold"
                        visible={this.state.redigering}
                    >
                        <AktivitetsmalForm
                            mal={mal}
                            handleComplete={this.toggleRedigering}
                        />
                    </VisibleIfDiv>
                    <VisibleIfDiv visible={!this.state.redigering}>
                        <div className="aktivitetmal__innhold">
                            {!malOpprettet &&
                                <p>
                                    <FormattedMessage id="aktivitetsmal.opprett-mal-tekst" />
                                </p>}
                            <Tekstomrade className="aktivitetmal__tekst">
                                {mal.mal}
                            </Tekstomrade>
                            <Hovedknapp onClick={this.toggleRedigering}>
                                <FormattedMessage
                                    id={
                                        malOpprettet
                                            ? 'aktivitetsmal.rediger'
                                            : 'aktivitetsmal.opprett'
                                    }
                                />
                            </Hovedknapp>
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
                    </VisibleIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

AktivitetsMal.defaultProps = {
    mal: null,
    malListe: null,
    malData: null,
};

AktivitetsMal.propTypes = {
    mal: AppPT.mal,
    malListe: PT.arrayOf(AppPT.mal),
    doHentMal: PT.func.isRequired,
    doHentMalListe: PT.func.isRequired,
    doFjernMalListe: PT.func.isRequired,
    malData: PT.shape({
        status: PT.string.isRequired,
    }),
};

const mapStateToProps = state => ({
    mal: state.data.mal.gjeldende,
    malListe: state.data.mal.liste,
    malData: state.data.mal,
});

const mapDispatchToProps = dispatch => ({
    doHentMal: () => hentMal()(dispatch),
    doHentMalListe: () => hentMalListe()(dispatch),
    doFjernMalListe: () => fjernMalListe()(dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsMal);
