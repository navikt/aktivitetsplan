import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { TILLAT_SLETTING } from '~config'; // eslint-disable-line
import { moment } from '../../../utils';
import {
    hentAktivitet,
    settForrigeAktiveAktivitetId,
    fjernForrigeAktiveAktivitetId,
} from '../aktivitet-actions';
import { hentArenaAktiviteter } from '../arena-aktiviteter-reducer';
import Aktivitetvisning from './aktivitetvisning';
import * as AppPT from '../../../proptypes';
import {
    selectAktivitetMedId,
    selectKanEndreAktivitetDetaljer,
} from '../aktivitetliste-selector';
import {
    selectErUnderOppfolging,
    selectOppfolgingUtgang,
    selectOppfolgingStatus,
} from '../../oppfolging-status/oppfolging-selector';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';
import {
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
    UTDANNING_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    TILTAK_AKTIVITET_TYPE,
} from '../../../constant';
import { STATUS } from '../../../ducks/utils';
import { lukkAlle } from './underelement-for-aktivitet/underelementer-view-reducer';
import { erPrivateBrukerSomSkalSkrusAv } from '../../privat-modus/privat-modus-selector';
import { selectArenaAktivitetStatus } from '../arena-aktivitet-selector';
import { selectAktivitetStatus } from '../aktivitet-selector';

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
            doLukkDialogEllerHistorikk,
        } = this.props;
        if (valgtAktivitet) {
            if (valgtAktivitet.arenaAktivitet) {
                doHentArenaAktiviteter();
            } else {
                doHentAktivitet(valgtAktivitet.id);
            }
        }
        doFjernForrigeAktiveAktivitetId();
        doLukkDialogEllerHistorikk();
    }

    componentWillUnmount() {
        const { valgtAktivitet, doSettForrigeAktiveAktivitetId } = this.props;
        doSettForrigeAktiveAktivitetId(valgtAktivitet.id);
    }

    render() {
        const { avhengigheter, valgtAktivitet, ...props } = this.props;
        return (
            <Modal
                contentLabel="aktivitetsvisning-modal"
                contentClass="aktivitetsvisning"
                avhengigheter={avhengigheter}
                header={aktivitetvisningHeader(valgtAktivitet)}
            >
                <Aktivitetvisning aktivitet={valgtAktivitet} {...props} />
            </Modal>
        );
    }
}

AktivitetvisningContainer.propTypes = {
    aktivitetId: PT.string.isRequired,
    valgtAktivitet: AppPT.aktivitet,
    avhengigheter: AppPT.avhengigheter.isRequired,
    laster: PT.bool.isRequired,
    doHentAktivitet: PT.func.isRequired,
    doHentArenaAktiviteter: PT.func.isRequired,
    doSettForrigeAktiveAktivitetId: PT.func.isRequired,
    doFjernForrigeAktiveAktivitetId: PT.func.isRequired,
    doLukkDialogEllerHistorikk: PT.func.isRequired,
    privateMode: PT.bool.isRequired,
};

AktivitetvisningContainer.defaultProps = {
    valgtAktivitet: undefined,
};

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);

    const erArenaAktivitet = [
        TILTAK_AKTIVITET_TYPE,
        GRUPPE_AKTIVITET_TYPE,
        UTDANNING_AKTIVITET_TYPE,
    ].includes(valgtAktivitet.type);
    const aktivitetDataStatus = erArenaAktivitet
        ? selectArenaAktivitetStatus(state)
        : selectAktivitetStatus(state);

    const aktivitetErEtterOppfolgingUtgang = valgtAktivitet
        ? moment(selectOppfolgingUtgang(state)).isAfter(
              valgtAktivitet.opprettetDato
          )
        : false;

    const tillatSletting =
        valgtAktivitet &&
        !valgtAktivitet.historisk &&
        TILLAT_SLETTING &&
        (!selectErUnderOppfolging(state) || aktivitetErEtterOppfolgingUtgang);
    const laster = aktivitetDataStatus !== STATUS.OK;

    return {
        avhengigheter: [
            selectOppfolgingStatus(state),
            // merk at vi egentlig avhenger av både vanlige aktiviteter og arena-aktiviteter
            // MEN: vi ønsker å rendre med en gang vi har riktig aktivitet tilgjengelig, slik
            // at f.eks. visning av vanlige aktiviteter ikke følger responstidene til arena
            valgtAktivitet ? STATUS.OK : STATUS.PENDING,
        ],
        privateMode: erPrivateBrukerSomSkalSkrusAv(state), // todo remove me
        valgtAktivitet,
        tillatEndring: selectKanEndreAktivitetDetaljer(state, valgtAktivitet),
        tillatSletting,
        laster,
    };
};

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            doHentAktivitet: hentAktivitet,
            doHentArenaAktiviteter: hentArenaAktiviteter,
            doSettForrigeAktiveAktivitetId: settForrigeAktiveAktivitetId,
            doFjernForrigeAktiveAktivitetId: fjernForrigeAktiveAktivitetId,
            doLukkDialogEllerHistorikk: lukkAlle,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(
    AktivitetvisningContainer
);
