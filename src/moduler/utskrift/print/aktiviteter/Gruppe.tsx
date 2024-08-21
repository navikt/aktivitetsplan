import { Heading } from '@navikt/ds-react';
import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import { compareAktivitet } from '../../../aktivitet/aktivitet-util';
import AktivitetPrint from './AktivitetPrint';

interface Props {
    tittel: string;
    aktiviteter?: AlleAktiviteter[];
    dialoger?: Dialog[];
}

const Gruppe = (props: Props) => {
    const { tittel, aktiviteter, dialoger } = props;

    if (!aktiviteter) {
        return null;
    }

    const sorterteAktiviteter = [...aktiviteter].sort(compareAktivitet);

    return (
        <section className="mt-12">
            <Heading level="2" size="large" className="mb-2">
                {tittel}
            </Heading>
            <div className="space-y-4">
                {sorterteAktiviteter.map((aktivitet) => {
                    const dialogForAktivitet = dialoger && dialoger.find((d) => d.aktivitetId === aktivitet.id);
                    return <AktivitetPrint aktivitet={aktivitet} key={aktivitet.id} dialog={dialogForAktivitet} />;
                })}
            </div>
        </section>
    );
};

export default Gruppe;
