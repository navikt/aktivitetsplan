import React from 'react';
import { connect } from 'react-redux';
import AvsluttOppfolgingProsess from '../avslutt-oppfolging/avslutt-oppfolging-prosess';
import StartOppfolgingProsess from '../start-oppfolging/start-oppfolging-prosess';
import SettManuellOppfolgingProsess from '../sett-manuell-oppfolging/sett-manuell-oppfolging-prosess';
import SettDigitalOppfolgingProsess from '../sett-digital-oppfolging/sett-digital-oppfolging-prosess';
import OppfolgingsperiodeHistorikk from '../historikk/oppfolgingsperiode-historikk';
import * as AppPT from '../../../proptypes';
import InnstillingerModal from '../innstillinger-modal';

function Prosesser({ situasjon }) {
    return (
        <InnstillingerModal>
            <AvsluttOppfolgingProsess hidden={!situasjon.underOppfolging} />
            <StartOppfolgingProsess hidden={!situasjon.kanStarte} />
            <SettManuellOppfolgingProsess hidden={situasjon.manuell} />
            <SettDigitalOppfolgingProsess hidden={!situasjon.manuell} />
            <hr className="innstillinger__delelinje" />
            <OppfolgingsperiodeHistorikk />
        </InnstillingerModal>
    );
}

Prosesser.defaultProps = {
    situasjon: undefined,
};

Prosesser.propTypes = {
    situasjon: AppPT.situasjon,
};

const mapStateToProps = state => ({
    situasjon: state.data.situasjon.data,
});

export default connect(mapStateToProps)(Prosesser);
