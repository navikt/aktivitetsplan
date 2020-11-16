import Tekstomrade from 'nav-frontend-tekstomrade';
import { Element, EtikettLiten, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import React from 'react';

import { Dialog } from '../../../types';
import { datoComparator, formaterDatoKortManed } from '../../../utils';

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
            <Element tag="h2" className="printmodal-body__statusgruppe--overskrift">
                Dialog
            </Element>
        );
    }

    return <Undertittel className="printmodal-body__statusgruppe--overskrift">{dialog.overskrift}</Undertittel>;
}

export function DialogPrint(props: DialogProps) {
    const { dialog } = props;

    if (!dialog) {
        return <div />;
    }

    const { henvendelser } = dialog;
    const henvendelserSynkende = henvendelser && [...henvendelser].sort((a, b) => datoComparator(a.sendt, b.sendt));

    return (
        <div hidden={!henvendelserSynkende} className="printmodal-body__dialog">
            <Tittel dialog={dialog} />
            {henvendelserSynkende &&
                henvendelserSynkende.map((h) => (
                    <div className="henvendelse" key={h.id}>
                        <EtikettLiten className="detaljfelt__tittel" tag="h2">
                            {`${avsender(h.avsender, h.avsenderId)} - ${formaterDatoKortManed(h.sendt)}`}
                        </EtikettLiten>
                        <Tekstomrade>{h.tekst}</Tekstomrade>
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
        <section className="printmodal-body__statusgrupper">
            <Systemtittel tag="h1" className="printmodal-body__statusgruppe--overskrift">
                Dialogen med veileder
            </Systemtittel>
            {sorterteDialoger.map((d) => (
                <DialogPrint key={d.id} dialog={d} />
            ))}
        </section>
    );
}
