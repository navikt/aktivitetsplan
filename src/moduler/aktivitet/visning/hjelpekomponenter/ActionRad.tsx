import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { ArenaAktivitetType } from '../../../../datatypes/arenaAktivitetTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { useErVeileder } from '../../../../Provider';
import ArenaStatusAdministrasjon from './ArenaStatusAdministrasjon';
import EksternAktivitetHandlingerKnapper from './EksternAktivitetHandlingerKnapper';
import EndreAktivitetKnapp from './EndreAktivitetKnapp';
import LesMerOmStillingenKnapp from './LesMerOmStillingenKnapp';
import SendEnMeldingKnapp from './SendEnMeldingKnapp';
import { useSelector } from 'react-redux';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { ReadWriteMode, selectReadWriteMode } from '../../../../utils/readOrWriteModeSlice';

interface Props {
    aktivitet: AlleAktiviteter;
    tillatEndring: boolean;
    laster: boolean;
}

const getActions = ({
    aktivitet,
    tillatEndring,
    laster,
    readOnly,
    erVeileder,
}: Props & { erVeileder: boolean; readOnly: boolean }) => {
    switch (aktivitet.type) {
        case VeilarbAktivitetType.MOTE_TYPE:
        case VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE:
        case VeilarbAktivitetType.EGEN_AKTIVITET_TYPE:
        case VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE:
        case VeilarbAktivitetType.STILLING_AKTIVITET_TYPE:
        case VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE:
            return (
                <>
                    <EndreAktivitetKnapp
                        id={aktivitet.id}
                        tillatEndring={tillatEndring}
                        laster={laster}
                        readOnly={readOnly}
                    />
                    <SendEnMeldingKnapp aktivitet={aktivitet} />
                </>
            );
        case VeilarbAktivitetType.SAMTALEREFERAT_TYPE:
            return (
                <>
                    {erVeileder ? (
                        <EndreAktivitetKnapp
                            id={aktivitet.id}
                            tillatEndring={tillatEndring}
                            laster={laster}
                            readOnly={readOnly}
                        />
                    ) : null}
                    <SendEnMeldingKnapp aktivitet={aktivitet} />
                </>
            );
        case VeilarbAktivitetType.STILLING_FRA_NAV_TYPE:
            return (
                <>
                    <LesMerOmStillingenKnapp aktivitet={aktivitet} />
                    <EndreAktivitetKnapp
                        id={aktivitet.id}
                        tillatEndring={tillatEndring}
                        laster={laster}
                        readOnly={readOnly}
                    />
                    <SendEnMeldingKnapp aktivitet={aktivitet} />
                </>
            );
        case VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE:
            return (
                <>
                    <EksternAktivitetHandlingerKnapper aktivitet={aktivitet} />
                    <SendEnMeldingKnapp aktivitet={aktivitet} />
                </>
            );
        case ArenaAktivitetType.GRUPPEAKTIVITET:
        case ArenaAktivitetType.TILTAKSAKTIVITET:
        case ArenaAktivitetType.UTDANNINGSAKTIVITET:
            return (
                <>
                    <SendEnMeldingKnapp aktivitet={aktivitet} />
                    <ArenaStatusAdministrasjon />
                </>
            );
    }
};

const ActionRad = (props: Props) => {
    const erVeileder = useErVeileder();
    const readOnly = useSelector(selectReadWriteMode) == ReadWriteMode.READ;
    const actions = getActions({ ...props, erVeileder, readOnly });

    return <div className="my-4 gap-4 flex flex-wrap">{actions}</div>;
};

export default ActionRad;
