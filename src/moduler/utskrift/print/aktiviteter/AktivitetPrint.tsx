import { Undertittel } from 'nav-frontend-typografi';
import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import { aktivitetTypeMap } from '../../../../utils/textMappers';
import AvtaltMarkering from '../../../aktivitet/avtalt-markering/AvtaltMarkering';
import StillingEtikett from '../../../aktivitet/etikett/StillingEtikett';
import TiltakEtikett from '../../../aktivitet/etikett/TiltakEtikett';
import Aktivitetsdetaljer from '../../../aktivitet/visning/detaljer/aktivitetsdetaljer';
import { DialogPrint } from '../dialoger';
import AktivitetReferat from './AktivitetReferat';
import ForhaandsorienteringPrint from './ForhaandsorienteringPrint';

interface Props {
    aktivitet: Aktivitet;
    dialog?: Dialog;
}

const AktivitetPrint = (props: Props) => {
    const { aktivitet, dialog } = props;
    const { id, type, tittel } = aktivitet;
    const forhaandsorientering = aktivitet.forhaandsorientering;

    return (
        <div key={id} className="printmodal-body__statusgruppe">
            <p className="printmodal-body__statusgruppe--type">{aktivitetTypeMap[type]}</p>
            <Undertittel tag="h2" className="printmodal-body__statusgruppe--overskrift">
                {tittel}
            </Undertittel>
            <Aktivitetsdetaljer valgtAktivitet={aktivitet} key={id} />
            <AktivitetReferat aktivitet={aktivitet} />
            <AvtaltMarkering hidden={!aktivitet.avtalt} className="etikett-print" />
            <ForhaandsorienteringPrint
                forhaandsorienteringTekst={forhaandsorientering?.tekst}
                forhaandsorienteringLest={forhaandsorientering?.lestDato}
            />
            <StillingEtikett aktivitet={aktivitet} className="etikett-print" />
            <TiltakEtikett aktivitet={aktivitet} className="etikett-print" />
            <DialogPrint dialog={dialog} />
        </div>
    );
};

export default AktivitetPrint;
