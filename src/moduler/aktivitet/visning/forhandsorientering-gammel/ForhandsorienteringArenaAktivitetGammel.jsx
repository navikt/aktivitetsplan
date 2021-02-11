import React, { Component } from 'react';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import {
    HiddenIfAlertStripeInfoSolid,
    HiddenIfAlertStripeSuksess,
} from '../../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import visibleIfHOC from '../../../../hocs/visible-if';
import * as AppPT from '../../../../proptypes';
import { autobind, erMerEnnSyvDagerTil } from '../../../../utils';
import ForhandsorienteringArenaAktivitetForm from './ForhandsorienteringForm';

class ForhandsorienteringArenaAktivitetGammel extends Component {
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
            <div className="aktivitetvisning__underseksjon">
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

ForhandsorienteringArenaAktivitetGammel.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

export default visibleIfHOC(ForhandsorienteringArenaAktivitetGammel);
