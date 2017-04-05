import React, {Component, PropTypes as PT} from "react";
import {connect} from "react-redux";
import * as AppPT from "../../../proptypes";
import EkspanderbartPanel from "nav-frontend-ekspanderbartpanel";
import {hentMal, hentMalListe, fjernMalListe, oppdaterMal} from "../../../ducks/mal";
import {Hovedknapp} from "nav-frontend-knapper";
import {Textarea} from "nav-frontend-skjema";
import AktivitetsmalForm from "./aktivitetsmal-form"
import "./aktivitetsmal.less";

class AktivitetsMal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            redigering: false
        };
    }

    hentGjeldendeMal = () => {
        this.props.doHentMal();
    };

    hentMalListe = () => {
        const {malListe, doHentMalListe, doFjernMalListe} = this.props;
        if (malListe.length === 0) {
            doHentMalListe();
        } else {
            doFjernMalListe();
        }
    };

    toggleRedigering = () => {
        this.setState({
            redigering: !this.state.redigering
        })
    };

    render() {
        const {mal, endretAv, dato} = this.props.mal;
        const malListe = this.props.malListe;
        return (
            <div className="aktivitetmal">
                <EkspanderbartPanel tittel="Mål" onClick={this.hentGjeldendeMal}>
                    {this.state.redigering ? (
                            <div>
                                <AktivitetsmalForm mal={this.props.mal} onSubmit={(mal) => this.props.doOppdaterMal(mal, this.toggleRedigering)} />
                            </div>
                        ) : (
                            <div>
                                <div>{mal}</div>
                                <Hovedknapp onClick={this.toggleRedigering}>Rediger</Hovedknapp>
                                {}
                            </div>
                        )}
                    <a onClick={this.hentMalListe}>{malListe.length === 0 ? 'Vis' : 'Skjul'} tidligere lagrede mål</a>
                    {malListe.map((mal, i) => {
                        return (
                            <div key={mal.dato}>
                                {mal.mal}
                                {mal.endretAv}
                                {mal.dato}
                            </div>
                        );
                    })}
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
