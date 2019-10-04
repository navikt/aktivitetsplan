import React from 'react';
import { FormattedMessage } from 'react-intl';
import PT from 'prop-types';
import AlertStripe from 'nav-frontend-alertstriper';
import { AdvarselVarsling } from '../varslinger/varsel-alertstriper';
import Lenke from '../../felles-komponenter/utils/lenke';

function AktiverDigitalOppfolgingVarsel({ reservertIKRR, settDigitalFeilet, harTrykketRefresh }) {
    const InformasjonContainer = () => (
        <div>
            Se video om &nbsp;
            <Lenke href="/informasjon">aktivitetsplanen</Lenke>
        </div>
    );

    if (!reservertIKRR && !settDigitalFeilet) {
        return (
            <AlertStripe type="advarsel" className="sett-digital__varsel">
                <div>
                    <FormattedMessage id="sett-digital.manuell-oppfolging.infotekst" />
                </div>
                <InformasjonContainer />
            </AlertStripe>
        );
    }
    if (reservertIKRR && !settDigitalFeilet) {
        const resertvertTekst = harTrykketRefresh
            ? 'sett-digital.reservert-i-krr.fjern.reservasjon.infotekst'
            : 'sett-digital.reservert-i-krr.infotekst';
        return (
            <FormattedMessage id="sett-digital.reservert-i-krr.url-lenke">
                {url => (
                    <AlertStripe type="advarsel" className="sett-digital__varsel">
                        <div className="blokk-s">
                            <FormattedMessage id={resertvertTekst} />
                            &nbsp;
                            <Lenke href={url}>
                                <FormattedMessage id="sett-digital.reservert-i-krr.lenketekst" />
                            </Lenke>
                        </div>
                        <InformasjonContainer />
                    </AlertStripe>
                )}
            </FormattedMessage>
        );
    }
    if (settDigitalFeilet) {
        return <AdvarselVarsling tekst="Feilet. Prøv igjen sennere!" className="sett-digital__varsel" />;
    }
}

AktiverDigitalOppfolgingVarsel.propTypes = {
    reservertIKRR: PT.bool.isRequired,
    settDigitalFeilet: PT.bool.isRequired,
    harTrykketRefresh: PT.bool.isRequired
};

export default AktiverDigitalOppfolgingVarsel;
