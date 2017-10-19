import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import PT from 'prop-types';
import moment from 'moment';
import { TILLAT_SLETTING } from '~config'; // eslint-disable-line
import {
    hentAktivitet,
    settForrigeAktiveAktivitetId,
    fjernForrigeAktiveAktivitetId,
} from '../aktivitet-actions';
import { hentArenaAktiviteter } from '../arena-aktiviteter-reducer';
import Aktivitetvinsing from './aktivitetvisning';
import * as AppPT from '../../../proptypes';
import {
    selectAktivitetMedId,
    selectKanEndreAktivitetDetaljer,
} from '../aktivitetliste-selector';
import {
    selectErUnderOppfolging,
    selectOppfolgingUtgang,
    selectOppfolgingStatus,
} from '../../oppfolging/oppfolging-selector';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../../constant';
import { STATUS } from '../../../ducks/utils';

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
            doHentArenaAktiviteter,
            doFjernForrigeAktiveAktivitetId,
        } = this.props;
        if (valgtAktivitet) {
            if (valgtAktivitet.arenaAktivitet) {
                doHentArenaAktiviteter();
            } else {
                doHentAktivitet(valgtAktivitet.id);
            }
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
    aktivitetId: PT.string.isRequired,
    valgtAktivitet: AppPT.aktivitet,
    avhengigheter: AppPT.avhengigheter.isRequired,
    tillatEndring: PT.bool.isRequired,
    slettingErTillatt: PT.bool.isRequired,
    doHentAktivitet: PT.func.isRequired,
    doHentArenaAktiviteter: PT.func.isRequired,
    doSettForrigeAktiveAktivitetId: PT.func.isRequired,
    doFjernForrigeAktiveAktivitetId: PT.func.isRequired,
};

AktivitetvisningContainer.defaultProps = {
    valgtAktivitet: undefined,
};

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);

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
            selectOppfolgingStatus(state),
            // merk at vi egentlig avhenger av både vanlige aktiviteter og arena-aktiviteter
            // MEN: vi ønsker å rendre med en gang vi har riktig aktivitet tilgjengelig, slik
            // at f.eks. visning av vanlige aktiviteter ikke følger responstidene til arena
            valgtAktivitet ? STATUS.OK : STATUS.PENDING,
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
            doHentArenaAktiviteter: hentArenaAktiviteter,
            doSettForrigeAktiveAktivitetId: settForrigeAktiveAktivitetId,
            doFjernForrigeAktiveAktivitetId: fjernForrigeAktiveAktivitetId,
        },
        dispatch
    );

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetvisningContainer)
);
