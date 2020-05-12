import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { AdvarselVarsling } from '../varslinger/varsel-alertstriper';
import Lenke from 'nav-frontend-lenker';

interface PropTypes {
    reservertIKRR: boolean;
    settDigitalFeilet: boolean;
}

function AktiverDigitalOppfolgingVarsel(props: PropTypes): React.ReactElement {
    const { reservertIKRR, settDigitalFeilet } = props;

    if (settDigitalFeilet) {
        return <AdvarselVarsling tekst="Feilet. Prøv igjen senere!" className="sett-digital__varsel" />;
    }

    if (!reservertIKRR) {
        return (
            <AlertStripe type="advarsel" className="sett-digital__varsel">
                Du har ikke digital oppfølging fra NAV. Du har derfor ikke en digital aktivitetsplan.
            </AlertStripe>
        );
    } else {
        return (
            <AlertStripe type="advarsel" className="sett-digital__varsel">
                For å ta i bruk aktivitetsplanen, må du fjerne reservasjonen din mot digital kommunikasjon. &nbsp;
                <Lenke href={'https://www.norge.no/nn/reservasjon'}>Gå til Norge.no for å fjerne reservasjonen</Lenke>
            </AlertStripe>
        );
    }
}

export default AktiverDigitalOppfolgingVarsel;
