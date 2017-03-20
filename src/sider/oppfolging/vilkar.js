import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Hovedknapp } from 'nav-react-design/dist/knapp';
import { Link } from 'react-router';
import Bilde from 'nav-react-design/dist/bilde';
import { Innholdstittel } from 'nav-react-design/dist/typografi';
import history from './../../history';
import UnsafeHtml from '../../felles-komponenter/utils/unsafe-html';
import { godtaVilkar } from '../../ducks/oppfolging-status';
import { hentVilkar } from '../../ducks/vilkar';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import leggTilAktivitetSvg from '../../img/legg-til-aktivitet-illustrasjon.svg';


class Vilkar extends Component {

    constructor(props) {
        super(props);
        this.state = { checked: false };
    }

    componentDidMount() {
        this.props.doHentVilkar();
    }

    godta = (hash) => {
        history.push('/');
        this.props.doGodtaVilkar(hash);
    };

    check = () => {
        this.setState({
            checked: true
        });
    };

    render() {
        const { visGodkjenning, visVilkar, vilkar, text } = this.props;
        const name = `godta-${visVilkar}`;

        return (
            <div className="ny-aktivitet-modal side-innhold">

                {visVilkar && (
                    <div className="vis-vilkar ny-aktivitet-modal__header">
                        <Bilde
                            className="ny-aktivitet-modal__bilde"
                            src={leggTilAktivitetSvg}
                            alt="Dekorativ illustrajon"
                        />
                        <Innholdstittel className="ny-aktivitet-tittel"><FormattedMessage id="vilkar.tittel" /></Innholdstittel>
                        <Innholdslaster avhengigheter={[vilkar]}>
                            <UnsafeHtml className="vis-vilkar__tekst">{text}</UnsafeHtml>
                        </Innholdslaster>
                    </div>
                )}

                { visVilkar && visGodkjenning && (<hr className="vis-vilkar__delelinje" />)}

                { visGodkjenning && (
                    <div>
                        <div className="vis-vilkar">
                            <input
                                id={name} name={name} type="radio" className="nav-radioknapp nav-radioknapp-vannrett"
                                required checked={this.state.checked} onChange={this.check}
                            />
                            <label
                                htmlFor={name}
                                className="vis-vilkar__label"
                            >{visVilkar ? <FormattedMessage id="vilkar.ja-jeg-samtykker" /> : <FormattedMessage id="vilkar.ja-ta-i-bruk" />}</label>
                            {!visVilkar && (<Link to="/vilkar"><FormattedMessage id="vilkar.se-vilkar-her" /></Link>)}
                        </div>
                        <div className="vis-vilkar">
                            <Hovedknapp onClick={() => this.godta(vilkar.data.hash)} disabled={!this.state.checked}><FormattedMessage id="vilkar.ga-til-aktivitetsplan" /></Hovedknapp>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

Vilkar.propTypes = {
    doGodtaVilkar: PT.func,
    doHentVilkar: PT.func.isRequired,

    vilkar: AppPT.vilkar.isRequired,
    text: PT.string,

    visGodkjenning: PT.bool,
    visVilkar: PT.bool
};


const mapStateToProps = (state) => {
    const vilkar = state.data.vilkar;
    return ({
        vilkar,
        text: vilkar.data.text
    });
};

const mapDispatchToProps = (dispatch) => ({
    doGodtaVilkar: (hash) => godtaVilkar(hash)(dispatch),
    doHentVilkar: () => hentVilkar()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Vilkar);

