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
import {
    UTDANNING_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    TILTAK_AKTIVITET_TYPE,
} from '../../../constant';
import { STATUS } from '../../../ducks/utils';
import { lukkAlle } from './underelement-for-aktivitet/underelementer-view-reducer';
import { selectArenaAktivitetStatus } from '../arena-aktivitet-selector';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { AVTALT_AKTIVITET_FORM_NAME } from './avtalt-container/avtalt-form';
import { STILLING_ETIKETT_FORM_NAME } from './etikett-oppdatering/stilling-etikett-form';
import { DirtyProvider } from '../../context/dirty-context';
import AktivitetvisningModal from './aktivitetvisning-modal';

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
        const { valgtAktivitet, ...props } = this.props;

        return (
            <DirtyProvider>
                <AktivitetvisningModal aktivitet={valgtAktivitet} {...props}>
                    <Aktivitetvisning aktivitet={valgtAktivitet} {...props} />
                </AktivitetvisningModal>
            </DirtyProvider>
        );
    }
}

AktivitetvisningContainer.propTypes = {
    valgtAktivitet: AppPT.aktivitet,
    avhengigheter: AppPT.avhengigheter.isRequired,
    laster: PT.bool.isRequired,
    doHentAktivitet: PT.func.isRequired,
    doHentArenaAktiviteter: PT.func.isRequired,
    doSettForrigeAktiveAktivitetId: PT.func.isRequired,
    doFjernForrigeAktiveAktivitetId: PT.func.isRequired,
    doLukkDialogEllerHistorikk: PT.func.isRequired,
    history: AppPT.history.isRequired,
    match: PT.object.isRequired,
    intl: intlShape.isRequired,
    formIsDirty: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
};

AktivitetvisningContainer.defaultProps = {
    valgtAktivitet: undefined,
};

const mapStateToProps = (state, props) => {
    const aktivitetId = props.match.params.id;
    const valgtAktivitet = selectAktivitetMedId(state, aktivitetId);

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
            isDirty(AVTALT_AKTIVITET_FORM_NAME)(state) ||
            isDirty(STILLING_ETIKETT_FORM_NAME)(state),
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

export default injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(AktivitetvisningContainer)
);
