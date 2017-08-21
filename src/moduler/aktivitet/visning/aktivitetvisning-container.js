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
import {
    selectAktivitetListeStatus,
    selectAktivitetMedId,
    selectKanEndreAktivitetDetaljer,
} from '../aktivitetliste-selector';
import {
    selectErUnderOppfolging,
    selectOppfolgingUtgang,
    selectSituasjonStatus,
} from '../../situasjon/situasjon-selector';
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
        const {
            valgtAktivitet,
            doHentAktivitet,
            doFjernForrigeAktiveAktivitetId,
            match,
        } = this.props;
        if (valgtAktivitet) {
            doHentAktivitet(valgtAktivitet.id);
        } else {
            doHentAktivitet(match.params.id);
        }
        doFjernForrigeAktiveAktivitetId();
    }

    componentWillUnmount() {
        const { valgtAktivitet, doSettForrigeAktiveAktivitetId } = this.props;
        doSettForrigeAktiveAktivitetId(valgtAktivitet.id);
    }

    render() {
        const {
            avhengigheter,
            valgtAktivitet,
            slettingErTillatt,
            tillatEndring,
        } = this.props;
        return (
            <Modal
                contentLabel="aktivitetsvisning-modal"
                contentClass="aktivitetsvisning"
                avhengigheter={avhengigheter}
                minstEnAvhengighet
                header={aktivitetvisningHeader(valgtAktivitet)}
            >
                <Aktivitetvinsing
                    aktivitet={valgtAktivitet}
                    tillatSletting={slettingErTillatt}
                    tillatEndring={tillatEndring}
                />
            </Modal>
        );
    }
}

AktivitetvisningContainer.propTypes = {
    valgtAktivitet: AppPT.aktivitet.isRequired,
    avhengigheter: AppPT.avhengigheter.isRequired,
    tillatEndring: PT.bool.isRequired,
    slettingErTillatt: PT.bool.isRequired,
    match: PT.object.isRequired,
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

const mapStateToProps = (state, props) => {
    const { match } = props;
    const { id } = match.params;

    const valgtAktivitet = selectAktivitetMedId(state, id);

    const aktivitetErEtterOppfolgingUtgang = valgtAktivitet
        ? moment(selectOppfolgingUtgang(state)).isAfter(
              valgtAktivitet.opprettetDato
          )
        : false;

    const slettingErTillatt =
        valgtAktivitet &&
        !valgtAktivitet.historisk &&
        TILLAT_SLETTING &&
        (!selectErUnderOppfolging(state) || aktivitetErEtterOppfolgingUtgang);

    return {
        avhengigheter: [
            selectSituasjonStatus(state),
            selectAktivitetListeStatus(state),
        ],
        valgtAktivitet,
        tillatEndring: selectKanEndreAktivitetDetaljer(state, valgtAktivitet),
        slettingErTillatt,
    };
};

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

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetvisningContainer)
);
