import { AlertStripeInfo } from 'nav-frontend-alertstriper';
import React from 'react';

import { Aktivitet } from '../../../../datatypes/aktivitetTypes';
import DeleLinje from '../delelinje/delelinje';
import ForhaandsorienteringArenaAktivitetWrapper from '../forhaandsorientering/ForhaandsorienteringArenaAktivitet';

interface Props {
    erBruker: boolean;
    kanVarsles: boolean;
    aktivitet: Aktivitet;
}

const ArenaStatusAdministrasjon = (props: Props) => {
    const { erBruker, kanVarsles, aktivitet } = props;

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
            <ForhaandsorienteringArenaAktivitetWrapper
                kanSendeForhaandsorientering={kanSendeForhaandsorientering}
                aktivitet={aktivitet}
            />
        </>
    );
};

export default ArenaStatusAdministrasjon;
