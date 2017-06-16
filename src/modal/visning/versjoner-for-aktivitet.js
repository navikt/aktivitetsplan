import React, { Component } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import {
    hentVersjonerForAktivtet,
    fjernVersjoner,
} from '../../ducks/aktivitet-versjoner';
import * as AppPT from '../../proptypes';
import {
    formaterDatoDatoEllerTidSiden,
    formaterDatoKortManed,
} from '../../utils';
import visibleIfHOC from '../../hocs/visible-if';
import VisibleIfDiv from '../../felles-komponenter/utils/visible-if-div';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import {
    TRANSAKSJON_TYPE_ETIKETT_ENDRET,
    TRANSAKSJON_TYPE_STATUS_ENDRET,
    TRANSAKSJON_TYPE_AVTALT_DATO_ENDRET,
} from '../../constant';
import Accordian from '../../felles-komponenter/accordion';

function VersjonInnslag({ versjon, prevVersjon }) {
    function endringsTekst() {
        switch (versjon.transaksjonsType) {
            case TRANSAKSJON_TYPE_STATUS_ENDRET: {
                return (
                    <FormattedMessage
                        id={`endringstype.${versjon.transaksjonsType}`}
                        values={{
                            fra: prevVersjon.status,
                            til: versjon.status,
                        }}
                    />
                );
            }
            case TRANSAKSJON_TYPE_AVTALT_DATO_ENDRET: {
                return (
                    <FormattedMessage
                        id={`endringstype.${versjon.transaksjonsType}`}
                        values={{
                            fra: formaterDatoKortManed(prevVersjon.tilDato),
                            til: formaterDatoKortManed(versjon.tilDato),
                        }}
                    />
                );
            }
            case TRANSAKSJON_TYPE_ETIKETT_ENDRET: {
                return (
                    <FormattedMessage
                        id={`endringstype.${versjon.transaksjonsType}`}
                        values={{
                            til: versjon.etikett ? versjon.etikett : 'INGEN',
                        }}
                    />
                );
            }
            default: {
                return (
                    <FormattedMessage
                        id={`endringstype.${versjon.transaksjonsType}`}
                    />
                );
            }
        }
    }

    return (
        <p className="versjon-for-aktivitet__innslag">
            <b><FormattedMessage id={`lagtInnAv.${versjon.lagtInnAv}`} /> </b>
            {endringsTekst()}
            <br />
            {formaterDatoDatoEllerTidSiden(versjon.endretDato)}
        </p>
    );
}

VersjonInnslag.propTypes = {
    versjon: AppPT.aktivitet.isRequired,
    prevVersjon: AppPT.aktivitet,
};

VersjonInnslag.defaultProps = {
    prevVersjon: undefined,
};

const MAX_SIZE = 10;

class VersjonerForAktivitet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            apen: false,
        };
    }

    componentWillMount() {
        const {
            doFjernVersjoner,
            doHentVersjonerForAktivitet,
            aktivitet,
        } = this.props;
        doFjernVersjoner();
        doHentVersjonerForAktivitet(aktivitet);
    }
    componentWillUnmount() {
        this.props.doFjernVersjoner();
    }

    render() {
        const onClick = () => {
            this.setState({ apen: !this.state.apen });
        };

        const { versjonerData, className } = this.props;
        const versjoner = versjonerData.data;

        return (
            <Innholdslaster
                avhengigheter={[versjonerData]}
                spinnerStorrelse="m"
            >
                <section className={className}>
                    {versjoner
                        .slice(0, MAX_SIZE)
                        .map((versjon, index) => (
                            <VersjonInnslag
                                key={versjon.endretDato}
                                versjon={versjon}
                                prevVersjon={versjoner[index + 1]}
                            />
                        ))}
                    <VisibleIfDiv visible={versjoner.length > MAX_SIZE}>
                        <Accordian
                            onClick={onClick}
                            labelId={
                                this.state.apen
                                    ? 'endringer.skjul'
                                    : 'endringer.vis-mer'
                            }
                        >
                            {versjoner
                                .slice(MAX_SIZE)
                                .map((versjon, index) => (
                                    <VersjonInnslag
                                        key={versjon.endretDato}
                                        versjon={versjon}
                                        prevVersjon={versjoner[index + 1]}
                                    />
                                ))}
                        </Accordian>
                    </VisibleIfDiv>
                </section>
            </Innholdslaster>
        );
    }
}

VersjonerForAktivitet.propTypes = {
    versjonerData: AppPT.reducer,
    aktivitet: AppPT.aktivitet.isRequired,
    doHentVersjonerForAktivitet: PT.func.isRequired,
    doFjernVersjoner: PT.func.isRequired,
    className: PT.string,
};

VersjonerForAktivitet.defaultProps = {
    versjoner: undefined,
    className: '',
};

const mapStateToProps = state => ({
    versjonerData: state.data.versjoner,
});

const mapDispatchToProps = dispatch => ({
    doHentVersjonerForAktivitet: aktivitet =>
        hentVersjonerForAktivtet(aktivitet)(dispatch),
    doFjernVersjoner: () => fjernVersjoner()(dispatch),
});

export default visibleIfHOC(
    connect(mapStateToProps, mapDispatchToProps)(VersjonerForAktivitet)
);
