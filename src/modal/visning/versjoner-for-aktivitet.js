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

import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { STATUS } from '../../ducks/utils';
import {
    TRANSAKSJON_TYPE_ETIKETT_ENDRET,
    TRANSAKSJON_TYPE_STATUS_ENDRET,
    TRANSAKSJON_TYPE_AVTALT_DATO_ENDRET,
} from '../../constant';

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

class VersjonerForAktivitet extends Component {
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
        const { versjonerData, className } = this.props;
        const versjoner = versjonerData.data;

        return (
            <Innholdslaster
                avhengigheter={[versjonerData]}
                spinnerStorrelse="m"
            >
                <section className={className}>
                    {versjoner.length === 0 &&
                        versjonerData.status === STATUS.OK &&
                        <FormattedMessage id="livslopsendring.empty" />}
                    {versjoner.map((versjon, index, array) => (
                        <VersjonInnslag
                            key={versjon.endretDato}
                            versjon={versjon}
                            prevVersjon={array[index + 1]}
                        />
                    ))}
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
