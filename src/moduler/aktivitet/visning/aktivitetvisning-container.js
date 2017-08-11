import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import moment from 'moment';
import { TILLAT_SLETTING } from '~config'; // eslint-disable-line
import {
    hentAktivitet,
    hentAktiviteter,
    settForrigeAktiveAktivitetId,
    fjernForrigeAktiveAktivitetId,
} from '../aktivitet-actions';
import { hentArenaAktiviteter } from '../../../ducks/arena-aktiviteter';
import Aktivitetvinsing from './aktivitetvisning';
import * as AppPT from '../../../proptypes';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../../constant';

function aktivitetvisningHeader(valgtAktivitet) {
    if (!valgtAktivitet) {
        return null;
    }

    const aktivitetErLaast =
        valgtAktivitet.status === STATUS_FULLFOERT ||
        valgtAktivitet.status === STATUS_AVBRUTT;

    return (
        <ModalHeader
            normalTekstId="aktivitetvisning.header"
            normalTekstValues={{
                status: valgtAktivitet.status,
                type: valgtAktivitet.type,
            }}
            className="side-innhold"
            aria-labelledby="modal-aktivitetsvisning-header"
            aktivitetErLaast={aktivitetErLaast}
        />
    );
}

class AktivitetvisningContainer extends Component {
    componentDidMount() {
        if (!isNaN(this.props.match.params.id)) {
            this.props.doHentAktivitet(this.props.match.params.id);
        }
        this.props.doFjernForrigeAktiveAktivitetId();
    }

    componentWillUnmount() {
        this.props.doSettForrigeAktiveAktivitetId(this.props.match.params.id);
    }

    aktivitetErEtterOppfolgingUtgang(valgtAktivitet) {
        return valgtAktivitet
            ? moment(this.props.situasjon.data.oppfolgingUtgang).isAfter(
                  valgtAktivitet.opprettetDato
              )
            : false;
    }

    render() {
        const { match, aktiviteter, arenaAktiviteter, situasjon } = this.props;
        const { id } = match.params;

        const alleAktiviter = aktiviteter.data.concat(arenaAktiviteter.data);
        const valgtAktivitet = alleAktiviter.find(
            aktivitet => aktivitet.id === id
        );

        const slettingErTillatt =
            valgtAktivitet &&
            !valgtAktivitet.historisk &&
            TILLAT_SLETTING &&
            (!situasjon.data.underOppfolging ||
                this.aktivitetErEtterOppfolgingUtgang(valgtAktivitet));

        return (
            <Modal
                contentLabel="aktivitetsvisning-modal"
                contentClass="aktivitetsvisning"
                avhengigheter={[aktiviteter, arenaAktiviteter]}
                minstEnAvhengighet
                header={aktivitetvisningHeader(valgtAktivitet)}
            >
                <Aktivitetvinsing
                    aktivitet={valgtAktivitet}
                    tillatSletting={slettingErTillatt}
                />
            </Modal>
        );
    }
}

AktivitetvisningContainer.propTypes = {
    match: PT.shape({ params: PT.shape({ id: PT.string }) }).isRequired,
    situasjon: AppPT.situasjon.isRequired,
    aktiviteter: PT.oneOfType([PT.arrayOf(AppPT.aktivitet), AppPT.aktivitet]),
    arenaAktiviteter: PT.oneOfType([PT.object, PT.arrayOf(PT.object)]),
    doHentAktivitet: PT.func.isRequired,
    doHentAktiviteter: PT.func.isRequired,
    doHentArenaAktiviteter: PT.func.isRequired,
    doSettForrigeAktiveAktivitetId: PT.func.isRequired,
    doFjernForrigeAktiveAktivitetId: PT.func.isRequired,
};

AktivitetvisningContainer.defaultProps = {
    aktiviteter: [],
    arenaAktiviteter: [],
};

const mapStateToProps = state => ({
    situasjon: state.data.situasjon,
    aktiviteter: state.data.aktiviteter,
    arenaAktiviteter: state.data.arenaAktiviteter,
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            doHentAktivitet: hentAktivitet,
            doHentAktiviteter: hentAktiviteter,
            doHentArenaAktiviteter: hentArenaAktiviteter,
            doSettForrigeAktiveAktivitetId: settForrigeAktiveAktivitetId,
            doFjernForrigeAktiveAktivitetId: fjernForrigeAktiveAktivitetId,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(
    withRouter(AktivitetvisningContainer)
);
