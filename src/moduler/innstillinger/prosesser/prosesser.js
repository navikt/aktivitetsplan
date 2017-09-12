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
import { hentSituasjonData } from '../innstillinger-reducer';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';
import {
    selectErEskalert,
    selectErUnderOppfolging,
} from '../../situasjon/situasjon-selector';
import {
    selectErManuell,
    selectInnstillingerStatus,
    selectKanStarteOppfolging,
} from '../innstillinger-selector';

class Prosesser extends Component {
    componentDidMount() {
        this.props.doHentSituasjon();
    }

    render() {
        const {
            avhengigheter,
            erEskalert,
            erUnderOppfolging,
            erManuell,
            kanStarteOppfolging,
        } = this.props;
        return (
            <InnstillingerModal>
                <Innholdslaster avhengigheter={avhengigheter}>
                    <div>
                        <StartEskaleringProsess hidden={erEskalert} />
                        <StoppEskaleringProsess hidden={!erEskalert} />
                        <AvsluttOppfolgingProsess hidden={!erUnderOppfolging} />
                        <StartOppfolgingProsess hidden={!kanStarteOppfolging} />
                        <SettManuellOppfolgingProsess
                            hidden={!erUnderOppfolging || erManuell}
                        />
                        <SettDigitalOppfolgingProsess
                            hidden={!erUnderOppfolging || !erManuell}
                        />
                        <OpprettOppgaveProsess />
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
};

Prosesser.propTypes = {
    doHentSituasjon: PT.func.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    erEskalert: PT.bool.isRequired,
    erUnderOppfolging: PT.bool,
    erManuell: PT.bool,
    kanStarteOppfolging: PT.bool,
};

const mapStateToProps = state => ({
    avhengigheter: [selectInnstillingerStatus(state)],
    erEskalert: selectErEskalert(state),
    erUnderOppfolging: selectErUnderOppfolging(state),
    erManuell: selectErManuell(state),
    kanStarteOppfolging: selectKanStarteOppfolging(state),
});

const mapDispatchToProps = dispatch => ({
    doHentSituasjon: () => dispatch(hentSituasjonData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Prosesser);
