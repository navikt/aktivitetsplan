import React, { Component } from 'react';
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
        const { aktivitet } = this.props;
        const { forhandsorienteringSkalSendes } = this.state;
        if ([STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status)) {
            return null;
        }

        const merEnnsyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato) || !aktivitet.tilDato;

        const AlertStripeHvisMindreEnnSyvDagerTil = () => (
            <HiddenIfAlertStripeInfoSolid hidden={merEnnsyvDagerTil}>
                Du kan ikke sende forhåndsorientering fordi sluttdatoen er satt til mindre enn 7 dager fram i tid.
            </HiddenIfAlertStripeInfoSolid>
        );

        const AlertStripeVisBekreftelse = () => (
            <HiddenIfAlertStripeSuksess hidden={forhandsorienteringSkalSendes}>
                Forhåndsorientering er sendt.
            </HiddenIfAlertStripeSuksess>
        );
        return (
            <div>
                <AlertStripeHvisMindreEnnSyvDagerTil />
                <ForhandsorienteringArenaAktivitetForm
                    valgtAktivitet={aktivitet}
                    visible={merEnnsyvDagerTil && forhandsorienteringSkalSendes}
                    forhandsorienteringSendt={this.forhandsorienteringSendt}
                />
                <AlertStripeVisBekreftelse />
            </div>
        );
    }
}

ForhandsorienteringArenaAktivitet.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default visibleIfHOC(ForhandsorienteringArenaAktivitet);
