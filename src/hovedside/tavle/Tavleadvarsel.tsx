import { BodyShort, GuidePanel } from '@navikt/ds-react';
import React from 'react';

import {
    GRUPPE_AKTIVITET_TYPE,
    MOTE_TYPE,
    SAMTALEREFERAT_TYPE,
    TILTAK_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../constant';
import { AktivitetStatus, AlleAktiviteter } from '../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
import { ReactComponent as ObsSVG } from './obs.svg';

const getAdvarseltekst = (aktivitet: AlleAktiviteter, erVeileder: boolean) => {
    if (aktivitet.status === AktivitetStatus.FULLFOERT) {
        return 'Aktiviteten er fullført og kan ikke endres.';
    } else if (aktivitet.status === AktivitetStatus.AVBRUTT) {
        return 'Aktiviteten er avbrutt og kan ikke endres.';
    } else if (aktivitet.type === MOTE_TYPE) {
        return 'Du kan ikke endre status på møtet. Ta kontakt med veilederen din for å endre møtet.';
    } else if (aktivitet.type === SAMTALEREFERAT_TYPE) {
        return 'Du kan ikke endre status på samtalereferatet. Ta kontakt med veilederen din for å endre dette.';
    } else if ([UTDANNING_AKTIVITET_TYPE, GRUPPE_AKTIVITET_TYPE, TILTAK_AKTIVITET_TYPE].includes(aktivitet.type)) {
        if (erVeileder) {
            return 'For å endre aktiviteten må du gå til Arena.';
        }
        return 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.';
    } else if (aktivitet.type === VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE) {
        if (erVeileder) {
            // TODO finn bedre tekst
            return 'Denne aktiviteten er opprettet av et annet team. Ta kontakt med relevant team dersom endringer er nødvendig';
        } // TODO bedre tekst
        return 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.';
    }

    return 'Du kan ikke endre status på denne aktiviteten. Ta kontakt med veilederen din for å gjøre endringer.';
};

interface Props {
    hidden: boolean;
    draggingAktivitet: AlleAktiviteter | undefined;
    erVeileder: boolean;
}

const Tavleadvarsel = (props: Props) => {
    const { hidden, draggingAktivitet, erVeileder } = props;

    if (hidden || !draggingAktivitet) {
        return null;
    }

    return (
        <div className="fixed z-50 left-0 right-0 max-w-lg mx-auto">
            <GuidePanel illustration={<ObsSVG />} poster>
                <BodyShort>{getAdvarseltekst(draggingAktivitet, erVeileder)}</BodyShort>
            </GuidePanel>
        </div>
    );
};

export default Tavleadvarsel;
