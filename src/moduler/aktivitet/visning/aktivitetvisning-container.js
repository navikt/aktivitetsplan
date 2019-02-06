import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';
import PT from 'prop-types';
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
import { selectArenaAktivitetStatus } from '../arena-aktivitet-selector';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { AKTIVITET_STATUS_FORM_NAME } from './status-oppdatering/aktivitet-status-form';
import { LUKK_MODAL } from '../../../felles-komponenter/modal/modal-reducer';
import { AVTALT_AKTIVITET_FORM_NAME } from './avtalt-container/avtalt-form';
import { STILLING_ETIKETT_FORM_NAME } from './etikett-oppdatering/stilling-etikett-form';
import { OPPDATER_REFERAT_FORM_NAME } from './status-oppdatering/oppdater-referat-form';
import {
    NY_HENVENDELSE_AKTIVITET_FORM_NAME,
    DIALOG_AKTIVITET_FORM_NAME,
} from './underelement-for-aktivitet/underelementer-for-aktivitet';

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
        if (valgtAktivitet) {
            doSettForrigeAktiveAktivitetId(valgtAktivitet.id);
        }
    }

    render() {
        const {
            avhengigheter,
            valgtAktivitet,
            history,
            intl,
            formIsDirty,
            lukkModal,
            ...props
        } = this.props;
        return (
            <Modal
                contentLabel="aktivitetsvisning-modal"
                contentClass="aktivitetsvisning"
                avhengigheter={avhengigheter}
                header={aktivitetvisningHeader(valgtAktivitet)}
                onRequestClose={() => {
                    const dialogTekst = intl.formatMessage({
                        id: 'aktkivitet-skjema.lukk-advarsel',
                    });
                    // eslint-disable-next-line no-alert
                    if (!formIsDirty || confirm(dialogTekst)) {
                        history.push('/');
                        lukkModal();
                    }
                }}
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
    history: AppPT.history.isRequired,
    intl: intlShape.isRequired,
    formIsDirty: PT.bool.isRequired,
    lukkModal: PT.func.isRequired,
    underOppfolging: PT.bool.isRequired,
};

AktivitetvisningContainer.defaultProps = {
    valgtAktivitet: undefined,
};

const mapStateToProps = (state, props) => {
    const valgtAktivitet = selectAktivitetMedId(state, props.aktivitetId);

    const erArenaAktivitet =
        !!valgtAktivitet &&
        [
            TILTAK_AKTIVITET_TYPE,
            GRUPPE_AKTIVITET_TYPE,
            UTDANNING_AKTIVITET_TYPE,
        ].includes(valgtAktivitet.type);
    const aktivitetDataStatus = erArenaAktivitet
        ? selectArenaAktivitetStatus(state)
        : selectAktivitetStatus(state);

    const laster = aktivitetDataStatus !== STATUS.OK;

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
        laster,
        underOppfolging: selectErUnderOppfolging(state),
        formIsDirty:
            isDirty(AKTIVITET_STATUS_FORM_NAME)(state) ||
            isDirty(AVTALT_AKTIVITET_FORM_NAME)(state) ||
            isDirty(STILLING_ETIKETT_FORM_NAME)(state) ||
            isDirty(OPPDATER_REFERAT_FORM_NAME)(state) ||
            isDirty(
                `${NY_HENVENDELSE_AKTIVITET_FORM_NAME}-${props.aktivitetId}`
            )(state) ||
            isDirty(`${DIALOG_AKTIVITET_FORM_NAME}-${props.aktivitetId}`)(
                state
            ),
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
            lukkModal: () => dispatch({ type: LUKK_MODAL }),
        },
        dispatch
    );

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetvisningContainer)
);
