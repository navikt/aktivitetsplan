import React from 'react';
import { FormattedMessage } from 'react-intl';
import AlertStripe from 'nav-frontend-alertstriper';
import { AdvarselVarsling } from '../varslinger/varsel-alertstriper';
import InternLenke from '../../felles-komponenter/utils/internLenke';

interface PropTypes {
    reservertIKRR: boolean;
    settDigitalFeilet: boolean;
    harTrykketRefresh: boolean;
}
function AktiverDigitalOppfolgingVarsel(props: PropTypes) {
    const { reservertIKRR, settDigitalFeilet, harTrykketRefresh } = props;
    const InformasjonContainer = () => (
        <div>
            Se video om&nbsp;
            <InternLenke href="/informasjon">aktivitetsplanen</InternLenke>
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
                            <InternLenke href={url}>
                                <FormattedMessage id="sett-digital.reservert-i-krr.lenketekst" />
                            </InternLenke>
                        </div>
                        <InformasjonContainer />
                    </AlertStripe>
                )}
            </FormattedMessage>
        );
    }
    if (settDigitalFeilet) {
        return <AdvarselVarsling tekstId="sett-digital.feilmelding" className="sett-digital__varsel" />;
    }
}

export default AktiverDigitalOppfolgingVarsel;
