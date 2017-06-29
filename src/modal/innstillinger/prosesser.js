import React from 'react';
import { connect } from 'react-redux';
import AvsluttOppfolgingProsess from './avslutt-oppfolging-prosess';
import StartOppfolgingProsess from './start-oppfolging-prosess';
import SettManuellProsess from './sett-manuell-prosess';
import OppfolgingsperiodeHistorikk from './oppfolgingsperiode-historikk';
import * as AppPT from '../../proptypes';
import InnstillingerModal from './innstillinger-modal';

function Prosesser({ situasjon }) {
    return (
        <InnstillingerModal>
            <AvsluttOppfolgingProsess hidden={!situasjon.underOppfolging} />
            <StartOppfolgingProsess hidden={!situasjon.kanStarte} />
            <SettManuellProsess hidden={situasjon.manuell} />
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
