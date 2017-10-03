import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from 'react-intl';
import {
    AlertStripeAdvarsel,
    AlertStripeInfo,
    AlertStripeInfoSolid,
} from 'nav-frontend-alertstriper';
import { selectAlleFeilmeldinger } from './feilmelding-selector';
import { selectErVeileder } from '../../moduler/identitet/identitet-selector';
import FeilmeldingDetaljer from './feilmelding-detaljer';
import { parseFeil, finnHoyesteAlvorlighetsgrad } from './feilmelding-utils';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import * as AppPT from '../../proptypes';
import Text from '../../text';

const typer = {
    [AlertStripeAdvarsel]: 1,
    [AlertStripeInfoSolid]: 2,
    [AlertStripeInfo]: 3,
};

const stripeTyper = {
    UKJENT: AlertStripeAdvarsel,
    FINNES_IKKE: AlertStripeAdvarsel,
    INGEN_TILGANG: AlertStripeInfoSolid,
    UGYLDIG_REQUEST: AlertStripeInfo,
    VERSJONSKONFLIKT: AlertStripeInfo,
};

function FeilStripe({ alertStripe, feil, erVeileder, intl }) {
    const vistekster = window.location.search.indexOf('vistekster') !== -1;
    const Stripe = alertStripe;
    const aktor = erVeileder ? 'veileder' : 'bruker';
    const typeNr = typer[alertStripe];
    const feilType = feil.type;
    const melding = feil.melding;
    const feilKategori = melding && melding.type;
    const feilKeys = parseFeil(
        `feilmelding.type${typeNr}/${feilKategori}/${aktor}/${feilType}`
            .replace('/fail', '')
            .replace('/FEILET', '')
            .split('/')
            .join('-')
            .toLowerCase()
    );
    const mostSpesificKey = feilKeys.find(
        key => intl.formatMessage({ id: key, defaultMessage: key }) !== key
    );

    return (
        <Stripe>
            <div>
                {vistekster &&
                    feilKeys.map(tekstId => {
                        let tekst = intl.formatMessage({
                            id: tekstId,
                            defaultMessage: tekstId,
                        });
                        if (tekst === tekstId) tekst = `[${tekst}]`;
                        return (
                            <div key={tekstId}>
                                {tekst}
                            </div>
                        );
                    })}
                <Text id={mostSpesificKey} hidden={vistekster} />
            </div>
        </Stripe>
    );
}

FeilStripe.defaultProps = {
    alertStripe: undefined,
    tekstIds: undefined,
    erVeileder: false,
};

FeilStripe.propTypes = {
    alertStripe: PT.func,
    feil: AppPT.feil.isRequired,
    erVeileder: PT.bool,
    intl: intlShape.isRequired,
};

class Feilmelding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        };
    }

    toggleDetaljer = () => {
        this.setState({
            apen: !this.state.apen,
        });
    };

    render() {
        const { feilmeldinger, className, erVeileder, intl } = this.props;

        const alvorligsteFeil = finnHoyesteAlvorlighetsgrad(feilmeldinger);

        return (
            <VisibleIfDiv
                visible={feilmeldinger.length > 0}
                className={classNames(className, 'feilmelding')}
            >
                <FeilStripe
                    alertStripe={
                        stripeTyper[
                            (alvorligsteFeil.melding &&
                                alvorligsteFeil.melding.type) ||
                                'UKJENT'
                        ]
                    }
                    feil={alvorligsteFeil}
                    erVeileder={erVeileder}
                    intl={intl}
                />
                <Knappelenke onClick={this.toggleDetaljer} className="">
                    Vis detaljer
                </Knappelenke>
                <VisibleIfDiv
                    visible={this.state.apen}
                    className="feilmelding__detaljer"
                >
                    {feilmeldinger.map(feilen => {
                        const id =
                            (feilen.melding && feilen.melding.id) ||
                            feilen.type;
                        const action = feilen.type;
                        const rest =
                            (feilen.melding && feilen.melding.detaljer) ||
                            feilen.melding;
                        return (
                            <FeilmeldingDetaljer
                                key={id}
                                feilId={id}
                                action={action}
                                httpStatus={feilen.httpStatus}
                                {...rest}
                            />
                        );
                    })}
                </VisibleIfDiv>
            </VisibleIfDiv>
        );
    }
}

Feilmelding.defaultProps = {
    feilmeldinger: [],
    className: undefined,
    erVeileder: false,
};

Feilmelding.propTypes = {
    intl: intlShape.isRequired,
    feilmeldinger: PT.array,
    erVeileder: PT.bool,
    className: PT.string,
};

const mapStateToProps = state => ({
    feilmeldinger: selectAlleFeilmeldinger(state),
    erVeileder: selectErVeileder(state),
});

export default connect(mapStateToProps)(injectIntl(Feilmelding));
