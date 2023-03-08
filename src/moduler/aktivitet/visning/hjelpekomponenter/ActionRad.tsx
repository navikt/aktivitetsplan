import React from 'react';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { ArenaAktivitetType } from '../../../../datatypes/arenaAktivitetTypes';
import { VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import ArenaStatusAdministrasjon from './ArenaStatusAdministrasjon';
import EksternAktivitetHandlingerKnapper from './EksternAktivitetHandlingerKnapper';
import EndreAktivitetKnapp from './EndreAktivitetKnapp';
import LesMerOmStillingenKnapp from './LesMerOmStillingenKnapp';
import SendEnMeldingKnapp from './SendEnMeldingKnapp';

interface Props {
    aktivitet: AlleAktiviteter;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

const getActions = ({ aktivitet, tillatEndring, laster, underOppfolging }: Props) => {
    switch (aktivitet.type) {
        case VeilarbAktivitetType.MOTE_TYPE:
        case VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE:
        case VeilarbAktivitetType.EGEN_AKTIVITET_TYPE:
        case VeilarbAktivitetType.IJOBB_AKTIVITET_TYPE:
        case VeilarbAktivitetType.STILLING_AKTIVITET_TYPE:
        case VeilarbAktivitetType.SOKEAVTALE_AKTIVITET_TYPE:
        case VeilarbAktivitetType.SAMTALEREFERAT_TYPE:
            return (
                <>
                    <EndreAktivitetKnapp
                        id={aktivitet.id}
                        tillatEndring={tillatEndring}
                        laster={laster}
                        underOppfolging={underOppfolging}
                    />
                    <SendEnMeldingKnapp />
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
                        underOppfolging={underOppfolging}
                    />
                    <SendEnMeldingKnapp />
                </>
            );
        case VeilarbAktivitetType.EKSTERN_AKTIVITET_TYPE:
            return (
                <>
                    <EksternAktivitetHandlingerKnapper aktivitet={aktivitet} />
                    <SendEnMeldingKnapp />
                </>
            );
        case ArenaAktivitetType.GRUPPEAKTIVITET:
        case ArenaAktivitetType.TILTAKSAKTIVITET:
        case ArenaAktivitetType.UTDANNINGSAKTIVITET:
            return (
                <>
                    <SendEnMeldingKnapp />
                    <ArenaStatusAdministrasjon />
                </>
            );
    }
};

const ActionRad = (props: Props) => {
    const actions = getActions(props);

    return <div className="my-4 gap-4 flex flex-wrap">{actions}</div>;
};

export default ActionRad;
