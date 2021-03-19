import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';
import { useSelector } from 'react-redux';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import { useSkalBrukeNyForhaandsorientering } from '../../../../felles-komponenter/feature/feature';
import {
    selectErBrukerManuell,
    selectErUnderKvp,
    selectReservasjonKRR,
} from '../../../oppfolging-status/oppfolging-selector';
import { selectNivaa4 } from '../../../tilgang/tilgang-selector';
import DeleLinje from '../delelinje/delelinje';
import ForhandsorienteringArenaAktivitetGammel from '../forhandsorientering-gammel/ForhandsorienteringArenaAktivitetGammel';

interface Props {
    erBruker: boolean;
    aktivitet: Aktivitet;
}

const ArenaStatusAdministrasjon = (props: Props) => {
    const { erBruker, aktivitet } = props;
    const brukeNyForhaandsorientering = useSkalBrukeNyForhaandsorientering();

    const erManuellBruker = useSelector(selectErBrukerManuell);
    const erUnderKvp = useSelector(selectErUnderKvp);
    const erReservertKrr = useSelector(selectReservasjonKRR);
    const harNivaa4 = useSelector(selectNivaa4);

    const kanVarsles = erManuellBruker || erUnderKvp || erReservertKrr || !harNivaa4;

    const kanSendeForhaandsorientering = !erBruker && !kanVarsles && !aktivitet.forhaandsorientering;

    const alertTekst = erBruker
        ? 'Du kan ikke endre denne aktiviteten selv. Send en melding til veilederen din hvis aktiviteten skal endres.'
        : 'For å endre aktiviteten må du gå til Arena.';

    return (
        <>
            <div className="aktivitetvisning__underseksjon">
                <AlertStripeInfo>{alertTekst}</AlertStripeInfo>
            </div>
            <DeleLinje />
            {!brukeNyForhaandsorientering && (
                <ForhandsorienteringArenaAktivitetGammel visible={kanSendeForhaandsorientering} aktivitet={aktivitet} />
            )}
        </>
    );
};

export default ArenaStatusAdministrasjon;
