import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import EkspanderbartPanel from 'nav-frontend-ekspanderbartpanel';
import { Hovedknapp } from 'nav-frontend-knapper';
import { hentMal, hentMalListe, fjernMalListe, oppdaterMal } from '../../../ducks/mal';
import * as AppPT from '../../../proptypes';
import AktivitetsmalForm from './aktivitetsmal-form';
import { formaterDatoDatoEllerTidSiden } from '../../../utils';
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
        const malListe = this.props.malListe;
        return (
            <div className="aktivitetmal">
                <EkspanderbartPanel tittel="Mitt mål">
                    <hr className="aktivitetmal__delelinje" />
                    {this.state.redigering ? (
                        <div className="aktivitetmal__innhold">
                            <AktivitetsmalForm
                                mal={this.props.mal}
                                onSubmit={(mal) => this.props.doOppdaterMal(mal, this.toggleRedigering)}
                                handleCancel={this.toggleRedigering}
                            />
                        </div>
                        ) : (
                            <div>
                                <div className="aktivitetmal__innhold">
                                    <div className="aktivitetmal__tekst">{this.props.mal.mal}</div>
                                    <Hovedknapp onClick={this.toggleRedigering}>Rediger</Hovedknapp>

                                </div>
                                <div>
                                    <hr className="aktivitetmal__delelinje" />
                                    <div className="aktivitetmal__innhold">
                                        <a
                                            href="/"
                                            className="aktivitetmal__link"
                                            onClick={this.hentMalListe}
                                        >{malListe.length === 0 ? 'Vis ' : 'Skjul '}
                                            tidligere lagrede mål</a>
                                        {malListe.map((mal) => (
                                            <div key={mal.dato} className="aktivitetmal__historikk">
                                                <span className="aktivitetmal__historikk-skrevetav">
                                                    Skrevet av deg</span> {formaterDatoDatoEllerTidSiden(mal.dato)}
                                                <br />
                                                <span className="aktivitetmal__historikk-tekst">{mal.mal}</span>
                                            </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        )}
                </EkspanderbartPanel>
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
    doOppdaterMal: PT.func.isRequired
};

const mapStateToProps = (state) => ({
    mal: state.data.mal.gjeldende,
    malListe: state.data.mal.liste
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
