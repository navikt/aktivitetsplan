import React from 'react';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import connect from 'react-redux/es/connect/connect';
import { Normaltekst } from 'nav-frontend-typografi';
import StartProsess from '../prosesser/start-prosess';
import hiddenIfHoc from '../../../felles-komponenter/hidden-if/hidden-if';
import * as AppPT from '../../../proptypes';
import { selectBruker } from '../../bruker/bruker-selector';
import { getEnhetFromUrl } from '../opprett-oppgave/opprett-oppgave-utils';
import {
    erITestMiljo,
    finnMiljoStreng,
    finnNaisDomene,
} from '../../../utils/miljo-utils';

function byggRegistreringUrl(fnr, enhet) {
    return `https://arbeidssokerregistrering${finnMiljoStreng()}${finnNaisDomene()}?fnr=${fnr}&enhetId=${enhet}`;
}

function byggRegistreringMedVeilarbLoginUrl(fnr, enhet) {
    return `https://veilarblogin${finnMiljoStreng()}${finnNaisDomene()}veilarblogin/api/start?url=${byggRegistreringUrl(
        fnr,
        enhet
    )}`;
}

function RegistrerArbeidssokerProsess({ bruker }) {
    const fnr = bruker.fodselsnummer;
    const enhetId = getEnhetFromUrl();
    const registreringUrl = erITestMiljo()
        ? byggRegistreringMedVeilarbLoginUrl(fnr, enhetId)
        : byggRegistreringUrl(fnr, enhetId);

    return (
        <StartProsess
            className="innstillinger__prosess"
            tittelId="innstillinger.prosess.registrer-arbeidssoker.tittel"
            knappetekstId="innstillinger.modal.prosess.start.knapp"
            onClick={() => {
                window.location.href = registreringUrl;
            }}
        >
            <div className="blokk-xs">
                <Normaltekst>
                    <FormattedMessage id="innstillinger.prosess.registrer-arbeidssoker.tekst" />
                </Normaltekst>
            </div>
        </StartProsess>
    );
}

const mapStateToProps = state => ({
    bruker: selectBruker(state),
});

RegistrerArbeidssokerProsess.propTypes = {
    bruker: AppPT.bruker.isRequired,
};

export default withRouter(
    connect(mapStateToProps)(hiddenIfHoc(RegistrerArbeidssokerProsess))
);
