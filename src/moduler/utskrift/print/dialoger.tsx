import React from 'react';
import { Element, EtikettLiten } from 'nav-frontend-typografi';

import { datoComparator, formaterDatoKortManed } from '../../../utils';
import { Dialog } from '../../../types';
import Tekstomrade from 'nav-frontend-tekstomrade';

interface DialogProps {
    dialog?: Dialog;
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
                            {`${h.avsender === 'VEILEDER' ? h.avsenderId : 'BRUKER'} - ${formaterDatoKortManed(
                                h.sendt
                            )}`}
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

    if (!dialogerUtenAktivitet) {
        return null;
    }

    return (
        <section className="printmodal-body__statusgrupper">
            {dialogerUtenAktivitet.map((d) => (
                <DialogPrint dialog={d} />
            ))}
        </section>
    );
}
