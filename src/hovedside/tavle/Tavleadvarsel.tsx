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
import { EksternAktivitetType, VeilarbAktivitetType } from '../../datatypes/internAktivitetTypes';
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
            switch (aktivitet.eksternAktivitet.type) {
                case EksternAktivitetType.ARENA_TILTAK_TYPE:
                    return 'For å endre aktiviteten må du gå til Arena.';
                case EksternAktivitetType.MIDL_LONNSTILSKUDD_TYPE:
                case EksternAktivitetType.VARIG_LONNSTILSKUDD_TYPE:
                    return 'Denne aktiviteten kan ikke endres fra aktivitetsplanen. Gå til avtalen for å endre status';
            }
        }
        return 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.';
    }
    return 'Du kan ikke endre status på denne aktiviteten. Ta kontakt med veilederen din for å gjøre endringer.';
};

interface Props {
    hidden: boolean;
    draggingAktivitet: AlleAktiviteter | undefined;
    erVeileder: boolean;
}

export const Tavleadvarsel = (props: Props) => {
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
