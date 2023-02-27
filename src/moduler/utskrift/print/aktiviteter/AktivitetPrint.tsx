import { Heading } from '@navikt/ds-react';
import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { getAktivitetType } from '../../../../utils/textMappers';
import AvtaltMarkering from '../../../aktivitet/avtalt-markering/AvtaltMarkering';
import StillingEtikett from '../../../aktivitet/etikett/StillingEtikett';
import TiltakEtikett from '../../../aktivitet/etikett/TiltakEtikett';
import Aktivitetsdetaljer from '../../../aktivitet/visning/detaljer/Aktivitetsdetaljer';
import { DialogPrint } from '../dialoger';
import AktivitetReferat from './AktivitetReferat';
import ForhaandsorienteringPrint from './ForhaandsorienteringPrint';

interface Props {
    aktivitet: AlleAktiviteter;
    dialog?: Dialog;
}

const AktivitetPrint = (props: Props) => {
    const { aktivitet, dialog } = props;
    const { id, tittel } = aktivitet;
    const forhaandsorientering = aktivitet.forhaandsorientering;

    return (
        <div key={id} className="printmodal-body__statusgruppe">
            <p className="printmodal-body__statusgruppe--type">{getAktivitetType(aktivitet)}</p>
            <Heading level="2" size="medium" className="mb-4">
                {tittel}
            </Heading>
            <Aktivitetsdetaljer valgtAktivitet={aktivitet} />
            {aktivitet.type === VeilarbAktivitetType.MOTE_TYPE ||
            aktivitet.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE ? (
                <AktivitetReferat aktivitet={aktivitet} />
            ) : null}
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
