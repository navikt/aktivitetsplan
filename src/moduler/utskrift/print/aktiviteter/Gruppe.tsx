import { Systemtittel } from 'nav-frontend-typografi';
import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import { compareAktivitet } from '../../../aktivitet/aktivitet-util';
import AktivitetPrint from './AktivitetPrint';

interface Props {
    tittel: string;
    aktiviteter?: Aktivitet[];
    dialoger?: Dialog[];
}

const Gruppe = (props: Props) => {
    const { tittel, aktiviteter, dialoger } = props;

    if (!aktiviteter) {
        return null;
    }

    return (
        <section className="printmodal-body__statusgrupper">
            <Systemtittel tag="h1" className="printmodal-body__statusgruppe--overskrift">
                {tittel}
            </Systemtittel>
            {aktiviteter.sort(compareAktivitet).map((aktivitet) => {
                const dialogForAktivitet = dialoger && dialoger.find((d) => d.aktivitetId === aktivitet.id);
                return <AktivitetPrint aktivitet={aktivitet} key={aktivitet.id} dialog={dialogForAktivitet} />;
            })}
        </section>
    );
};

export default Gruppe;
