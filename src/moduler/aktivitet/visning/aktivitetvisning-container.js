import PT from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { STATUS } from '../../../api/utils';
import * as AppPT from '../../../proptypes';
import { DirtyProvider } from '../../context/dirty-context';
import { selectErUnderOppfolging, selectOppfolgingStatus } from '../../oppfolging-status/oppfolging-selector';
import { hentAktivitet } from '../aktivitet-actions';
import { genererAktivtetskortId } from '../aktivitet-kort/Aktivitetskort';
import { selectAktivitetStatus } from '../aktivitet-selector';
import { selectAktivitetMedId, selectKanEndreAktivitetDetaljer } from '../aktivitetlisteSelector';
import { selectArenaAktivitetStatus } from '../arena-aktivitet-selector';
import { hentArenaAktiviteter } from '../arena-aktiviteter-reducer';
import Aktivitetvisning from './Aktivitetvisning';
import AktivitetvisningModal from './aktivitetvisning-modal';

class AktivitetvisningContainer extends Component {
    componentDidMount() {
        const { valgtAktivitet, doHentAktivitet, doHentArenaAktiviteter } = this.props;
        if (valgtAktivitet) {
            if (valgtAktivitet.arenaAktivitet) {
                doHentArenaAktiviteter();
            } else {
                doHentAktivitet(valgtAktivitet.id);
            }
        }
    }

    componentWillUnmount() {
        const { valgtAktivitet } = this.props;
        const aktivitetskort = valgtAktivitet && document.querySelector(`#${genererAktivtetskortId(valgtAktivitet)}`);
        if (aktivitetskort) {
            aktivitetskort.focus();
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
    match: PT.object.isRequired,
    underOppfolging: PT.bool.isRequired,
};

AktivitetvisningContainer.defaultProps = {
    valgtAktivitet: undefined,
};

const mapStateToProps = (state, props) => {
    const aktivitetId = props.match.params.id;
    const valgtAktivitet = selectAktivitetMedId(state, aktivitetId);

    const erArenaAktivitet = aktivitetId.startsWith('ARENA');
    const aktivitetDataStatus = erArenaAktivitet ? selectArenaAktivitetStatus(state) : selectAktivitetStatus(state);
    const laster = aktivitetDataStatus !== STATUS.OK;

    return {
        avhengigheter: [
            selectOppfolgingStatus(state),
            // merk at vi egentlig avhenger av både vanlige aktiviteter og arena-aktiviteter
            // MEN: vi ønsker å rendre med en gang vi har riktig aktivitet tilgjengelig, slik
            // at f.eks. visning av vanlige aktiviteter ikke følger responstidene til arena
            aktivitetDataStatus,
        ],
        valgtAktivitet,
        tillatEndring: selectKanEndreAktivitetDetaljer(state, valgtAktivitet),
        laster,
        underOppfolging: selectErUnderOppfolging(state),
    };
};

const mapDispatchToProps = (dispatch) =>
    bindActionCreators(
        {
            doHentAktivitet: hentAktivitet,
            doHentArenaAktiviteter: hentArenaAktiviteter,
        },
        dispatch
    );

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetvisningContainer);
