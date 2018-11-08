import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { autobind, erMerEnnSyvDagerTil } from '../../../../utils';
import * as AppPT from '../../../../proptypes';
import ForhandsorienteringArenaAktivitetForm from './forhandsorientering-form';
import {
    HiddenIfAlertStripeInfoSolid,
    HiddenIfAlertStripeSuksess,
} from '../../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import visibleIfHOC from '../../../../hocs/visible-if';

class ForhandsorienteringArenaAktivitet extends Component {
    constructor() {
        super();
        this.state = { forhandsorienteringSkalSendes: true };
        autobind(this);
    }

    forhandsorienteringSendt() {
        this.setState({ forhandsorienteringSkalSendes: false });
    }

    render() {
        if (
            [STATUS_FULLFOERT, STATUS_AVBRUTT].includes(
                this.props.valgtAktivitet.status
            )
        ) {
            return null;
        }

        const merEnnsyvDagerTil =
            erMerEnnSyvDagerTil(this.props.valgtAktivitet.tilDato) ||
            !this.props.valgtAktivitet.tilDato;

        const AlertStripeHvisMindreEnnSyvDagerTil = () =>
            <HiddenIfAlertStripeInfoSolid hidden={merEnnsyvDagerTil}>
                <FormattedMessage id="forhandsorientering.arenaaktivitet.mindre-enn-syv-dager" />
            </HiddenIfAlertStripeInfoSolid>;

        const AlertStripeVisBekreftelse = () =>
            <HiddenIfAlertStripeSuksess
                hidden={this.state.forhandsorienteringSkalSendes}
            >
                <FormattedMessage id="forhandsorienterin.arenaaktivitet.er-sendt" />
            </HiddenIfAlertStripeSuksess>;
        return (
            <div>
                <AlertStripeHvisMindreEnnSyvDagerTil />
                <ForhandsorienteringArenaAktivitetForm
                    valgtAktivitet={this.props.valgtAktivitet}
                    visible={
                        merEnnsyvDagerTil &&
                        this.state.forhandsorienteringSkalSendes
                    }
                    forhandsorienteringSendt={this.forhandsorienteringSendt}
                />
                <AlertStripeVisBekreftelse />
            </div>
        );
    }
}

ForhandsorienteringArenaAktivitet.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
};

export default visibleIfHOC(ForhandsorienteringArenaAktivitet);
