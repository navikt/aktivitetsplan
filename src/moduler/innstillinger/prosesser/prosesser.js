import React, { Component } from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import AvsluttOppfolgingProsess from '../avslutt-oppfolging/avslutt-oppfolging-prosess';
import StartOppfolgingProsess from '../start-oppfolging/start-oppfolging-prosess';
import SettManuellOppfolgingProsess from '../sett-manuell-oppfolging/sett-manuell-oppfolging-prosess';
import SettDigitalOppfolgingProsess from '../sett-digital-oppfolging/sett-digital-oppfolging-prosess';
import InnstillingHistorikk from '../historikk/innstilling-historikk';
import * as AppPT from '../../../proptypes';
import InnstillingerModal from '../innstillinger-modal';
import { hentSituasjonData } from '../innstillinger-reducer';
import Innholdslaster from '../../../felles-komponenter/utils/innholdslaster';

class Prosesser extends Component {
    componentDidMount() {
        this.props.doHentSituasjon();
    }
    render() {
        const { situasjon, innstillingerReducer } = this.props;
        return (
            <InnstillingerModal>
                <Innholdslaster avhengigheter={[innstillingerReducer]}>
                    <div>
                        <AvsluttOppfolgingProsess
                            hidden={!situasjon.underOppfolging}
                        />
                        <StartOppfolgingProsess hidden={!situasjon.kanStarte} />
                        <SettManuellOppfolgingProsess
                            hidden={situasjon.manuell}
                        />
                        <SettDigitalOppfolgingProsess
                            hidden={!situasjon.manuell}
                        />
                        <InnstillingHistorikk />
                    </div>
                </Innholdslaster>
            </InnstillingerModal>
        );
    }
}

Prosesser.defaultProps = {
    situasjon: undefined,
};

Prosesser.propTypes = {
    situasjon: AppPT.situasjon,
    doHentSituasjon: PT.func.isRequired,
    innstillingerReducer: AppPT.reducer.isRequired,
};

const mapStateToProps = state => ({
    innstillingerReducer: state.data.innstillinger,
    situasjon: state.data.innstillinger.data,
});

const mapDispatchToProps = dispatch => ({
    doHentSituasjon: () => dispatch(hentSituasjonData()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Prosesser);
