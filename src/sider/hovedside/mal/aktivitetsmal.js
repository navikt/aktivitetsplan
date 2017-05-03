import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import NavFrontendChevron from 'nav-frontend-chevron';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { Hovedknapp } from 'nav-frontend-knapper';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { hentMal, hentMalListe, fjernMalListe, oppdaterMal } from '../../../ducks/mal';
import * as AppPT from '../../../proptypes';
import AktivitetsmalForm from './aktivitetsmal-form';
import { formaterDatoDatoEllerTidSiden } from '../../../utils';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import Identitet from '../../../felles-komponenter/identitet';
import './aktivitetsmal.less';

const trim = function (str) { return str ? str.trim() : ''; };

class AktivitetsMal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redigering: false
        };
    }

    componentDidMount() {
        this.props.doHentMal();
    }

    hentMalListe = (e) => {
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
            redigering: !this.state.redigering
        });
    };

    render() {
        const { mal, malListe, doOppdaterMal } = this.props;
        const malOpprettet = !!mal.mal;
        const historikkVises = malListe.length !== 0;

        return (
            <section className="aktivitetmal">
                <Innholdslaster avhengigheter={[this.props.malData]}>
                    <EkspanderbartPanel tittel={<FormattedMessage id={malOpprettet ? 'aktivitetsmal.mitt-mal' : 'aktivitetsmal.opprett-mal'} />}>
                        <hr className="aktivitetmal__delelinje" />
                        {this.state.redigering ? (
                            <div className="aktivitetmal__innhold">
                                <AktivitetsmalForm
                                    mal={mal}
                                    onSubmit={(malet) => doOppdaterMal(malet, this.props.mal, this.toggleRedigering)}
                                    handleCancel={this.toggleRedigering}
                                />
                            </div>
                            ) : (
                                <div>
                                    <div className="aktivitetmal__innhold">
                                        {!malOpprettet && <p><FormattedMessage id="aktivitetsmal.opprett-mal-tekst" /></p>}
                                        <Tekstomrade className="aktivitetmal__tekst">{mal.mal}</Tekstomrade>
                                        <Hovedknapp onClick={this.toggleRedigering}>{<FormattedMessage id={malOpprettet ? 'aktivitetsmal.rediger' : 'aktivitetsmal.opprett'} />}</Hovedknapp>
                                    </div>
                                    <div>
                                        <hr className="aktivitetmal__delelinje" />
                                        <div className="aktivitetmal__innhold">
                                            <a
                                                href="/"
                                                className={historikkVises ? 'aktivitetmal__link aktivitetmal__link-apen' : 'aktivitetmal__link'}
                                                onClick={this.hentMalListe}
                                            ><NavFrontendChevron orientasjon={historikkVises ? 'opp' : 'ned'} className="aktivitetmal__chevron" />
                                                {<FormattedMessage id={historikkVises ? 'aktivitetsmal.skjul' : 'aktivitetsmal.vis'} />}
                                            </a>
                                            {malListe.slice(1, malListe.length).map((malet) => (
                                                <article key={malet.dato} className="aktivitetmal__historikk">
                                                    <span className="aktivitetmal__historikk-skrevetav">
                                                        <FormattedMessage id={malet.mal ? 'aktivitetsmal.skrevet-av' : 'aktivitetsmal.slettet-av'} />
                                                        <Identitet>{({ BRUKER: 'bruker', VEILEDER: 'NAV' }[malet.endretAv]) || malet.endretAv}</Identitet>
                                                    </span> {formaterDatoDatoEllerTidSiden(malet.dato)}
                                                    <Tekstomrade className="aktivitetmal__historikk-tekst">{malet.mal}</Tekstomrade>
                                                </article>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </EkspanderbartPanel>
                </Innholdslaster>
            </section>
        );
    }
}

AktivitetsMal.propTypes = {
    mal: AppPT.mal,
    malListe: PT.arrayOf(AppPT.mal),
    doHentMal: PT.func.isRequired,
    doHentMalListe: PT.func.isRequired,
    doFjernMalListe: PT.func.isRequired,
    doOppdaterMal: PT.func.isRequired,
    malData: PT.shape({
        status: PT.string.isRequired
    })
};

const mapStateToProps = (state) => ({
    mal: state.data.mal.gjeldende,
    malListe: state.data.mal.liste,
    malData: state.data.mal
});

const mapDispatchToProps = (dispatch) => ({
    doHentMal: () => hentMal()(dispatch),
    doHentMalListe: () => hentMalListe()(dispatch),
    doFjernMalListe: () => fjernMalListe()(dispatch),
    doOppdaterMal: (newMal, oldMal, callback) => {
        if (trim(newMal.mal) !== trim(oldMal.mal)) {
            oppdaterMal({ mal: trim(newMal.mal) })(dispatch);
        }
        callback();
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsMal);
