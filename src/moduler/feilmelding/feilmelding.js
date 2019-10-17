import React, { Component } from 'react';
import PT from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from 'react-intl';
import { AlertStripeInfo, AlertStripeFeil } from 'nav-frontend-alertstriper';
import FeilmeldingDetaljer from './feilmelding-detaljer';
import {
    FINNES_IKKE_KATEGORI,
    finnHoyesteAlvorlighetsgrad,
    INGEN_TILGANG_KATEGORI,
    KATEGORI_RANGERING,
    parseFeil,
    UGYLDIG_REQUEST_KATEGORI,
    UKJENT_KATEGORI,
    UNAUTHORIZED_KATEGORI,
    VERSJONSKONFLIKT_KATEGORI
} from './feilmelding-utils';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import * as AppPT from '../../proptypes';
import FailsafeText from '../../failsafeText';

const stripeTyper = {
    [UKJENT_KATEGORI]: AlertStripeFeil,
    [FINNES_IKKE_KATEGORI]: AlertStripeFeil,
    [UNAUTHORIZED_KATEGORI]: AlertStripeFeil,
    [INGEN_TILGANG_KATEGORI]: AlertStripeInfo,
    [UGYLDIG_REQUEST_KATEGORI]: AlertStripeInfo,
    [VERSJONSKONFLIKT_KATEGORI]: AlertStripeInfo
};

function FeilStripe({ feil, erVeileder, intl, erArenaFeil }) {
    const aktor = erVeileder ? 'veileder' : 'bruker';
    const feilType = feil.type;
    const { melding } = feil;
    const unauthorized = feil.httpStatus === 401;
    const feilKategori = unauthorized ? UNAUTHORIZED_KATEGORI : (melding && melding.type) || UKJENT_KATEGORI;
    const Stripe = (erArenaFeil && AlertStripeInfo) || stripeTyper[feilKategori];
    const typeNr = KATEGORI_RANGERING[feilKategori] || 1;

    const feilKeys = parseFeil(
        `feilmelding.type${typeNr}/${feilKategori}/${aktor}/${feilType}`
            .replace('/fail', '')
            .replace('/FEILET', '')
            .split('/')
            .join('-')
            .toLowerCase()
    );
    const mostSpesificKey = feilKeys.find(key => intl.formatMessage({ id: key, defaultMessage: key }) !== key);

    return (
        <Stripe>
            <div>
                <FailsafeText id={mostSpesificKey} visTekstVedFeil />
            </div>
        </Stripe>
    );
}

FeilStripe.defaultProps = {
    erVeileder: false,
    erArenaFeil: false
};

FeilStripe.propTypes = {
    feil: AppPT.feil.isRequired,
    erVeileder: PT.bool,
    intl: intlShape.isRequired,
    erArenaFeil: PT.bool
};

class Feilmelding extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false
        };
    }

    toggleDetaljer = () => {
        const { apen } = this.state;
        this.setState({
            apen: !apen
        });
    };

    render() {
        const { feilmeldinger, className, erVeileder, intl, erArenaFeil } = this.props;

        const { apen } = this.state;

        const alvorligsteFeil = finnHoyesteAlvorlighetsgrad(feilmeldinger);
        return (
            <VisibleIfDiv visible={feilmeldinger.length > 0} className={classNames(className, 'feilmelding')}>
                <FeilStripe feil={alvorligsteFeil} erVeileder={erVeileder} intl={intl} erArenaFeil={erArenaFeil} />
                <Knappelenke onClick={this.toggleDetaljer} className="">
                    <span>Vis detaljer</span>
                </Knappelenke>
                <VisibleIfDiv visible={apen} className="feilmelding__detaljer">
                    {feilmeldinger.map(feilen => {
                        const id = (feilen.melding && feilen.melding.id) || feilen.type;
                        const action = feilen.type;
                        const rest = (feilen.melding && feilen.melding.detaljer) || feilen.melding;
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
    erArenaFeil: false
};

Feilmelding.propTypes = {
    intl: intlShape.isRequired,
    feilmeldinger: PT.array,
    erVeileder: PT.bool,
    erArenaFeil: PT.bool,
    className: PT.string
};

export default injectIntl(Feilmelding);
