import React, { useState } from 'react';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import {
    HiddenIfAlertStripeInfoSolid,
    HiddenIfAlertStripeSuksess,
} from '../../../../felles-komponenter/hidden-if/hidden-if-alertstriper';
import { erMerEnnSyvDagerTil } from '../../../../utils';
import ForhandsorienteringArenaAktivitetGammel from '../forhandsorientering-gammel/ForhandsorienteringArenaAktivitetGammel';
import ForhaandsorieteringsForm from './ForhaandsorienteringForm';

interface Props {
    aktivitet: Aktivitet;
    visible: boolean;
}

const ForhaandsorienteringArenaAktivitet = (props: Props) => {
    const { aktivitet, visible } = props;

    const [forhaandsorienteringSkalSendes, setForhaandsorienteringSkalSendes] = useState(true);

    if ([STATUS_FULLFOERT, STATUS_AVBRUTT].includes(aktivitet.status) || !visible) {
        return null;
    }

    const forhandsorienteringSendt = () => {
        setForhaandsorienteringSkalSendes(false);
    };

    const merEnnsyvDagerTil = erMerEnnSyvDagerTil(aktivitet.tilDato) || !aktivitet.tilDato;

    const AlertStripeHvisMindreEnnSyvDagerTil = () => (
        <HiddenIfAlertStripeInfoSolid hidden={merEnnsyvDagerTil}>
            Du kan ikke sende forhåndsorientering fordi sluttdatoen er satt til mindre enn 7 dager fram i tid.
        </HiddenIfAlertStripeInfoSolid>
    );

    const AlertStripeVisBekreftelse = () => (
        <HiddenIfAlertStripeSuksess hidden={forhaandsorienteringSkalSendes}>
            Forhåndsorientering er sendt.
        </HiddenIfAlertStripeSuksess>
    );

    return (
        <div className="aktivitetvisning__underseksjon">
            <AlertStripeHvisMindreEnnSyvDagerTil />
            <ForhaandsorieteringsForm
                valgtAktivitet={aktivitet}
                visible={merEnnsyvDagerTil && forhaandsorienteringSkalSendes}
                forhandsorienteringSendt={forhandsorienteringSendt}
            />
            <AlertStripeVisBekreftelse />
        </div>
    );
};

const ForhaandsorienteringArenaAktivitetWrapper = (props: Props) => {
    const brukeNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();
    return brukeNyForhaandsorientering ? (
        <ForhaandsorienteringArenaAktivitet {...props} />
    ) : (
        <ForhandsorienteringArenaAktivitetGammel {...props} />
    );
};

export default ForhaandsorienteringArenaAktivitetWrapper;
