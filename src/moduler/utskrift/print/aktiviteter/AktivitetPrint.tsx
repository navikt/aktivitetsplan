import { Detail, Heading } from '@navikt/ds-react';
import React from 'react';

import { STILLING_AKTIVITET_TYPE } from '../../../../constant';
import { AlleAktiviteter, isArenaAktivitet } from '../../../../datatypes/aktivitetTypes';
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
        <div key={id} className="p-4 border rounded-md print:break-inside-avoid-page">
            <Detail className="uppercase">{getAktivitetType(aktivitet)}</Detail>
            <Heading level="2" size="medium" className="mb-4">
                {tittel}
            </Heading>
            <Aktivitetsdetaljer valgtAktivitet={aktivitet} />
            {aktivitet.type === VeilarbAktivitetType.MOTE_TYPE ||
            aktivitet.type === VeilarbAktivitetType.SAMTALEREFERAT_TYPE ? (
                <AktivitetReferat aktivitet={aktivitet} />
            ) : null}
            <AvtaltMarkering hidden={!aktivitet.avtalt} />
            <ForhaandsorienteringPrint
                forhaandsorienteringTekst={forhaandsorientering?.tekst}
                forhaandsorienteringLest={forhaandsorientering?.lestDato}
            />
            {aktivitet.type === STILLING_AKTIVITET_TYPE ? <StillingEtikett aktivitet={aktivitet} /> : null}
            {isArenaAktivitet(aktivitet) ? <TiltakEtikett aktivitet={aktivitet} /> : null}
            <DialogPrint dialog={dialog} />
        </div>
    );
};

export default AktivitetPrint;
