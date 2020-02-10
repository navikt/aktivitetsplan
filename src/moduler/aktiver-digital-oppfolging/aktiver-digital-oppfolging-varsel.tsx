import React from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { AdvarselVarsling } from '../varslinger/varsel-alertstriper';
import InternLenke from '../../felles-komponenter/utils/internLenke';

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
                <InternLenke href={'https://www.norge.no/nn/reservasjon'}>
                    Gå til Norge.no for å fjerne reservasjonen
                </InternLenke>
            </AlertStripe>
        );
    }
}

export default AktiverDigitalOppfolgingVarsel;
