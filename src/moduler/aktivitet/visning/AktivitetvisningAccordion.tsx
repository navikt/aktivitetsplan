import { Accordion } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { ArenaAktivitetType } from '../../../datatypes/arenaAktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import { selectErVeileder } from '../../identitet/identitet-selector';
import OppdaterAktivitetEtikett from './etikett-oppdatering/OppdaterAktivitetEtikett';
import OppdaterSoknadsstatus from './soknadsstatus-oppdatering/OppdaterSoknadsstatus';
import OppdaterAktivitetStatus from './status-oppdatering/OppdaterAktivitetStatus';
import EndringsLogg from './underelement-for-aktivitet/EndringsLogg';

interface Props {
    aktivitet: AlleAktiviteter;
}

const getAccordionItems = (aktivitet: AlleAktiviteter) => {
    const erVeileder = useSelector(selectErVeileder);

    switch (aktivitet.type) {
        case VeilarbAktivitetType.STILLING_AKTIVITET_TYPE:
            return (
                <>
                    <OppdaterAktivitetEtikett aktivitet={aktivitet} />
                    <OppdaterAktivitetStatus aktivitet={aktivitet} />
                    <EndringsLogg aktivitet={aktivitet} />
                </>
            );
        case VeilarbAktivitetType.STILLING_FRA_NAV_TYPE:
            return (
                <>
                    {aktivitet.stillingFraNavData.cvKanDelesData?.kanDeles ? (
                        <OppdaterSoknadsstatus aktivitet={aktivitet} />
                    ) : null}
                    <OppdaterAktivitetStatus aktivitet={aktivitet} />
                    <EndringsLogg aktivitet={aktivitet} />
                </>
            );
        case VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE:
        case VeilarbAktivitetType.EGEN_AKTIVITET_TYPE:
        case VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE:
        case VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE:
            return (
                <>
                    <OppdaterAktivitetStatus aktivitet={aktivitet} />
                    <EndringsLogg aktivitet={aktivitet} />
                </>
            );
        case VeilarbAktivitetType.MOTE_TYPE:
        case VeilarbAktivitetType.SAMTALEREFERAT_TYPE:
            return (
                <>
                    {erVeileder ? <OppdaterAktivitetStatus aktivitet={aktivitet} /> : null}
                    <EndringsLogg aktivitet={aktivitet} />
                </>
            );
        case VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE:
            return <EndringsLogg aktivitet={aktivitet} />;
        case ArenaAktivitetType.GRUPPEAKTIVITET:
        case ArenaAktivitetType.TILTAKSAKTIVITET:
        case ArenaAktivitetType.UTDANNINGSAKTIVITET:
            return undefined;
    }
};

const AktivitetvisningAccordion = ({ aktivitet }: Props) => {
    const accordionItems = getAccordionItems(aktivitet);
    if (!accordionItems) return null;

    return <Accordion>{accordionItems}</Accordion>;
};

export default AktivitetvisningAccordion;
