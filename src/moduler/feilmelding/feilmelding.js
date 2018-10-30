import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import classNames from 'classnames';
import { injectIntl, intlShape } from 'react-intl';
import {
    AlertStripeNavAnsatt,
    AlertStripeInfo,
    AlertStripeInfoSolid,
} from 'nav-frontend-alertstriper';
import {
    selectErVeileder,
    selectIdentitetFeilMelding,
} from '../../moduler/identitet/identitet-selector';
import FeilmeldingDetaljer from './feilmelding-detaljer';
import {
    parseFeil,
    finnHoyesteAlvorlighetsgrad,
    UKJENT_KATEGORI,
    FINNES_IKKE_KATEGORI,
    INGEN_TILGANG_KATEGORI,
    UGYLDIG_REQUEST_KATEGORI,
    VERSJONSKONFLIKT_KATEGORI,
    KATEGORI_RANGERING,
} from './feilmelding-utils';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Knappelenke from '../../felles-komponenter/utils/knappelenke';
import * as AppPT from '../../proptypes';
import { FailsafeText } from '../../text';
import { selectOppfolgingFeilmeldinger } from '../oppfolging-status/oppfolging-selector';
import { selectAktivitetListeFeilMelding } from '../aktivitet/aktivitetliste-selector';
import { selectArenaAktivitetStatus } from '../aktivitet/arena-aktivitet-selector';
import { selectAktivitetStatus } from '../aktivitet/aktivitet-selector';
import { STATUS } from '../../ducks/utils';

const stripeTyper = {
    [UKJENT_KATEGORI]: AlertStripeNavAnsatt,
    [FINNES_IKKE_KATEGORI]: AlertStripeNavAnsatt,
    [INGEN_TILGANG_KATEGORI]: AlertStripeInfoSolid,
    [UGYLDIG_REQUEST_KATEGORI]: AlertStripeInfo,
    [VERSJONSKONFLIKT_KATEGORI]: AlertStripeInfo,
};

function FeilStripe({ feil, erVeileder, intl, erArenaFeil }) {
    const vistekster = window.location.search.indexOf('vistekster') !== -1;
    const aktor = erVeileder ? 'veileder' : 'bruker';
    const feilType = feil.type;
    const melding = feil.melding;
    const feilKategori = (melding && melding.type) || UKJENT_KATEGORI;
    const Stripe =
        (erArenaFeil && AlertStripeInfoSolid) || stripeTyper[feilKategori];
    const typeNr = KATEGORI_RANGERING[feilKategori] || 1;

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
                <FailsafeText id={mostSpesificKey} hidden={vistekster} />
            </div>
        </Stripe>
    );
}

FeilStripe.defaultProps = {
    tekstIds: undefined,
    erVeileder: false,
    erArenaFeil: false,
};

FeilStripe.propTypes = {
    feil: AppPT.feil.isRequired,
    erVeileder: PT.bool,
    intl: intlShape.isRequired,
    erArenaFeil: PT.bool,
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
        const {
            feilmeldinger,
            className,
            erVeileder,
            intl,
            viktigeFeil,
            erArenaFeil,
        } = this.props;

        const feil = feilmeldinger || viktigeFeil;

        const alvorligsteFeil = finnHoyesteAlvorlighetsgrad(feil);

        return (
            <VisibleIfDiv
                visible={feil.length > 0}
                className={classNames(className, 'feilmelding')}
            >
                <FeilStripe
                    feil={alvorligsteFeil}
                    erVeileder={erVeileder}
                    intl={intl}
                    erArenaFeil={erArenaFeil}
                />
                <Knappelenke onClick={this.toggleDetaljer} className="">
                    <span>Vis detaljer</span>
                </Knappelenke>
                <VisibleIfDiv
                    visible={this.state.apen}
                    className="feilmelding__detaljer"
                >
                    {feil.map(feilen => {
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
    feilmeldinger: undefined,
    viktigeFeil: [],
    className: undefined,
    erVeileder: false,
    erArenaFeil: false,
};

Feilmelding.propTypes = {
    intl: intlShape.isRequired,
    feilmeldinger: PT.array,
    erVeileder: PT.bool,
    className: PT.string,
    viktigeFeil: PT.array,
    erArenaFeil: PT.bool,
};

const mapStateToProps = state => {
    const oppfolgingFeilmeldinger = selectOppfolgingFeilmeldinger(state);
    const identitetFeilmeldinger = selectIdentitetFeilMelding(state);
    const feiliArenaOgAktivitet = selectAktivitetListeFeilMelding(state);
    const erArenaFeil =
        selectArenaAktivitetStatus(state) === STATUS.ERROR &&
        selectAktivitetStatus(state) === STATUS.OK;
    return {
        erVeileder: selectErVeileder(state),
        viktigeFeil: oppfolgingFeilmeldinger.concat(
            identitetFeilmeldinger,
            feiliArenaOgAktivitet
        ),
        erArenaFeil,
    };
};

export default connect(mapStateToProps)(injectIntl(Feilmelding));
