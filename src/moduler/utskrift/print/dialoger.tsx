import React from 'react';
import { Element, EtikettLiten, Undertittel } from 'nav-frontend-typografi';

import { datoComparator, formaterDatoKortManed } from '../../../utils';
import { Dialog } from '../../../types';
import Tekstomrade from 'nav-frontend-tekstomrade';

interface DialogProps {
    dialog?: Dialog;
}

function avsender(avsenderType: string, avsenderId?: string) {
    if (avsenderType === 'VEILEDER') {
        return avsenderId ? avsenderId : 'NAV';
    }

    return 'BRUKER';
}

export function DialogPrint(props: DialogProps) {
    const { dialog } = props;

    if (!dialog) {
        return <div />;
    }

    const { henvendelser } = dialog;
    const henvendelserSynkende = henvendelser && [...henvendelser].sort((a, b) => datoComparator(b.sendt, a.sendt));

    const overskrift = dialog.aktivitetId === null ? dialog.overskrift : 'Dialog';

    return (
        <div hidden={!henvendelserSynkende} className="printmodal-body__dialog">
            <Element tag="h2" className="printmodal-body__statusgruppe--overskrift">
                {overskrift}
            </Element>
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

    return (
        <section className="printmodal-body__statusgrupper">
            <Undertittel tag="h1" className="printmodal-body__statusgruppe--overskrift">
                Dialogen med veileder
            </Undertittel>
            {dialogerUtenAktivitet.map((d) => (
                <DialogPrint dialog={d} />
            ))}
        </section>
    );
}
