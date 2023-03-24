import { Heading, Label } from '@navikt/ds-react';
import React from 'react';

import { Dialog } from '../../../datatypes/dialogTypes';
import { datoComparator, formaterDatoKortManed } from '../../../utils/dateUtils';
import CustomBodyLong from '../../aktivitet/visning/hjelpekomponenter/CustomBodyLong';

interface DialogProps {
    dialog?: Dialog;
}

function avsender(avsenderType: string, avsenderId?: string) {
    if (avsenderType === 'VEILEDER') {
        return avsenderId ? avsenderId : 'NAV';
    }

    return 'BRUKER';
}

function Tittel(props: { dialog: Dialog }) {
    const dialog = props.dialog;
    if (dialog.aktivitetId) {
        return (
            <Heading level="2" size="medium" className="printmodal-body__statusgruppe--overskrift">
                Dialog
            </Heading>
        );
    }

    return (
        <Heading level="2" size="small" className="printmodal-body__statusgruppe--overskrift">
            {dialog.overskrift}
        </Heading>
    );
}

export function DialogPrint(props: DialogProps) {
    const { dialog } = props;

    if (!dialog) {
        return <div />;
    }

    const { henvendelser } = dialog;
    const henvendelserSynkende = henvendelser && [...henvendelser].sort((a, b) => datoComparator(a.sendt, b.sendt));

    return (
        <div hidden={!henvendelserSynkende} className="mt-4 pt-4 border-t border-border-divider">
            <Tittel dialog={dialog} />
            {henvendelserSynkende &&
                henvendelserSynkende.map((h) => (
                    <div className="my-4" key={h.id}>
                        <Label className="">{`${avsender(h.avsender, h.avsenderId)} - ${formaterDatoKortManed(
                            h.sendt
                        )}`}</Label>
                        <CustomBodyLong formatLinebreaks formatLinks>
                            {h.tekst}
                        </CustomBodyLong>
                    </div>
                ))}
        </div>
    );
}

interface DialogerUtenAktivitetProps {
    dialoger?: Dialog[];
}

export function DialogerUtenAktivitet(props: DialogerUtenAktivitetProps) {
    const { dialoger } = props;
    const dialogerUtenAktivitet = dialoger && dialoger.filter((a) => a.aktivitetId === null);

    if (!dialogerUtenAktivitet || dialogerUtenAktivitet.length === 0) {
        return null;
    }

    const sorterteDialoger = dialogerUtenAktivitet.sort((a, b) => datoComparator(a.opprettetDato, b.opprettetDato));

    return (
        <section className="mt-10">
            <Heading level="1" size="large" className="mb-2">
                Dialogen med veileder
            </Heading>
            {sorterteDialoger.map((d) => (
                <DialogPrint key={d.id} dialog={d} />
            ))}
        </section>
    );
}
