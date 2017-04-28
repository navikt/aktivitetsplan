import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
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
            <div className="aktivitetmal">
                <Innholdslaster avhengigheter={[this.props.malData]}>
                    <EkspanderbartPanel tittel={malOpprettet ? 'Mitt mål' : 'Opprett ditt mål'}>
                        <hr className="aktivitetmal__delelinje" />
                        {this.state.redigering ? (
                            <div className="aktivitetmal__innhold">
                                <AktivitetsmalForm
                                    mal={mal}
                                    onSubmit={(malet) => doOppdaterMal(malet, this.toggleRedigering)}
                                    handleCancel={this.toggleRedigering}
                                />
                            </div>
                            ) : (
                                <div>
                                    <div className="aktivitetmal__innhold">
                                        {!malOpprettet && <p>Opprett ditt mål for oppfølgingen i NAV ved å klikke på knappen under.</p>}
                                        <Tekstomrade className="aktivitetmal__tekst">{mal.mal}</Tekstomrade>
                                        <Hovedknapp onClick={this.toggleRedigering}>{malOpprettet ? 'Rediger' : 'Opprett'}</Hovedknapp>

                                    </div>
                                    <div>
                                        <hr className="aktivitetmal__delelinje" />
                                        <div className="aktivitetmal__innhold">
                                            <NavFrontendChevron orientasjon={historikkVises ? 'opp' : 'ned'} className="aktivitetmal__chevron" />
                                            <a
                                                href="/"
                                                className={historikkVises ? 'aktivitetmal__link aktivitetmal__link-apen' : 'aktivitetmal__link'}
                                                onClick={this.hentMalListe}
                                            >{historikkVises ? 'Skjul ' : 'Vis '}
                                                tidligere lagrede mål</a>
                                            {malListe.map((malet) => (
                                                <div key={malet.dato} className="aktivitetmal__historikk">
                                                    <span className="aktivitetmal__historikk-skrevetav">
                                                        Skrevet av <Identitet>{({ BRUKER: 'bruker', VEILEDER: 'NAV' }[malet.endretAv]) || malet.endretAv}</Identitet>
                                                    </span> {formaterDatoDatoEllerTidSiden(malet.dato)}
                                                    <Tekstomrade className="aktivitetmal__historikk-tekst">{malet.mal}</Tekstomrade>
                                                </div>
                                                ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                    </EkspanderbartPanel>
                </Innholdslaster>
            </div>

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
    doOppdaterMal: (mal, callback) => {
        oppdaterMal(mal)(dispatch);
        callback();
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsMal);
