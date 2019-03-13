import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import AvsluttOppfolgingProsess from '../avslutt-oppfolging/avslutt-oppfolging-prosess';
import StartOppfolgingProsess from '../start-oppfolging/start-oppfolging-prosess';
import SettManuellOppfolgingProsess from '../sett-manuell-oppfolging/sett-manuell-oppfolging-prosess';
import SettDigitalOppfolgingProsess from '../sett-digital-oppfolging/sett-digital-oppfolging-prosess';
import StartEskaleringProsess from '../start-eskalering/start-eskalering-prosess';
import StoppEskaleringProsess from '../stopp-eskalering/stopp-eskalering-prosess';
import OpprettOppgaveProsess from '../opprett-oppgave/opprett-oppgave-prosess';
import InnstillingHistorikk from '../historikk/innstilling-historikk';
import * as AppPT from '../../../proptypes';
import InnstillingerModal from '../innstillinger-modal';
import { hentOppfolgingData } from '../innstillinger-reducer';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import {
    selectErEskalert,
    selectErUnderOppfolging,
    selectErUnderKvp,
    selectReservasjonKRR,
    selectErBrukerManuell,
} from '../../oppfolging-status/oppfolging-selector';
import {
    selectInnstillingerStatus,
    selectKanStarteOppfolging,
} from '../innstillinger-selector';
import { selectMotpartSlice } from '../../motpart/motpart-selector';
import StartKvpPeriodeProsess from '../start-kvp-periode/start-kvp-periode-prosess';
import StoppKvpPeriodeProsess from '../stopp-kvp-periode/stopp-kvp-periode-prosess';
import { hentVeilederTilgang } from '../../../felles-komponenter/veilederTilgang/veileder-tilgang-reducer';
import {
    selectTilgangTilBrukersKontor,
    selectVeilederTilgangStatus,
} from '../../../felles-komponenter/veilederTilgang/veilder-tilgang-selector';
import RegistrerArbeidssokerProsess from '../registrer-arbeidssoker/registrer-arbeidssoker-prosess';
import Feature, {
    MANUELL_REGISTRERING,
} from '../../../felles-komponenter/feature/feature';

class Prosesser extends Component {
    componentDidMount() {
        this.props.doHentOppfolging();
        this.props.doHentVeilederTilgang();
    }

    render() {
        const {
            avhengigheter,
            motpart,
            skjulStartEskalering,
            skjulStopEskalering,
            skjulStartOppfolging,
            skjulAvsluttOppfolging,
            skjulSettManuell,
            skjulSettDigital,
            skjulStartKvp,
            skjulStopKvp,
            skjulRegistrerArbeidssoker,
        } = this.props;
        return (
            <InnstillingerModal ingenTilbakeKnapp>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <div>
                        <StartEskaleringProsess hidden={skjulStartEskalering} />
                        <StoppEskaleringProsess hidden={skjulStopEskalering} />
                        <StartOppfolgingProsess hidden={skjulStartOppfolging} />
                        <AvsluttOppfolgingProsess
                            hidden={skjulAvsluttOppfolging}
                        />
                        <SettManuellOppfolgingProsess
                            hidden={skjulSettManuell}
                        />
                        <SettDigitalOppfolgingProsess
                            hidden={skjulSettDigital}
                        />
                        <OpprettOppgaveProsess motpart={motpart} />
                        <Feature name={MANUELL_REGISTRERING}>
                            <RegistrerArbeidssokerProsess
                                hidden={skjulRegistrerArbeidssoker}
                            />
                        </Feature>
                        <StartKvpPeriodeProsess hidden={skjulStartKvp} />
                        <StoppKvpPeriodeProsess hidden={skjulStopKvp} />
                        <InnstillingHistorikk />
                    </div>
                </Innholdslaster>
            </InnstillingerModal>
        );
    }
}

Prosesser.defaultProps = {
    skjulStartEskalering: true,
    skjulStopEskalering: true,
    skjulStartOppfolging: true,
    skjulAvsluttOppfolging: true,
    skjulSettManuell: true,
    skjulSettDigital: true,
    skjulStartKvp: true,
    skjulStopKvp: true,
    skjulRegistrerArbeidssoker: true,
};

Prosesser.propTypes = {
    doHentOppfolging: PT.func.isRequired,
    doHentVeilederTilgang: PT.func.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    motpart: AppPT.motpart.isRequired,
    skjulStartEskalering: PT.bool,
    skjulStopEskalering: PT.bool,
    skjulStartOppfolging: PT.bool,
    skjulAvsluttOppfolging: PT.bool,
    skjulSettManuell: PT.bool,
    skjulSettDigital: PT.bool,
    skjulStartKvp: PT.bool,
    skjulStopKvp: PT.bool,
    skjulRegistrerArbeidssoker: PT.bool,
};

const mapStateToProps = state => ({
    avhengigheter: [
        selectInnstillingerStatus(state),
        selectVeilederTilgangStatus(state),
    ],
    motpart: selectMotpartSlice(state),
    skjulStartEskalering:
        !selectTilgangTilBrukersKontor(state) ||
        !selectErUnderOppfolging(state) ||
        selectErEskalert(state) ||
        selectReservasjonKRR(state) ||
        selectErBrukerManuell(state),
    skjulStopEskalering:
        !selectTilgangTilBrukersKontor(state) ||
        !selectErUnderOppfolging(state) ||
        !selectErEskalert(state),
    skjulStartOppfolging:
        !selectTilgangTilBrukersKontor(state) ||
        !selectKanStarteOppfolging(state),
    skjulAvsluttOppfolging:
        !selectTilgangTilBrukersKontor(state) ||
        !selectErUnderOppfolging(state),
    skjulSettManuell:
        !selectTilgangTilBrukersKontor(state) ||
        !selectErUnderOppfolging(state) ||
        selectErBrukerManuell(state),
    skjulSettDigital:
        !selectTilgangTilBrukersKontor(state) ||
        !selectErUnderOppfolging(state) ||
        !selectErBrukerManuell(state),
    skjulStartKvp:
        !selectTilgangTilBrukersKontor(state) ||
        !selectErUnderOppfolging(state) ||
        selectErUnderKvp(state),
    skjulStopKvp:
        !selectTilgangTilBrukersKontor(state) || !selectErUnderKvp(state),
    skjulRegistrerArbeidssoker:
        !selectTilgangTilBrukersKontor(state) || selectErUnderOppfolging(state),
});

const mapDispatchToProps = dispatch => ({
    doHentOppfolging: () => dispatch(hentOppfolgingData()),
    doHentVeilederTilgang: () => dispatch(hentVeilederTilgang()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Prosesser);
