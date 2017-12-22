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
    selectKanIkkeStartaEskaleringen,
    selectErUnderKvpOppfolging,
} from '../../oppfolging-status/oppfolging-selector';
import {
    selectErManuell,
    selectInnstillingerStatus,
    selectKanStarteOppfolging,
} from '../innstillinger-selector';
import { selectMotpartSlice } from '../../motpart/motpart-selector';
import StartKvpPeriodeProsess from '../start-kvp-periode/start-kvp-periode-prosess';
import StoppKvpPeriodeProsess from '../stopp-kvp-periode/stopp-kvp-periode-prosess';

class Prosesser extends Component {
    componentDidMount() {
        this.props.doHentOppfolging();
    }

    render() {
        const {
            avhengigheter,
            erEskalert,
            erUnderOppfolging,
            erManuell,
            kanStarteOppfolging,
            kanIkkeStartaEskalering,
            erUnderKvpOppfolging,
            motpart,
        } = this.props;
        return (
            <InnstillingerModal ingenTilbakeKnapp>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <div>
                        <StartEskaleringProsess
                            hidden={kanIkkeStartaEskalering}
                        />
                        <StoppEskaleringProsess
                            hidden={!erEskalert || !erUnderOppfolging}
                        />
                        <AvsluttOppfolgingProsess hidden={!erUnderOppfolging} />
                        <StartOppfolgingProsess hidden={!kanStarteOppfolging} />
                        <SettManuellOppfolgingProsess
                            hidden={!erUnderOppfolging || erManuell}
                        />
                        <SettDigitalOppfolgingProsess
                            hidden={!erUnderOppfolging || !erManuell}
                        />
                        <OpprettOppgaveProsess motpart={motpart} />
                        <StartKvpPeriodeProsess hidden={!erUnderKvpOppfolging} />
                        <StoppKvpPeriodeProsess  hidden={erUnderKvpOppfolging} />
                        <InnstillingHistorikk />
                    </div>
                </Innholdslaster>
            </InnstillingerModal>
        );
    }
}

Prosesser.defaultProps = {
    erUnderOppfolging: undefined,
    erManuell: undefined,
    kanStarteOppfolging: undefined,
    kanIkkeStartaEskalering: undefined,
    erUnderKvpOppfolging: undefined,
};

Prosesser.propTypes = {
    doHentOppfolging: PT.func.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    erEskalert: PT.bool.isRequired,
    erUnderOppfolging: PT.bool,
    erManuell: PT.bool,
    kanStarteOppfolging: PT.bool,
    kanIkkeStartaEskalering: PT.bool,
    erUnderKvpOppfolging: PT.bool,
    motpart: AppPT.motpart.isRequired,
};

const mapStateToProps = state => ({
    avhengigheter: [selectInnstillingerStatus(state)],
    erEskalert: selectErEskalert(state),
    erUnderOppfolging: selectErUnderOppfolging(state),
    erManuell: selectErManuell(state),
    kanStarteOppfolging: selectKanStarteOppfolging(state),
    kanIkkeStartaEskalering: selectKanIkkeStartaEskaleringen(state),
    erUnderKvpOppfolging: selectErUnderKvpOppfolging(state),
    motpart: selectMotpartSlice(state),
});

const mapDispatchToProps = dispatch => ({
    doHentOppfolging: () => dispatch(hentOppfolgingData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Prosesser);
