import { DialogDots } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { ArenaAktivitetType } from '../../../../datatypes/arenaAktivitetTypes';
import { StillingFraNavAktivitet, VeilarbAktivitetType } from '../../../../datatypes/internAktivitetTypes';
import { loggStillingFraNavStillingslenkeKlikk } from '../../../../felles-komponenter/utils/logging';
import { selectErVeileder } from '../../../identitet/identitet-selector';
import ArenaStatusAdministrasjon from './ArenaStatusAdministrasjon';
import EksternAktivitetHandlingerKnapper from './EksternAktivitetHandlingerKnapper';
import EndreAktivitetKnapp from './EndreAktivitetKnapp';

interface Props {
    aktivitet: AlleAktiviteter;
    tillatEndring: boolean;
    laster: boolean;
    underOppfolging: boolean;
}

const SendEnMeldingKnapp = () => (
    <Button variant="secondary" icon={<DialogDots aria-hidden />}>
        Send en melding
    </Button>
);

const LesMerOmStillingenKnapp = ({ aktivitet }: { aktivitet: StillingFraNavAktivitet }) => {
    const erVeileder = useSelector(selectErVeileder);
    const stillingslenke = import.meta.env.VITE_STILLING_FRA_NAV_BASE_URL + aktivitet.stillingFraNavData.stillingsId;

    return (
        <Button
            variant="secondary"
            as="a"
            href={stillingslenke}
            onClick={() => loggStillingFraNavStillingslenkeKlikk(erVeileder)}
            target="_blank"
        >
            Les mer om stillingen
        </Button>
    );
};

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
